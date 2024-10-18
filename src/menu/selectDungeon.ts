import { getDungeonNames } from '../data/dungeonStorage'
import { ActionList } from '../editor/ActionList'
import { openPrompt } from '../utils/prompt'

export function selectDungeon() {
    return openPrompt<string>((resolve) => {
        return ActionList(
            getDungeonNames().map((d) => ({
                label: d,
                action: () => resolve(d),
            }))
        )
    })
}
