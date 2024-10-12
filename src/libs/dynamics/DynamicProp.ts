import { Computed } from "./Computed";
import { DynamicGetter } from "./types";

export function DynamicProp<SourceType, PropType extends keyof SourceType>(
  source: DynamicGetter<SourceType>,
  prop: PropType
): DynamicGetter<SourceType[PropType]> {
  return Computed(source, (value) => value[prop]);
}
