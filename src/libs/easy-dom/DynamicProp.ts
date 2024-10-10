import { Computed } from "./Computed";
import { IDynamicGetter } from "./types";

export function DynamicProp<SourceType, PropType extends keyof SourceType>(
  source: IDynamicGetter<SourceType>,
  prop: PropType
): IDynamicGetter<SourceType[PropType]> {
  return Computed(source, (value) => value[prop]);
}
