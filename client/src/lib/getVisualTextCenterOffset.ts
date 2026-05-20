import type { ControlsInitialState } from "@/constants";

const canvas =
  typeof OffscreenCanvas !== "undefined"
    ? new OffscreenCanvas(0, 0)
    : document.createElement("canvas");
const ctx = canvas.getContext("2d");

export const getVisualTextCenterOffset = ({
  fontFamily,
  fontWeight,
  fontSize,
  fontStyle,
  text,
}: Pick<
  ControlsInitialState,
  "fontFamily" | "fontWeight" | "fontSize" | "fontStyle" | "text"
>) => {
  if (ctx === null) return { x: 20, y: 80 };

  const styleStr = fontStyle ? "italic" : "normal";
  ctx.font = `${styleStr} ${fontWeight} ${fontSize}px '${fontFamily}'`;
  const metrics = ctx.measureText(text);
  const offsetX =
    (metrics.actualBoundingBoxRight - metrics.actualBoundingBoxLeft) / 2;
  const offsetY =
    (metrics.actualBoundingBoxDescent - metrics.actualBoundingBoxAscent) / 2;
  return {
    x: 50 - offsetX,
    y: 50 - offsetY,
  };
};
