import { Key, keyArray } from '@solid-primitives/keyed'
import { ReactiveMap } from '@solid-primitives/map'
import {
  type Accessor,
  batch,
  type ComponentProps,
  createComputed,
  createContext,
  createEffect,
  createMemo,
  createSelector,
  createSignal,
  Index,
  type JSX,
  mapArray,
  mergeProps,
  onCleanup,
  onMount,
  Show,
  splitProps,
  untrack,
  useContext,
} from 'solid-js'
import { createStore } from 'solid-js/store'
import { CTRL_KEY, Overwrite, PathUtils, type WrapEvent } from 'src/utils'
import { type FileSystem } from '../create-file-system'

interface DirEntBase {
  id: string
  path: string
  indentation: number
  name: string
  select(): void
  shiftSelect(): void
  deselect(): void
  rename(path: string): void
  selected: boolean
  focus(): void
  blur(): void
  focused: boolean
}

interface File extends DirEntBase {
  type: 'file'
}

interface Dir extends DirEntBase {
  type: 'dir'
  expand(): void
  collapse(): void
  expanded: boolean
}

type DirEnt = File | Dir

/**********************************************************************************/
/*                                                                                */
/*                                    Contexts                                    */
/*                                                                                */
/**********************************************************************************/

interface FileTreeContext<T> {
  fs: Pick<FileSystem<T>, 'readdir' | 'rename' | 'exists'>
  base: string
  getDirEntsOfDirId(path: string): Array<DirEnt>
  // Expand/Collapse
  expandDirById(id: string): void
  collapseDirById(id: string): void
  isDirExpandedById(id: string): boolean
  // Selection
  resetSelectedDirEntIds(): void
  moveToPath(path: string): void
  selectDirEntById(id: string): void
  shiftSelectDirEntById(id: string): void
  deselectDirEntById(id: string): void
  // Focus
  focusDirEnt(path: string): void
  blurDirEnt(path: string): void
  isDirEntFocused(path: string): boolean
  // Id Generator
  pathToId(path: string): string
}

const FileTreeContext = createContext<FileTreeContext<any>>()
export function useFileTree() {
  const context = useContext(FileTreeContext)
  if (!context) throw new Error(`FileTreeContext is undefined`)
  return context
}

const DirEntContext = createContext<Accessor<DirEnt>>()
export function useDirEnt() {
  const context = useContext(DirEntContext)
  if (!context) throw new Error(`DirEntContext is undefined`)
  return context
}

type IndentGuideKind = 'pipe' | 'tee' | 'elbow' | 'spacer'

const IndentGuideContext = createContext<Accessor<IndentGuideKind>>()
export function useIndentGuide() {
  const context = useContext(IndentGuideContext)
  if (!context) throw new Error(`IndentGuideContext is undefined`)
  return context
}

/**********************************************************************************/
/*                                                                                */
/*                                createIdGenerator                               */
/*                                                                                */
/**********************************************************************************/

type IdNode = {
  refCount: number
  id: string
}

