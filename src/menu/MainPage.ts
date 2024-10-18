import { getDungeonKey, saveDungeon } from '../data/dungeonStorage'
import { getDungeonFromStr } from '../data/dungeonStr'
import { ActionList } from '../editor/ActionList'
import { button, div, input, label } from '../libs/df'
import { Header } from '../utils/Header'
import { openAlert, openPrompt } from '../utils/prompt'
import { selectDungeon } from './selectDungeon'

export function MainPage() {
    return div(
        Header(),
        div(
            { className: 'main-page-content' },
            ActionList({
                async Play() {
                    const result = await selectDungeon()
                    if (result) {
                        location.assign(`#/dungeon/${getDungeonKey(result)}`)
                    }
                },
                Create() {
                    location.assign(`#/edit/`)
                },
                async Edit() {
                    const result = await selectDungeon()
                    if (result) {
                        location.assign(`#/edit/${getDungeonKey(result)}`)
                    }
                },
                async Import() {
                    openPrompt((resolve) => {
                        const inputEl = input()
                        return div(
                            div(label('Dungeon share code:', inputEl)),
                            div(
                                button(
                                    {
                                        onClick: () => {
                                            resolve(null)
                                            try {
                                                const dungeon = getDungeonFromStr(inputEl.value)
                                                const saved = saveDungeon(dungeon)
                                                openAlert(`Import Successful: ${saved.name}`)
                                            } catch {
                                                openAlert('Import Failed')
                                            }
                                        },
                                    },
                                    'Import'
                                )
                            )
                        )
                    })
                },
            })
        )
    )
}
