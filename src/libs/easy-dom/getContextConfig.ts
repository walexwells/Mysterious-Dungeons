import { UnknownContext, ContextValueType } from "./context";
import {
  EasyDomElementConfig,
  HtmlTags,
  IDynamicGetter,
  IDynamicSetter,
} from "./types";

export type ContextProvider<T extends UnknownContext> = [
  T,
  IDynamicGetter<ContextValueType<T>>
];
export type ContextRequestor<T extends UnknownContext> = [
  T,
  IDynamicSetter<ContextValueType<T>>
];

export function getContextConfig<T extends HtmlTags>(
  config?: EasyDomElementConfig<T>
) {
  const result: {
    provides: ContextProvider<UnknownContext>[];
    requests: ContextRequestor<UnknownContext>[];
  } = {
    provides: [],
    requests: [],
  };
  if (config?.context) {
    config.context({
      provide<T extends UnknownContext>(
        context: T,
        source: IDynamicGetter<ContextValueType<T>>
      ) {
        result.provides.push([context, source]);
      },
      request<T extends UnknownContext>(
        context: T,
        target: IDynamicSetter<ContextValueType<T>>
      ) {
        result.requests.push([context, target]);
      },
    });
  }
  return result;
}
