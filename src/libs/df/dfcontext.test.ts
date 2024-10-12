import { expect, suite as describe, it } from 'vitest'
import { fireEvent, screen } from '@testing-library/dom'

import { DfNode } from './DfNode'
import { button, div } from './elements'
import { createContext } from '../dom-context/context'
import { Dynamic } from '../dynamics/DynamicValue'

describe('context config for df elements', () => {
    it('allows creation of requestors and providers', () => {
        const countContext = createContext<number>('my-count')

        function CountProvider(...children: DfNode[]) {
            const count = Dynamic(0)

            function increment() {
                count.set(count.get() + 1)
            }

            return div(
                {
                    context: (x) => x.provide(countContext, count),
                },
                button({ onclick: increment }, 'Increment'),
                children
            )
        }

        function CountRequestor() {
            const count = Dynamic(-1)

            return div({ context: (x) => x.request(countContext, count) }, 'The Count is: ', count)
        }

        // act: initial render
        document.body.append(CountProvider('some stuff', div('more things', CountRequestor())))

        // assert
        expect(screen.getByText('The Count is: 0')).toBeTruthy()

        // act: update
        fireEvent.click(screen.getByText('Increment'))

        // assert
        expect(screen.getByText('The Count is: 1')).toBeTruthy()
    })
})
