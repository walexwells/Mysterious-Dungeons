import { IDungeon } from '../editor/IDungeon'
import { div, h3, button } from '../libs/df'
import { GameState } from './GameState'

export function DungeonCompletePrompt(
    gameState: GameState,
    dungeon: IDungeon
): (resolve: (v: string | null) => void) => HTMLElement {
    if (!gameState.done) throw new Error('gameState.done should be true')

    const remainingTreasure = gameState.tiles.filter((x) => x.symbol === 'treasure').length

    return (resolve) => {
        return div(
            h3('You escaped the dungeon!'),
            div(`Treasure: ${gameState.treasure}/${gameState.treasure + remainingTreasure}`),
            div(
                button(
                    {
                        onClick: () => (
                            resolve(null), dungeon.name ? location.reload() : location.assign('#/')
                        ),
                    },
                    'Try Again?'
                ),
                button({ onClick: () => (resolve(null), location.assign('#/')) }, 'Exit')
            )
        )
    }
}
