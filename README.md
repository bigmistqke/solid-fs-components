<p>
  <img width="100%" src="https://assets.solidjs.com/banner?type=solid-fs-components&background=tiles&project=%20" alt="solid-fs-components">
</p>

# solid-fs-components (WIP)

[![pnpm](https://img.shields.io/badge/maintained%20with-pnpm-cc00ff.svg?style=for-the-badge&logo=pnpm)](https://pnpm.io/)

Headless components for visualizing and interacting with a reactive filesystem.

**solid-fs-components** provides headless components for file explorers and folder trees in [SolidJS](https://www.solidjs.com/). You bring the UI — it handles the logic.

## Installation

```bash
pnpm add @bigmistqke/solid-fs-components
```

## Components

- [x] [FileTree](#filetree)
- [ ] FileList (yet to implement)
- [ ] FileGrid (yet to implement)

## FileTree

The `<FileTree>` component is a headless UI component designed to manage and render a reactive view of filesystem directories and files. This component handles the state and logic for expanding, collapsing, selecting, and moving files and directories.

### Features

- 📁 Expand and collapse directories
- 🖱️ Multi-selection with ctrl-click/cmd-click
- 🖱️ Range selection with shift-click
- ⌨️ Keyboard navigation including space to toggle folders
- 🚀 Drag-and-drop to reorganize entries
- ✏️ Inline renaming
- 🌍 ~~Compatible with any reactive filesystem model~~ (currently only sync filesystems supported)

### Usage

```tsx
<FileTree
  base="/"
  fs={yourFileSystem}
  onRename={(oldPath, newPath) => console.log(`Renamed \${oldPath} → \${newPath}`)}
>
  {(dirEnt, fileTree) => (
    <FileTree.DirEnt>
      <FileTree.IndentGuides render={kind => <span class="indent" data-kind={kind()} />} />
      <FileTree.Expanded collapsed={<span>▶</span>} expanded={<span>▼</span>} />
      <FileTree.Name editable />
    </FileTree.DirEnt>
  )}
</FileTree>
```

### Props

- `base`: Root path to begin rendering from (default is `"/"`).
- `fs`: An implementation of the FileSystem interface:
  - `readdir(path)`: Retrieves directories and files.
  - `rename(oldPath, newPath)`: Moves or renames files or directories.
  - `exists(path)`: Checks if a path exists.

### Compound Components

#### FileTree.DirEnt

This subcomponent wraps individual directory or file entries, handling all user interactions such as selection, focus, drag-and-drop, and expand/collapse operations.

#### FileTree.IndentGuides

Renders visual guides indicating the nesting level of each directory, customizable via a render prop.

#### FileTree.Expanded

Provides a toggle icon indicating whether a directory is expanded or collapsed.

#### FileTree.Name

Displays and optionally allows editing of the directory or file name.

## FileSystem Interface

To use `FileTree`, you need to implement the following FileSystem interface:

```ts
interface FileSystem {
  readdir(path: string): Array<{ path: string; type: 'file' | 'dir' }>
  rename(oldPath: string, newPath: string): void
  exists(path: string): boolean
}
```

### Context Hooks

- **useFileTree()**: Access the file tree context for operations like expanding, collapsing, selecting, or moving entries.
- **useDirEnt()**: Access the properties and methods related to the directory entry currently being rendered.
- **useIndentGuide()** Access the indent guide kind

### API

#### useFileTree

```ts
{
  getDirEntsOfDirId(path: string): Array<DirEnt>
  expandDirById(id: string): void
  collapseDirById(id: string): void
  isDirExpandedById(id: string): boolean
  resetSelectedDirEntIds(): void
  moveToPath(path: string): void
  selectDirEntById(id: string): void
  shiftSelectDirEntById(id: string): void
  deselectDirEntById(id: string): void
  focusDirEnt(path: string): void
  blurDirEnt(path: string): void
  isDirEntFocused(path: string): boolean
  pathToId(path: string): string
}
```

#### useDirEnt

```ts
{
  id: string,
  path: string,
  name: string,
  type: "file" | "dir",
  selected: boolean,
  focused: boolean,
  indentation: number,
  select(): void,
  deselect(): void,
  shiftSelect(): void,
  rename(path: string): void,
  focus(): void,
  blur(): void,
  expand?(): void,
  collapse?(): void,
  expanded?: boolean
}
```

### useIndentGuide()

Used inside `<FileTree.IndentGuides>` to get the current guide kind:

```ts
const kind = useIndentGuide() // returns Accessor<"pipe" | "tee" | "elbow" | "spacer">
```

## License

MIT © 2025
