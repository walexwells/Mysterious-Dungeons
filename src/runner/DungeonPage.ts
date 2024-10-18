import { getDungeon } from '../data/dungeonStorage'
import { ActionList } from '../editor/ActionList'
import { div, h1 } from '../libs/df'
import { GameGrid } from './GameGrid'
import { Game } from './Game'
import { subscribeToKeyboardGameActions } from './subscribeToKeyboardGameActions'
import { openPrompt } from '../utils/prompt'
import { DungeonCompletePrompt } from './DungeonCompletePrompt'
import { GameInfoPanel } from './GameInfoPanel'
import { createStyle, css } from '../utils/css'
import { TouchControls } from './TouchControls'

export function DungeonPage(dungeonName: string) {
    const dungeon = getDungeon(dungeonName)
    if (!dungeon) {
        location.assign('#/')
        return new Text('Error')
    }

    const game = Game(dungeon)
    const dispose = subscribeToKeyboardGameActions(game.doAction)

    game.state.onChange((gameState) => {
        if (gameState.done) {
            dispose()
            openPrompt(DungeonCompletePrompt(gameState, dungeon))
        }
    })

    const dungeonPage = div(
        {
            onDisconnected: dispose,
        },
        h1(dungeon.name),
        div(
            { className: 'DungeonPage-Content' },
            div(GameGrid(game), GameInfoPanel(game)),
            div(
                ActionList([
                    {
                        label: 'Restart',
                        action: () => location.reload(),
                    },
                    {
                        label: 'Exit',
                        action: () => location.assign('#/'),
                    },
                ]),
                TouchControls(game.doAction)
            )
        )
    )

    return dungeonPage
}

createStyle(css`
    .DungeonPage-Content {
        display: block flex;
    }
`)
