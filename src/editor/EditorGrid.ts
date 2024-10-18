import { gridCellSize } from '../data/constants'
import { div } from '../libs/df'
import { EditorCell } from './EditorCell'
import { EditorSession } from './EditorSession'

export function EditorGrid(editorSession: EditorSession) {
    function startPainting(event: MouseEvent) {
        if (event.button === 0) {
            event.preventDefault()
            event.stopPropagation()
            editorSession.painting = true
        }
    }

    const editorGrid = div({
        className: 'grid',
        style: {
            width: gridCellSize * editorSession.width + 'px',
            height: gridCellSize * editorSession.height + 'px',
        },
        onMousedown: startPainting,
        onMouseup: () => {
            if (editorSession.painting) {
                editorSession.painting = false
            }
        },
        onMouseleave: (event: MouseEvent) => {
            if (editorSession.painting && event.target === editorGrid) {
                editorSession.painting = false
            }
        },
    })

    let tiles = editorSession.tiles
    editorSession.changes.subscribe(() => {
        if (tiles !== editorSession.tiles) {
            tiles = editorSession.tiles
            clearCells()
            createCells()
        }
    })

    createCells()

    return editorGrid

    function clearCells() {
        while (editorGrid.firstChild) {
            editorGrid.firstChild.remove()
        }
    }

    function createCells() {
        editorGrid.style.width = gridCellSize * editorSession.width + 'px'
        editorGrid.style.height = gridCellSize * editorSession.height + 'px'

        for (let i = 0; i < editorSession.tiles.length; i++) {
            editorGrid.append(EditorCell(i, editorSession))
        }
    }
}
