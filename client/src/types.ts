import type { DOMElement } from "solid-js/types/jsx.js";

type SplitCapsTail<S extends string> = S extends `${infer Head}${infer Tail}`
  ? `${Head extends Lowercase<Head> ? "" : " "}${Head}${SplitCapsTail<Tail>}`
  : S;
export type CamelToSplitCaps<S extends string> =
  S extends `${infer Head}${infer Tail}`
    ? `${Capitalize<Head>}${SplitCapsTail<Tail>}`
    : S;

export type JSXEvent<A, B> = A & { currentTarget: B; target: DOMElement };
export type InputWheelEvent = JSXEvent<WheelEvent, HTMLInputElement>;
export type InputInputEvent = JSXEvent<InputEvent, HTMLInputElement>;
export type ButtonMouseEvent = JSXEvent<MouseEvent, HTMLButtonElement>;
