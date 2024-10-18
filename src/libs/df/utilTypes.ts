// https://github.com/Microsoft/TypeScript/issues/27024#issuecomment-421529650
// prettier-ignore
type IfEquals<X, Y, A, B> =
                (<T>() => T extends X ? 1 : 2) extends
                (<T>() => T extends Y ? 1 : 2) ? A : B;
// prettier-ignore
type KeyIfWritableElseNever<T, K extends keyof T> = IfEquals<{ -readonly [Q in K]: T[K]}, {[Q in K]:T[K]}, K, never>
// prettier-ignore
export type WritablePart<T> = {
                [K in keyof T as KeyIfWritableElseNever<T,K>]: T[K]
            }

export type NonFunctionPart<T extends HTMLElement> = {
    [K in keyof T as Exclude<T[K], null> extends Function ? never : K]: T[K]
}
