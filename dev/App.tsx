import { Split } from '@bigmistqke/solid-grid-split'
import { createSignal, onMount, type Component } from 'solid-js'
import { TmTextarea } from 'tm-textarea/solid'
import { createFileSystem, DefaultIndentGuide, FileTree, PathUtils } from '../src'
import styles from './App.module.css'

const project = import.meta.glob('../**/*', { as: 'raw', eager: true })

function transform(path: string, current: string): string {
  const base = new URL(current + '/', 'file:///') // simulate a file URL
  const projectRoot = new URL('../', base) // one level up from current
  const resolved = new URL(path, base)
  const rel = resolved.pathname.slice(projectRoot.pathname.length)
  return decodeURIComponent(rel)
}

const App: Component = () => {
  const [selectedFile, setSelectedFile] = createSignal<string>('index0.ts')

  const fs = createFileSystem<string>()

  async function populate() {
    for (const path of Object.keys(project)) {
      const transformedPath = transform(path, 'dev')
      const parts = transformedPath.split('/')
      const dirs = parts.slice(0, -1)

      for (let i = 0; i <= dirs.length; i++) {
        const path = dirs.slice(0, i).join('/')
        if (!fs.exists(path)) {
          fs.mkdir(path)
        }
      }

      fs.writeFile(transformedPath, project[path]!)
    }
  }
  populate()

  const grammar = () => {
    const _selected = selectedFile()
    if (_selected?.endsWith('css')) {
      return 'css'
    }
    if (_selected?.endsWith('html')) {
      return 'html'
    }
    return 'tsx'
  }

  const currentFile = () => {
    const _selectedFile = selectedFile()
    if (_selectedFile && fs.exists(_selectedFile)) {
      return fs.readFile(_selectedFile)
    }
    return ''
  }

  return (
    <Split class={styles.app}>
      <Split.Pane size="175px">
        <FileTree
          fs={fs}
          class={styles.custom}
          onRename={(oldPath, newPath) =>
            setSelectedFile(file => PathUtils.rebase(file, oldPath, newPath))
          }
        >
          {dirEnt => {
            const [editable, setEditable] = createSignal(false)

            onMount(() => {
              if (dirEnt().focused && dirEnt().type === 'file') {
                setSelectedFile(dirEnt().path)
              }
            })

            return (
              <FileTree.DirEnt
                class={styles.dirEnt}
                style={{
                  background: dirEnt().selected ? '#484f6c' : undefined,
                }}
                onDblClick={() => setEditable(true)}
                onMouseDown={() => {
                  if (dirEnt().type === 'file') {
                    setSelectedFile(dirEnt().path)
                  }
                }}
                onKeyDown={e => {
                  const _dirEnt = dirEnt()
                  switch (e.code) {
                    case 'Enter':
                      setEditable(editable => !editable)
                      break
                    case 'Space':
                      if (_dirEnt.type === 'dir') {
                        if (_dirEnt.expanded) {
                          _dirEnt.collapse()
                        } else {
                          _dirEnt.expand()
                        }
                      } else {
                        setSelectedFile(_dirEnt.path)
                      }
                      break
                  }
                }}
              >
                <FileTree.IndentGuides
                  render={() => <DefaultIndentGuide color="white" width={15} />}
                />
                <FileTree.Expanded
                  collapsed="-"
                  expanded="+"
                  style={{ width: '15px', 'text-align': 'center' }}
                />
                <FileTree.Name
                  editable={editable()}
                  style={{ 'margin-left': dirEnt().type === 'file' ? '7.5px' : undefined }}
                  onBlur={() => setEditable(false)}
                />
              </FileTree.DirEnt>
            )
          }}
        </FileTree>
      </Split.Pane>
      <Split.Handle size="5px" style={{ background: 'lightgrey', cursor: 'ew-resize' }} />
      <Split.Pane size="1fr" style={{ display: 'grid', 'grid-template-rows': '1fr auto' }}>
        <TmTextarea
          value={currentFile()}
          grammar={grammar()}
          class={styles.textarea}
          theme="andromeeda"
          onInput={event => fs.writeFile(selectedFile()!, event.currentTarget.value)}
        />
        <input
          placeholder="p.ex fs.writeFile('test2.ts', 'Hello World!')"
          class={styles.input}
          onKeyDown={event => {
            if (event.code === 'Enter') {
              eval(event.currentTarget.value)
              event.currentTarget.value = ''
            }
          }}
        />
      </Split.Pane>
    </Split>
  )
}

export default App
