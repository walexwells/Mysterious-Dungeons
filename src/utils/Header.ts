import { DfNode } from '../libs/df/DfNode'
import { header, h1, a } from '../libs/df'

export function Header(...children: DfNode[]) {
    return header(a({ href: '#/' }, h1('Mysterious Dungeons')), ...children)
}
