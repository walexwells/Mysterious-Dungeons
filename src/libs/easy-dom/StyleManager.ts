export class StyleManager {
  private sheet: CSSStyleSheet;

  constructor() {
    const styleEl = document.createElement("style");
    document.head.appendChild(styleEl);
    const sheet = styleEl.sheet;
    if (!sheet) throw new Error("Failed to make style sheet");
    this.sheet = sheet;
  }

  createRule(
    selector: string,
    styles: CSSStyleDeclaration
  ): CSSStyleDeclaration {
    const ruleIndex = this.sheet.insertRule(`${selector}{}`);
    const rule = this.sheet.cssRules[ruleIndex] as CSSStyleRule;
    Object.assign(rule.style, styles);
    return rule.style;
  }
}
