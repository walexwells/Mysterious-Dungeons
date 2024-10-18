import { describe, expect, it, test, vi } from 'vitest'
import { a, df, div, span, button, input, DfElementConfig } from '.'
import { Dynamic } from '../dynamics/DynamicValue'
import { ConnectionEvent } from '../connection-events/ConnectionEvent'
import { createContext } from '../dom-context/context'

// prettier-ignore
const tags = {"a": HTMLAnchorElement,"abbr": HTMLElement,"address": HTMLElement,"area": HTMLAreaElement,"article": HTMLElement,"aside": HTMLElement,"audio": HTMLAudioElement,"b": HTMLElement,"base": HTMLBaseElement,"bdi": HTMLElement,"bdo": HTMLElement,"blockquote": HTMLQuoteElement,"body": HTMLBodyElement,"br": HTMLBRElement,"button": HTMLButtonElement,"canvas": HTMLCanvasElement,"caption": HTMLTableCaptionElement,"cite": HTMLElement,"code": HTMLElement,"col": HTMLTableColElement,"colgroup": HTMLTableColElement,"data": HTMLDataElement,"datalist": HTMLDataListElement,"dd": HTMLElement,"del": HTMLModElement,"details": HTMLDetailsElement,"dfn": HTMLElement,"dialog": HTMLDialogElement,"div": HTMLDivElement,"dl": HTMLDListElement,"dt": HTMLElement,"em": HTMLElement,"embed": HTMLEmbedElement,"fieldset": HTMLFieldSetElement,"figcaption": HTMLElement,"figure": HTMLElement,"footer": HTMLElement,"form": HTMLFormElement,"h1": HTMLHeadingElement,"h2": HTMLHeadingElement,"h3": HTMLHeadingElement,"h4": HTMLHeadingElement,"h5": HTMLHeadingElement,"h6": HTMLHeadingElement,"head": HTMLHeadElement,"header": HTMLElement,"hgroup": HTMLElement,"hr": HTMLHRElement,"html": HTMLHtmlElement,"i": HTMLElement,"iframe": HTMLIFrameElement,"img": HTMLImageElement,"input": HTMLInputElement,"ins": HTMLModElement,"kbd": HTMLElement,"label": HTMLLabelElement,"legend": HTMLLegendElement,"li": HTMLLIElement,"link": HTMLLinkElement,"main": HTMLElement,"map": HTMLMapElement,"mark": HTMLElement,"menu": HTMLMenuElement,"meta": HTMLMetaElement,"meter": HTMLMeterElement,"nav": HTMLElement,"noscript": HTMLElement,"object": HTMLObjectElement,"ol": HTMLOListElement,"optgroup": HTMLOptGroupElement,"option": HTMLOptionElement,"output": HTMLOutputElement,"p": HTMLParagraphElement,"picture": HTMLPictureElement,"pre": HTMLPreElement,"progress": HTMLProgressElement,"q": HTMLQuoteElement,"rp": HTMLElement,"rt": HTMLElement,"ruby": HTMLElement,"s": HTMLElement,"samp": HTMLElement,"script": HTMLScriptElement,"search": HTMLElement,"section": HTMLElement,"select": HTMLSelectElement,"slot": HTMLSlotElement,"small": HTMLElement,"source": HTMLSourceElement,"span": HTMLSpanElement,"strong": HTMLElement,"style": HTMLStyleElement,"sub": HTMLElement,"summary": HTMLElement,"sup": HTMLElement,"table": HTMLTableElement,"tbody": HTMLTableSectionElement,"td": HTMLTableCellElement,"template": HTMLTemplateElement,"textarea": HTMLTextAreaElement,"tfoot": HTMLTableSectionElement,"th": HTMLTableCellElement,"thead": HTMLTableSectionElement,"time": HTMLTimeElement,"title": HTMLTitleElement,"tr": HTMLTableRowElement,"track": HTMLTrackElement,"u": HTMLElement,"ul": HTMLUListElement,"var": HTMLElement,"video": HTMLVideoElement,"wbr": HTMLElement}

