import { beforeEach, expect, suite, test, vi } from "vitest";
import { DocumentEventsCustomElements } from "./DocumentEventsElements";
import { DocumentEvent } from "./DocumentEvent";

// prettier-ignore
const tagNames: (keyof HTMLElementTagNameMap)[] = ["object","a","abbr","address","area","article","aside","audio","b","base","bdi","bdo","blockquote","body","br","button","canvas","caption","cite","code","col","colgroup","data","datalist","dd","del","details","dfn","dialog","div","dl","dt","em","embed","fieldset","figcaption","figure","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","iframe","img","input","ins","kbd","label","legend","li","link","main","map","mark","menu","meta","meter","nav","noscript","ol","optgroup","option","output","p","picture","pre","progress","q","rp","rt","ruby","s","samp","script","section","select","slot","small","source","span","strong","style","sub","summary","sup","table","tbody","td","template","textarea","tfoot","th","thead","time","title","tr","track","u","ul","var","video","wbr"];

suite.each(tagNames)(`${DocumentEventsCustomElements.name}: %s`, (tagName) => {
  const connectListener = vi.fn();
  const disconnectListener = vi.fn();
  let element = null as unknown as HTMLElement;

  beforeEach(() => {
    element = DocumentEventsCustomElements.createElement(tagName);
    element.addEventListener(DocumentEvent.CONNECT, connectListener);
    element.addEventListener(DocumentEvent.DISCONNECT, disconnectListener);
    clearMocks();
  });

  function clearMocks() {
    connectListener.mockClear();
    disconnectListener.mockClear();
  }

  test("on added to parent element not in document", () => {
    // arrange
    const divEl = document.createElement("div");
    clearMocks();

    // act
    divEl.append(element);

    // assert
    expect(connectListener).not.toHaveBeenCalled();
    expect(disconnectListener).not.toHaveBeenCalled();
  });

  test("on added to document", () => {
    // act
    document.body.appendChild(element);

    // assert
    expect(connectListener).toHaveBeenCalledOnce();
    expect(disconnectListener).not.toHaveBeenCalled();
  });

  test("on added to document indirectly", () => {
    // arrange
    const divEl = document.createElement("div");
    document.body.append(divEl);
    clearMocks();

    // act
    divEl.append(element);

    // assert
    expect(connectListener).toHaveBeenCalledOnce();
    expect(disconnectListener).not.toHaveBeenCalled();
  });

  test("on removed from document", () => {
    // arrange
    document.body.appendChild(element);
    connectListener.mockClear();
    disconnectListener.mockClear();

    // act
    document.body.removeChild(element);

    // assert
    expect(connectListener).not.toHaveBeenCalled();
    expect(disconnectListener).toHaveBeenCalledOnce();
  });

  test("on parent changed in document", () => {
    // arrange
    const div1 = document.createElement("div");
    const div2 = document.createElement("div");
    document.body.append(div1, div2);
    div1.append(element);
    clearMocks();

    const assertConnectListenerNotCalledBeforeDisconnect = () => {
      expect(connectListener).not.toHaveBeenCalled();
    };

    // act
    disconnectListener.mockImplementationOnce(
      assertConnectListenerNotCalledBeforeDisconnect
    );
    div2.append(element);

    // assert
    expect(disconnectListener).toHaveBeenCalledOnce();
    expect(connectListener).toHaveBeenCalledOnce();
  });

  test("on moved to parent in document", () => {
    // arrange
    const div1 = document.createElement("div");
    const div2 = document.createElement("div");
    document.body.append(div2);
    div1.append(element);
    clearMocks();

    // act
    div2.append(element);

    // assert
    expect(disconnectListener).not.toHaveBeenCalled();
    expect(connectListener).toHaveBeenCalledOnce();
  });

  test("on moved to parent out of document", () => {
    // arrange
    const div1 = document.createElement("div");
    const div2 = document.createElement("div");
    document.body.append(div1);
    div1.append(element);
    clearMocks();

    // act
    div2.append(element);

    // assert
    expect(disconnectListener).toHaveBeenCalledOnce();
    expect(connectListener).not.toHaveBeenCalled();
  });
});
