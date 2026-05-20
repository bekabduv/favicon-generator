import type { CamelToSplitCaps } from "@/types";

type ControlKeyWithStrVal =
  | "text"
  | "borderColor"
  | "color"
  | "backgroundColor";

type ControlKeyWithNumVal = "borderRadius" | "borderWidth" | "fontSize";

export type ControlKey = ControlKeyWithStrVal | ControlKeyWithNumVal;

export type InputVariant = "text" | "number" | "range" | "color";

type ControlsConfig<T extends string> = {
  id: T;
  label: CamelToSplitCaps<T> | string;
  type: InputVariant;
  value: T extends ControlKeyWithNumVal ? number : string;
  min?: number;
  max?: number;
};

export const SVG_SIZE = 128;
export const PNG_SIZE = 64;

export type Size = 16 | 32 | 48 | 64 | 96 | 128 | 180 | 192 | 256 | 512;
export type SquareSize<T extends number = Size> = T extends T ? `${T}` : never;

export const imgSizes: Array<SquareSize> = [
  "16",
  "32",
  "48",
  "64",
  "96",
  "128",
  "180",
  "192",
  "256",
  "512",
] as const;

export type FileName =
  | "favicon.svg"
  | "favicon.ico"
  | "apple-touch-icon.png"
  | "android-chrome-192x192.png"
  | "android-chrome-512x512.png"
  | "site.webmanifest";

export const fileNames = [
  "android-chrome-192x192.png",
  "android-chrome-512x512.png",
  "apple-touch-icon.png",
  "favicon.ico",
  "favicon.svg",
  "site.webmanifest",
] as const satisfies ReadonlyArray<FileName>;

export const CONTROLS_CONFIGS = {
  text: {
    id: "text",
    label: "Symbol",
    type: "text",
    value: "A",
  },
  fontSize: {
    id: "fontSize",
    label: "Font Size",
    type: "number",
    value: 100,
    min: 0,
  },
  borderWidth: {
    id: "borderWidth",
    label: "Border Width",
    type: "number",
    value: 0,
    min: 0,
    max: SVG_SIZE / 4,
  },
  borderColor: {
    id: "borderColor",
    label: "Border",
    type: "color",
    value: "#d3d3d3",
  },
  borderRadius: {
    id: "borderRadius",
    label: "Border Radius",
    type: "range",
    value: SVG_SIZE / 4,
    min: 0,
    max: SVG_SIZE / 2,
  },
  color: {
    id: "color",
    label: "Text",
    type: "color",
    value: "#000000",
  },
  backgroundColor: {
    id: "backgroundColor",
    label: "Background",
    type: "color",
    value: "#ffffff",
  },
} satisfies Readonly<{
  [T in ControlKey]: ControlsConfig<T>;
}>;

const CONTROLS_DEFAULTS = Object.fromEntries(
  Object.entries(CONTROLS_CONFIGS).map(([key, obj]) => [key, obj.value]),
) as { [T in ControlKey]: (typeof CONTROLS_CONFIGS)[T]["value"] };

export const CONTROLS_INITIAL_STATE = {
  ...CONTROLS_DEFAULTS,
  fontFamily: "Manufacturing Consent",
  fontWeight: 400,
  fontStyle: false,
};

export type ControlsInitialState = typeof CONTROLS_INITIAL_STATE;