// ID Generation Middleware
function createIdGenerator() {
  const freeIds: Array<string> = []
  const pathToNodeMap = new Map<string, IdNode>()
  const idToPathMap = new ReactiveMap<string, string>()
  let nextId = 0

  function createIdNode(path: string, refCount = 1) {
    const node = {
      id: allocId(),
      refCount,
    }
    pathToNodeMap.set(path, node)
    idToPathMap.set(node.id, path)
    return node
  }
  function renameIdNode({ oldPath, newPath }: { oldPath: string; newPath: string }) {
    const node = pathToNodeMap.get(oldPath)
    if (node) {
      pathToNodeMap.delete(oldPath)
      pathToNodeMap.set(newPath, node)
      idToPathMap.set(node.id, newPath)
    }
  }
  function allocId() {
    return freeIds.pop() ?? (nextId++).toString()
  }
  function disposeId(id: string) {
    freeIds.push(id)
  }
  function addCleanup(node: IdNode) {
    onCleanup(() => {
      node.refCount--
      if (node.refCount <= 0) {
        // queue microtask just in case there is only one listener
        queueMicrotask(() => {
          // check if refCount got incremented before reaching the microtask
          if (node.refCount > 0) {
            return
          }
          const path = idToPathMap.get(node.id)
          disposeId(node.id)
          idToPathMap.delete(node.id)
          if (path) {
            pathToNodeMap.delete(path)
          }
        })
      }
    })
  }

  return {
    /** Rebases paths of idNodes */
    beforeRename(oldPath: string, newPath: string) {
      const renamesToDo = [{ oldPath, newPath }]
      for (const path of pathToNodeMap.keys()) {
        if (
          path.length > oldPath.length &&
          path.slice(0, oldPath.length) === oldPath &&
          path[oldPath.length] === '/'
        ) {
          const postfix = path.slice(oldPath.length)
          renamesToDo.push({ oldPath: oldPath + postfix, newPath: newPath + postfix })
        }
      }
      renamesToDo.forEach(renameIdNode)
    },
    /**
     * - If idNode of given path exist
     *     - Increments its reference count
     * - If idNode of given path does not yet exist
     *     - Creates an idNode from the given path with reference count 1
     */
    obtainId(path: string): string {
      let node = pathToNodeMap.get(path)
      if (node) {
        node.refCount++
      } else {
        node = createIdNode(path)
      }
      addCleanup(node)
      return node.id
    },
    /**
     * - Increments reference count of given ID's idNode
     * - Adds cleanup-function that will decrement the reference count
     */
    freezeId(id: string) {
      const path = untrack(() => idToPathMap.get(id))
      if (path === undefined) {
        return
      }
      const node = pathToNodeMap.get(path)
      if (node !== undefined) {
        node.refCount++
        addCleanup(node)
      }
    },
    /** Reactively converts an ID back to a path */
    idToPath(id: string): string {
      const path = idToPathMap.get(id)
      if (path === undefined) {
        throw new Error(`path not found for id: ${id}`)
      }
      return path
    },
    /**
     * Converts a path back to an ID
     * - If idNode of given path does not exist
     *     - If no second argument is given _or_ second argument is `true`
     *         - Throws error
     *     - If second argument is `false`
     *         - Creates an idNode with reference count 0
     */
    pathToId(path: string, assert = true): string {
      let node = pathToNodeMap.get(path)
      if (node === undefined) {
        if (assert) {
          throw new Error(`node not found for path: ${path}`)
        } else {
          node = createIdNode(path, 0)
        }
      }
      return node.id
    },
  }
}

/**********************************************************************************/
/*                                                                                */
/*                                    FileTree                                    */
/*                                                                                */
/**********************************************************************************/

export type FileTreeProps<T> = Overwrite<
  ComponentProps<'div'>,
  {
    base?: string
    children: (dirEnt: Accessor<DirEnt>, fileTree: FileTreeContext<T>) => JSX.Element
    fs: Pick<FileSystem<T>, 'readdir' | 'rename' | 'exists'>
    onDragOver?(event: WrapEvent<DragEvent, HTMLDivElement>): void
    onDrop?(event: WrapEvent<DragEvent, HTMLDivElement>): void
    onRename?(oldPath: string, newPath: string): void
    onSelectedPaths?(paths: string[]): void
    selectedPaths?: Array<string>
    sort?(dirEnt1: DirEnt, dirEnt2: DirEnt): number
  }
>

