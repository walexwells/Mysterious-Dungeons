import { deleteDungeon, getDungeon, getDungeonKey, saveDungeon } from '../data/dungeonStorage'
import { getDungeonStr } from '../data/dungeonStr'
import { Header } from '../utils/Header'
import { div, form, h2, input, label } from '../libs/df'
import { openPrompt } from '../utils/prompt'
import { selectDungeon } from '../menu/selectDungeon'
import { ActionList } from './ActionList'
import { TilePicker } from './TilePicker'
import { Dynamic } from '../libs/dynamics/DynamicValue'
import { EditorSession } from './EditorSession'
import { IDungeon } from './IDungeon'
import { ResizableEditorGrid } from './ResizableEditorGrid'

export function EditorPage(initialDungeonName?: string) {
    const dungeon = getDungeon(initialDungeonName)

    const editorSession = new EditorSession(dungeon)

    const pickerEl = TilePicker(editorSession)
    const nameForm = DungeonNameForm(editorSession)
    const leftPanel = div({ className: 'editor-left-panel' }, nameForm, pickerEl)

    const dungeonEditorGridEl = ResizableEditorGrid(editorSession)

    function getDungeonName() {
        return (new FormData(nameForm).get('dungeonName') as string).trim()
    }

    const DungeonEditor = div(
        Header(h2(': Editor')),
        div({ className: 'dungeon-editor' }, leftPanel, div(dungeonEditorGridEl))
    )
    editorSession.changes.publish(editorSession)
    return DungeonEditor
}

function DungeonNameForm(editorSession: EditorSession) {
    const name = Dynamic(editorSession.name)
    name.onChange((x) => editorSession.setName(x))
    editorSession.changes.subscribe((x) => x.name !== name.get() && name.set(x.name))
    const inputEl = input({
        name: 'dungeonName',
        value: name,
        onChange: () => name.set(inputEl.value),
    })
    return form(label('Dungeon name: ', inputEl))
}

function EditorActions(editorSession: EditorSession) {
    function save(): IDungeon {
        const dungeon = editorSession.getDungeon()
        const savedDungeon = saveDungeon(dungeon)
        editorSession.setName(savedDungeon.name || '')
        return savedDungeon
    }

    return ActionList([
        {
            label: 'Save & Play',
            action: () => {
                const dungeon = save()
                if (dungeon.name) {
                    location.assign(`#/dungeon/${getDungeonKey(dungeon.name)}`)
                }
            },
        },
        {
            label: 'Load',
            action: async () => {
                const dungeon = await selectDungeon()
                if (dungeon) {
                    location.assign('#/edit/' + getDungeonKey(dungeon))
                }
            },
        },
        {
            label: 'Save',
            action: () => {
                const dungeon = save()
                if (dungeon.name) {
                    location.assign('#/edit/' + getDungeonKey(dungeon.name))
                }
            },
        },
        {
            label: 'Delete',
            action: async () => {
                const result = await openPrompt<boolean>({
                    message: 'Are you sure you want to delete this dungeon?',
                    options: [
                        { label: 'Cancel', value: false },
                        { label: 'Delete', value: true, color: 'red' },
                    ],
                })
                if (result) {
                    deleteDungeon(getDungeonKey(getDungeonName()))
                    location.assign(`#/`)
                }
            },
        },
        {
            label: 'Get Share Code',
            action: () => {
                const d = save()
                const shareStr = getDungeonStr(d)
                openPrompt<null>(() => div({ className: 'share-code' }, shareStr))
            },
        },
        {
            label: 'Exit Editor',
            action: () => {
                location.assign(`#/`)
            },
        },
    ])
}
