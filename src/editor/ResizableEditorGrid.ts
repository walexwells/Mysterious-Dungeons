import { div, button } from '../libs/df/elements'
import { createStyle, css } from '../utils/css'
import { EditorGrid } from './EditorGrid'
import { EditorSession } from './EditorSession'

export function ResizableEditorGrid(editorSession: EditorSession) {
    return div(
        { className: 'ResizableEditorGrid' },
        div(
            button({ onClick: () => editorSession.addRowToTop() }, '+'),
            button({ onClick: () => editorSession.removeRowFromTop() }, '-')
        ),
        div(
            button({ onClick: () => editorSession.addColumnToLeft() }, '+'),
            button({ onClick: () => editorSession.removeColumnFromLeft() }, '-')
        ),
        EditorGrid(editorSession),
        div(
            button({ onClick: () => editorSession.addColumnToRight() }, '+'),
            button({ onClick: () => editorSession.removeColumnFromRight() }, '-')
        ),
        div(
            button({ onClick: () => editorSession.addRowToBottom() }, '+'),
            button({ onClick: () => editorSession.removeRowFromBottom() }, '-')
        )
    )
}
createStyle(css`
    :root {
        --ResizableEditorGrid-gutter: 40px;
    }

    .ResizableEditorGrid {
        display: grid;
        grid-template-columns: var(--ResizableEditorGrid-gutter) max-content var(
                --ResizableEditorGrid-gutter
            );
        grid-template-rows: var(--ResizableEditorGrid-gutter) max-content var(
                --ResizableEditorGrid-gutter
            );
    }
    .ResizableEditorGrid > :nth-child(1) {
        grid-column: 2;
        grid-row: 1;
        display: flex;
        justify-content: center;
    }
    .ResizableEditorGrid > :nth-child(2) {
        grid-column: 1;
        grid-row: 2;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
    .ResizableEditorGrid > :nth-child(3) {
        grid-column: 2;
        grid-row: 2;
    }
    .ResizableEditorGrid > :nth-child(4) {
        grid-column: 3;
        grid-row: 2;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
    .ResizableEditorGrid > :nth-child(5) {
        grid-column: 2;
        grid-row: 3;
        display: flex;
        justify-content: center;
    }

    .ResizableEditorGrid button {
        width: 25px;
        height: 25px;
        font-weight: light;
    }
`)