export function FileTree<T>(props: FileTreeProps<T>) {
  const [config, rest] = splitProps(mergeProps({ base: '' }, props), ['fs', 'base'])

  const { obtainId, freezeId, beforeRename, idToPath, pathToId } = createIdGenerator()

  const baseId = createMemo(() => obtainId(config.base))

  // Focused DirEnt
  const [focusedDirEntId, setFocusedDirEntId] = createSignal<string | undefined>()

  const isDirEntFocusedById = createSelector(focusedDirEntId)

  function focusDirEntById(id: string) {
    setFocusedDirEntId(id)
  }
  function blurDirEntById(id: string) {
    if (focusedDirEntId() === id) {
      setFocusedDirEntId()
    }
  }

  // Cleanup of removed dirEnt from focusedDirEntId
  createEffect(() => {
    const _focusedDirEntId = focusedDirEntId()
    if (_focusedDirEntId && !props.fs.exists(idToPath(_focusedDirEntId))) {
      setFocusedDirEntId()
    }
  })

  // Selected DirEnts
  const [selectedDirEntSpans, setSelectedDirEntSpans] = createSignal<Array<Array<string>>>([], {
    equals: false,
  })

  const selectedDirEntIds = createMemo(() => Array.from(new Set(selectedDirEntSpans().flat())))

  const isDirEntSelectedById = createSelector(selectedDirEntIds, (id: string, dirs) =>
    dirs.includes(id),
  )

  // Selection-methods
  function selectDirEntById(id: string) {
    setSelectedDirEntSpans(dirEnts => [...dirEnts, [id]])
  }

  function deselectDirEntById(id: string) {
    setSelectedDirEntSpans(pairs => pairs.map(dirEnts => dirEnts.filter(dirEnt => dirEnt !== id)))
  }

  function shiftSelectDirEntById(id: string) {
    setSelectedDirEntSpans(ranges => {
      // If the selection-ranges are empty, initialize it
      if (ranges.length === 0) {
        return [[id]]
      }

      const lastRange = ranges[ranges.length - 1]!

      // If the last range is empty, initialize last range
      if (lastRange.length === 0) {
        ranges[ranges.length - 1] = [id]
        return ranges
      }

      const startId = ranges[ranges.length - 1]![0]!
      const startIndex = flatTree().findIndex(dir => dir.id === startId)
      const endIndex = flatTree().findIndex(dir => dir.id === id)

      ranges[ranges.length - 1] = flatTree()
        .slice(Math.min(startIndex, endIndex), Math.max(startIndex, endIndex) + 1)
        .map(dirEnt => dirEnt.id)

      if (startIndex > endIndex) {
        ranges[ranges.length - 1]?.reverse()
      }

      return ranges
    })
  }

  function resetSelectedDirEntIds() {
    setSelectedDirEntSpans([])
  }

  // Cleanup of removed dirs from expandedDirIds
  createEffect(
    mapArray(selectedDirEntIds, id => {
      createEffect(() => {
        if (!props.fs.exists(idToPath(id))) {
          deselectDirEntById(id)
        }
      })
    }),
  )

  // Expand/Collapse Dirs
  const [expandedDirIds, setExpandedDirIds] = createSignal<Array<string>>(new Array(), {
    equals: false,
  })

  const isDirExpandedById = createSelector(expandedDirIds, (id: string, expandedDirs) =>
    expandedDirs.includes(id),
  )

  function collapseDirById(id: string) {
    setExpandedDirIds(dirs => dirs.filter(dir => dir !== id))
  }
  function expandDirById(id: string) {
    if (id !== baseId() && !expandedDirIds().includes(id)) {
      setExpandedDirIds(ids => [...ids, id])
    }
  }

  // Cleanup of removed dirs from expandedDirIds
  createEffect(
    mapArray(expandedDirIds, id => {
      createEffect(() => {
        if (!props.fs.exists(idToPath(id))) {
          collapseDirById(id)
        }
      })
    }),
  )

  // Record<Dir, Accessor<DirEnts>>
  const [dirEntsByDirId, setDirEntsByDirId] = createStore<Record<string, Accessor<Array<DirEnt>>>>(
    {},
  )

  function getDirEntsOfDirId(id: string) {
    return dirEntsByDirId[id]?.() || []
  }

  // Populate dirEntsByDir
  createEffect(
    mapArray(
      () => [baseId(), ...expandedDirIds()],
      id => {
        const unsortedDirEnts = createMemo<Array<Dir | File>>(
          keyArray(
            () => {
              if (!props.fs.exists(idToPath(id))) {
                return null
              }
              return props.fs.readdir(idToPath(id), { withFileTypes: true }).map(dirEnt => ({
                id: obtainId(dirEnt.path),
                type: dirEnt.type,
              }))
            },
            dirEnt => dirEnt.id,
            dirEnt => {
              const indentation = createMemo(() => getIndentationFromPath(idToPath(dirEnt().id)))
              const name = createMemo(() => PathUtils.getName(idToPath(dirEnt().id))!)

              return {
                id: dirEnt().id,
                get type() {
                  return dirEnt().type
                },
                get path() {
                  return idToPath(dirEnt().id)
                },
                get indentation() {
                  return indentation()
                },
                get name() {
                  return name()
                },
                select() {
                  selectDirEntById(dirEnt().id)
                },
                deselect() {
                  deselectDirEntById(dirEnt().id)
                },
                shiftSelect() {
                  shiftSelectDirEntById(dirEnt().id)
                },
                get selected() {
                  return isDirEntSelectedById(dirEnt().id)
                },
                rename(newPath: string) {
                  renameDirEnt(idToPath(dirEnt().id), newPath)
                },
                focus() {
                  focusDirEntById(dirEnt().id)
                },
                blur() {
                  blurDirEntById(dirEnt().id)
                },
                get focused() {
                  return isDirEntFocusedById(dirEnt().id)
                },
                // Dir-specific API
                get expand() {
                  if (dirEnt().type === 'file') return undefined
                  return () => expandDirById(dirEnt().id)
                },
                get collapse() {
                  if (dirEnt().type === 'file') return undefined
                  return () => collapseDirById(dirEnt().id)
                },
                get expanded() {
                  if (dirEnt().type === 'file') return undefined
                  return isDirExpandedById(dirEnt().id)
                },
              } as DirEnt
            },
          ),
        )

        const sortedDirEnts = createMemo(() =>
          unsortedDirEnts().toSorted(
            props.sort ??
              ((a, b) => {
                if (a.type !== b.type) {
                  return a.type === 'dir' ? -1 : 1
                }
                return a.path.toLowerCase() < b.path.toLowerCase() ? -1 : 1
              }),
          ),
        )

        setDirEntsByDirId(id, () => sortedDirEnts)
        onCleanup(() => setDirEntsByDirId(id, undefined!))
      },
    ),
  )

  // DirEnts as a flat list
  const flatTree = createMemo(() => {
    const list = new Array<DirEnt>()
    const idStack = [baseId()]
    while (idStack.length > 0) {
      const id = idStack.shift()!
      const dirEnts = getDirEntsOfDirId(id)
      idStack.push(
        ...dirEnts.filter(dirEnt => dirEnt.type === 'dir' && dirEnt.expanded).map(dir => dir.id),
      )
      list.splice(list.findIndex(dirEnt => dirEnt.id === id) + 1, 0, ...dirEnts)
    }
    return list
  })

  function getIndentationFromPath(path: string) {
    return path.split('/').length - config.base.split('/').length
  }

  function renameDirEnt(oldPath: string, newPath: string) {
    batch(() => {
      beforeRename(oldPath, newPath)
      props.fs.rename(oldPath, newPath)
      props.onRename?.(oldPath, newPath)
    })
  }

  function moveToPath(targetPath: string) {
    const _focusedDirEntId = focusedDirEntId()

    if (!_focusedDirEntId) {
      throw new Error('Attempted to moveToPath without dirEnt focused')
    }

    const targetId = pathToId(targetPath)
    const ids = selectedDirEntIds().includes(_focusedDirEntId)
      ? selectedDirEntIds()
      : [_focusedDirEntId]
    const paths = ids.map(idToPath)
    const existingPaths = new Array<{ newPath: string; oldPath: string }>()

    // Validate if any of the selected paths are ancestor of the target path
    for (const path of paths) {
      if (path === targetPath) {
        throw new Error(`Cannot move ${path} into itself.`)
      }
      if (PathUtils.isAncestor(targetPath, path)) {
        throw new Error(`Cannot move because ${path} is ancestor of ${targetPath}.`)
      }
    }

    const transforms = paths
      .sort((a, b) => (a.toLowerCase() < b.toLowerCase() ? -1 : 1))
      .map((oldPath, index, arr) => {
        const ancestor = arr.slice(0, index).find(path => PathUtils.isAncestor(oldPath, path))

        const newPath = (
          ancestor
            ? // If the selection contains an ancestor of the current path
              // the path is renamed relative to the ancestor
              [targetPath, PathUtils.getName(ancestor), oldPath.replace(`${ancestor}/`, '')]
            : [targetPath, PathUtils.getName(oldPath)]
        )
          .filter(Boolean)
          .join('/')

        if (props.fs.exists(newPath)) {
          existingPaths.push({ oldPath, newPath })
        }

        return { oldPath, newPath, shouldRename: !ancestor }
      })

    if (existingPaths.length > 0) {
      throw new Error(
        `Error while moving dirEnts. The following paths already exist:\n${existingPaths
          .map(({ newPath }) => newPath)
          .join('\n')}`,
      )
    }

    // Apply transforms
    batch(() => {
      // Rename the dirEnt in the fileSystem
      transforms.forEach(({ oldPath, newPath, shouldRename }) => {
        if (!shouldRename) return
        renameDirEnt(oldPath, newPath)
      })

      // Expand the target-dir (if it wasn't opened yet)
      if (!isDirExpandedById(targetId)) {
        expandDirById(targetId)
      }
    })
  }

  const fileTreeContext: FileTreeContext<T> = {
    get fs() {
      return config.fs
    },
    get base() {
      return config.base
    },
    getDirEntsOfDirId,
    moveToPath,
    pathToId,
    expandDirById,
    collapseDirById,
    isDirExpandedById,
    selectDirEntById,
    deselectDirEntById,
    shiftSelectDirEntById,
    resetSelectedDirEntIds,
    focusDirEnt: focusDirEntById,
    blurDirEnt: blurDirEntById,
    isDirEntFocused: isDirEntFocusedById,
  }

  // Call event handler with current selection
  createEffect(() => props.onSelectedPaths?.(selectedDirEntIds().map(idToPath)))

  // Update selection from props
  createComputed(
    () => props.selectedPaths?.map(path => pathToId(path, false)).forEach(selectDirEntById),
  )

  // Freeze ID numbers for selected entries
  createComputed(() => selectedDirEntIds().forEach(freezeId))
  // Freeze ID numbers for expanded dirs
  createComputed(() => expandedDirIds().forEach(freezeId))

  return (
    <div
      {...rest}
      onDragOver={event => {
        event.preventDefault()
        props.onDragOver?.(event)
      }}
      onDrop={event => {
        moveToPath(config.base)
        props.onDrop?.(event)
      }}
    >
      <FileTreeContext.Provider value={fileTreeContext}>
        <Key each={flatTree()} by={item => item.id}>
          {dirEnt => (
            <DirEntContext.Provider value={dirEnt}>
              {untrack(() => props.children(dirEnt, fileTreeContext))}
            </DirEntContext.Provider>
          )}
        </Key>
      </FileTreeContext.Provider>
    </div>
  )
}