describe('df elements', () => {
    describe('can create', () => {
        it.each(Object.entries(tags))('%s', (tag, elementType) => {
            // arrange
            const func = (df as any)[tag]

            // act
            const el = func()

            // assert
            expect(el).toBeInstanceOf(elementType)
        })
    })

    describe('children', () => {
        test('text', () => {
            // act
            const el = div('hello ', 'world!')

            // assert
            expect(el.textContent).toBe('hello world!')
        })

        test('Nodes', () => {
            // act
            const el = div(new Text('one'), ' ', div('two'))

            // assert
            expect(el.textContent).toBe('one two')
        })

        test('Dynamic Text Number Null and Undefined', () => {
            // arrange
            const dynamicText = Dynamic<string | number | null | undefined>('Version One')

            // act
            const el = div('before ', dynamicText, ' after')

            // assert
            expect(el.textContent).toBe('before Version One after')

            // act
            dynamicText.set('Version Two')

            // assert
            expect(el.textContent).toBe('before Version Two after')

            // act
            const el2 = div(Dynamic(undefined), Dynamic(null), Dynamic(100))

            // assert
            expect(el2.textContent).toBe('100')
        })

        test('Dynamic Node', () => {
            // arrange
            const dynamicNode = Dynamic<Node>(new Text('Version One'))

            // act
            const el = div('before ', dynamicNode, ' after')

            // assert
            expect(el.textContent).toBe('before Version One after')

            // act
            dynamicNode.set(span('Version Two'))

            // assert
            expect(el.textContent).toBe('before Version Two after')
        })

        test('Array', () => {
            // arrange
            const dynamicString = Dynamic('4 ')

            // act
            const el = div('1 ', ['2 ', new Text('3 '), dynamicString], '5')

            // assert
            expect(el.textContent).toBe('1 2 3 4 5')

            // act
            dynamicString.set('4.5 ')

            // assert
            expect(el.textContent).toBe('1 2 3 4.5 5')
        })

        test('falsy values', () => {
            // act
            const el = div('', undefined, null, [])

            // assert
            expect(el.textContent).toBe('')
        })
    })

    describe('config', () => {
        test('type', () => {
            // config type includes shared writeable properties
            const className: keyof DfElementConfig<HTMLDivElement> = 'className'
            expect(className).toBeTruthy()

            // config type includes element type writeable properties
            const value: keyof DfElementConfig<HTMLInputElement> = 'value'
            expect(value).toBeTruthy()

            // config type does not include functions
            const appendChild: Exclude<
                keyof HTMLDivElement,
                keyof DfElementConfig<HTMLDivElement>
            > = 'appendChild'
            expect(appendChild)
            const cloneNode: Exclude<keyof HTMLDivElement, keyof DfElementConfig<HTMLDivElement>> =
                'cloneNode'
            expect(cloneNode)

            // config type does not include readonly properties
            const offsetTop: Exclude<keyof HTMLDivElement, keyof DfElementConfig<HTMLDivElement>> =
                'offsetTop'
            expect(offsetTop)

            // config includes a partial style property
            const style: keyof DfElementConfig<HTMLElement> = 'style'
            expect(style)
            const color: keyof Exclude<DfElementConfig<HTMLElement>['style'], undefined> = 'color'
            expect(color)

            // config includes events
            const onClick: keyof DfElementConfig<HTMLDivElement> = 'onClick'
            expect(onClick)
            const onMouseenter: keyof DfElementConfig<HTMLDivElement> = 'onMousedown'
            expect(onMouseenter)

            // config doesn't include the lowercase version of events
            const onclick: Exclude<keyof HTMLDivElement, keyof DfElementConfig<HTMLDivElement>> =
                'onclick'
            expect(onclick)
        })

        test('className', () => {
            // act
            const config: Partial<DfElementConfig<HTMLDivElement>> = {
                className: 'test-class',
            }
            const el = div(config)

            el.style.color

            // assert
            expect(el.className).toBe('test-class')
        })

        test('href', () => {
            // act
            const anchor = a({ href: 'http://example.com' })

            // assert
            expect(anchor.href).toBe('http://example.com/')
        })

        test('onClick', () => {
            // arrange
            const onClick = vi.fn()

            // act
            const el = button({ onClick: (e) => onClick(e) })
            el.dispatchEvent(new MouseEvent('click'))

            // assert
            expect(onClick).toHaveBeenCalledWith(expect.any(MouseEvent))
        })

        test('input with dynamic value', () => {
            // arrange
            const value = Dynamic('one')

            // act
            const el = input({ value: value, onChange: () => value.set(el.value) })

            // assert
            expect(el.value).toBe('one')

            // act
            value.set('two')

            // assert
            expect(el.value).toBe('two')

            // act
            el.value = 'three'
            el.dispatchEvent(new Event('change'))

            // assert
            expect(value.get()).toBe('three')
        })

        test('style', () => {
            // act
            const el = div({ style: { color: 'green' } })

            // assert
            expect(el.style.color).toBe('green')
        })

        test('onConnected and onDisconnected', () => {
            // arrange
            const onConnected = vi.fn()
            const onDisconnected = vi.fn()

            // act
            const el = div({
                onConnected,
                onDisconnected,
            })

            document.body.append(el)
            el.remove()

            // assert
            expect(onConnected).toHaveBeenCalledWith(expect.any(ConnectionEvent))
            expect(onDisconnected).toHaveBeenCalledWith(expect.any(ConnectionEvent))
        })

        test('provideContext and requestContext', () => {
            // arrange
            const myContext = createContext<number>('DfTestContext')
            const providerDynamic = Dynamic(10)
            const requestorDynamic = Dynamic<number | null>(null)

            // act
            const requestorEl = div({ requestContext: [myContext, requestorDynamic] })
            const providerEl = div(
                { provideContext: [myContext, providerDynamic] },
                div(div(requestorEl))
            )
            document.body.append(providerEl)

            // assert
            expect(requestorDynamic.get()).toBe(10)

            // act
            providerDynamic.set(20)

            // assert
            expect(requestorDynamic.get()).toBe(20)
        })
    })
})
