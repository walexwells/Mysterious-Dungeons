import { DynamicGetter, isDynamicGetter } from '../dynamics/types'
import { DfNode } from './DfNode'

export function renderDfNode(item: DfNode): Node[] {
    if (item === null || item === undefined) {
        return []
    } else if (item instanceof Node) {
        return [item]
    } else if (Array.isArray(item)) {
        return renderArrayOfDfNodes(item)
    } else if (isDynamicGetter(item)) {
        return [renderDynamicGetter(item)]
    } else if (typeof item === 'string') {
        return [new Text(item)]
    } else {
        throw new Error(`Unexpected value: ${item}`)
    }
}

function renderArrayOfDfNodes(dfNodes: DfNode[]): Node[] {
    const result = []
    for (const dfNode of dfNodes) {
        const nodes = renderDfNode(dfNode)
        if (Array.isArray(nodes)) {
            for (const node of nodes) {
                result.push(node)
            }
        } else {
            result.push(nodes)
        }
    }
    return result
}

function renderDynamicGetter(
    getter: DynamicGetter<string | number | undefined | null> | DynamicGetter<Node>
): Node {
    const currentValue = getter.get()
    if (currentValue instanceof Node) {
        return renderDynamicNode(getter as DynamicGetter<Node>)
    } else {
        return renderDynamicString(getter as DynamicGetter<string>)
    }
}

function renderDynamicString(getter: DynamicGetter<string | number | null | undefined>) {
    function setNodeValue(v: string | number | null | undefined) {
        textNode.nodeValue = !v ? '' : v.toString()
    }

    const textNode = new Text()
    setNodeValue(getter.get())
    getter.onChange(setNodeValue)
    return textNode
}

function renderDynamicNode(getter: DynamicGetter<Node>) {
    let currentNode = getter.get()
    const dynamicNodeChild = getter as DynamicGetter<Node>
    dynamicNodeChild.onChange((newNode) => {
        const parentElement = currentNode.parentElement
        if (parentElement) {
            parentElement.insertBefore(newNode, currentNode)
            parentElement.removeChild(currentNode)
            currentNode = newNode
        } else {
            throw new Error('missing parent!')
        }
    })
    return currentNode
}