FileTree.DirEnt = function (
  props: Overwrite<
    ComponentProps<'button'>,
    {
      ref?(element: HTMLButtonElement): void
      onDragOver?(event: WrapEvent<DragEvent, HTMLButtonElement>): void
      onDragStart?(event: WrapEvent<DragEvent, HTMLButtonElement>): void
      onDrop?(event: WrapEvent<DragEvent, HTMLButtonElement>): void
      onMove?(parent: string): void
      onPointerUp?(event: WrapEvent<PointerEvent, HTMLButtonElement>): void
      onFocus?(event: WrapEvent<FocusEvent, HTMLButtonElement>): void
      onBlur?(event: WrapEvent<FocusEvent, HTMLButtonElement>): void
    }
  >,
) {
  const config = mergeProps({ draggable: true }, props)
  const fileTree = useFileTree()
  const dirEnt = useDirEnt()

  const handlers = {
    ref(element: HTMLButtonElement) {
      createEffect(() => {
        if (dirEnt().focused) {
          element.focus()
        }
      })
      props.ref?.(element)
    },
    onPointerUp(event: WrapEvent<PointerEvent, HTMLButtonElement>) {
      const _dirEnt = dirEnt()

      batch(() => {
        // Handle dirEnt-selection
        if (event.shiftKey) {
          dirEnt().shiftSelect()
        } else {
          if (event[CTRL_KEY]) {
            // Toggle selection when ctrl is pressed
            if (!dirEnt().selected) {
              dirEnt().select()
            } else {
              dirEnt().deselect()
            }
          } else {
            // Reset selection to this dirEnt
            fileTree.resetSelectedDirEntIds()
            dirEnt().select()
          }
        }
        // Handle dir-expand/collapse
        if (_dirEnt.type === 'dir') {
          if (_dirEnt.expanded) {
            _dirEnt.collapse()
          } else {
            _dirEnt.expand()
          }
        }
      })

      props.onPointerUp?.(event)
    },
    onDragOver: (event: WrapEvent<DragEvent, HTMLButtonElement>) => {
      event.preventDefault()
      props.onDragOver?.(event)
    },
    onDrop: (event: WrapEvent<DragEvent, HTMLButtonElement>) => {
      event.preventDefault()
      event.stopPropagation()
      const _dirEnt = dirEnt()

      if (_dirEnt.type === 'dir') {
        fileTree.moveToPath(_dirEnt.path)
      } else {
        fileTree.moveToPath(PathUtils.getParent(_dirEnt.path))
      }

      props.onDrop?.(event)
    },
    onFocus(event: WrapEvent<FocusEvent, HTMLButtonElement>) {
      dirEnt().focus()
      props.onFocus?.(event)
    },
    onBlur(event: WrapEvent<FocusEvent, HTMLButtonElement>) {
      dirEnt().blur()
      props.onBlur?.(event)
    },
  }

  return (
    <Show
      when={dirEnt().type === 'dir'}
      fallback={<button {...config} {...handlers} />}
      children={_ => (
        <Show when={dirEnt().path}>
          <button {...config} {...handlers}>
            {props.children}
          </button>
        </Show>
      )}
    />
  )
}

