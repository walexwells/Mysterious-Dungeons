import { EasyDomNode } from "./libs/easy-dom/EasyDomNode";
import { header, h1, a } from "./libs/easy-dom/elements";

export function Header(...children: EasyDomNode[]) {
  return header(a({ href: "#/" }, h1("Mysterious Dungeons")), ...children);
}
