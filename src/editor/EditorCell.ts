import { gridCellSize } from '../data/constants'
import { div } from '../libs/df/elements'
import { tileList } from '../data/tileList'
import { drawTile } from '../utils/drawTile'
import { EditorSession } from './EditorSession'

export function EditorCell(tileIndex: number, editorSession: EditorSession) {
    const x = tileIndex % editorSession.width
    const y = Math.floor(tileIndex / editorSession.width)

    const editorCell = div({
        className: 'tile',
        style: {
            width: gridCellSize + 'px',
            height: gridCellSize + 'px',
            top: y * gridCellSize + 'px',
            left: x * gridCellSize + 'px',
        },
        onmouseenter: () => editorSession.painting && editorSession.paintTile(tileIndex),
        onclick: () => editorSession.paintTile(tileIndex),
        onDisconnected: () => unsubscribe(),
    })

    const unsubscribe = editorSession.changes.subscribe(() =>
        drawTile(editorCell, tileList[editorSession.tiles[tileIndex]], true)
    )

    return editorCell
}