FileTree.IndentGuides = function (props: {
  render: (type: Accessor<IndentGuideKind>) => JSX.Element
}) {
  const dirEnt = useDirEnt()
  const fileTree = useFileTree()

  function isLastChild(path: string) {
    const parentPath = PathUtils.getParent(path)

    if (parentPath === fileTree.base) {
      return false
    }

    const dirEnts = fileTree.getDirEntsOfDirId(fileTree.pathToId(parentPath))
    const index = dirEnts.findIndex(dirEnt => dirEnt.path === path)

    return index === dirEnts.length - 1
  }

  function getAncestorAtLevel(index: number) {
    return dirEnt()
      .path.split('/')
      .slice(0, index + 2)
      .join('/')
  }

  function getGuideKind(index: number) {
    const isLastGuide = dirEnt().indentation - index === 1

    return isLastGuide && isLastChild(dirEnt().path)
      ? 'elbow'
      : isLastChild(getAncestorAtLevel(index))
      ? 'spacer'
      : isLastGuide
      ? 'tee'
      : 'pipe'
  }

  return (
    <Index each={Array.from({ length: dirEnt().indentation }, (_, index) => getGuideKind(index))}>
      {kind => (
        <IndentGuideContext.Provider value={kind}>{props.render(kind)}</IndentGuideContext.Provider>
      )}
    </Index>
  )
}

