import { div } from "./libs/easy-dom/elements";

export function openPrompt<T>(
  promptFunction: (resolve: (v: T | null) => void) => HTMLElement
): Promise<T | null> {
  return new Promise<T | null>((resolvePromise) => {
    function resolvePrompt(v: T | null) {
      resolvePromise(v);
      backdrop.remove();
    }

    const promptEl = promptFunction(resolvePrompt);
    promptEl.addEventListener("click", (e) => e.stopPropagation());

    const backdrop = div(
      { className: "backdrop", onclick: () => resolvePrompt(null) },
      promptEl
    );

    document.body.appendChild(backdrop);
  });
}