FileTree.Expanded = function (
  props: ComponentProps<'span'> & {
    expanded: JSX.Element
    collapsed: JSX.Element
  },
) {
  const [, rest] = splitProps(props, ['expanded', 'collapsed'])
  const dirEnt = useDirEnt()
  return (
    <Show when={dirEnt().type === 'dir'}>
      <span {...rest}>
        <Show when={(dirEnt() as Dir).expanded} fallback={props.expanded}>
          {props.collapsed}
        </Show>
      </span>
    </Show>
  )
}

FileTree.Name = function (props: {
  editable?: boolean
  style?: JSX.CSSProperties
  class?: string
  onBlur?(event: WrapEvent<FocusEvent, HTMLInputElement>): void
}) {
  const dirEnt = useDirEnt()
  const fileTree = useFileTree()

  function rename(element: HTMLInputElement) {
    const newPath = PathUtils.rename(dirEnt().path, element.value)

    if (newPath === dirEnt().path) {
      return
    }

    if (fileTree.fs.exists(newPath)) {
      element.value = dirEnt().name
      throw new Error(`Path ${newPath} already exists.`)
    }

    dirEnt().rename(newPath)
    dirEnt().focus()
  }

  return (
    <Show
      when={props.editable}
      fallback={
        <span class={props.class} style={props.style}>
          {dirEnt().name}
        </span>
      }
    >
      <input
        ref={element => {
          onMount(() => {
            element.focus()
            const value = element.value
            const dotIndex = value.indexOf('.')
            const end = dotIndex === -1 ? value.length : dotIndex
            element.setSelectionRange(0, end)
          })
        }}
        class={props.class}
        style={{ all: 'unset', ...props.style }}
        value={dirEnt().name}
        spellcheck={false}
        onKeyDown={event => {
          if (event.code === 'Enter') {
            rename(event.currentTarget)
          }
        }}
        onBlur={event => {
          if (fileTree.fs.exists(dirEnt().path)) {
            rename(event.currentTarget)
          }
          props.onBlur?.(event)
        }}
      />
    </Show>
  )
}
