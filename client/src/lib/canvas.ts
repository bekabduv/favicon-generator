import { type ControlsInitialState, PNG_SIZE } from "@/constants";

type Props = {
  canvas: HTMLCanvasElement | OffscreenCanvas;
  svgSize: number;
  x: number;
  y: number;
  canvasSize?: number;
} & ControlsInitialState;

const drawToCanvas = ({
  canvas,
  svgSize,
  canvasSize = PNG_SIZE,
  text,
  fontSize,
  fontFamily,
  fontWeight,
  fontStyle,
  borderRadius,
  borderWidth,
  borderColor,
  backgroundColor,
  color,
  x,
  y,
}: Props) => {
  canvas.width = canvasSize;
  canvas.height = canvasSize;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const scaleToPx = canvasSize / svgSize;
  const pxBorder = borderWidth > 0 ? Math.max(borderWidth * scaleToPx, 1) : 0;
  const pxRadius = borderRadius * scaleToPx;
  const halfBorder = pxBorder / 2;
  const rectSize = canvasSize - pxBorder;
  const innerRadius = Math.max(0, pxRadius - halfBorder);

  ctx.beginPath();
  ctx.roundRect(halfBorder, halfBorder, rectSize, rectSize, innerRadius);
  ctx.fillStyle = backgroundColor;
  ctx.fill();

  if (pxBorder > 0) {
    ctx.lineWidth = pxBorder;
    ctx.strokeStyle = borderColor;
    ctx.stroke();
  }

  const innerSizePx = canvasSize - pxBorder * 2;
  const textScale = innerSizePx / 100;
  const finalFontSize = fontSize * textScale;
  const finalX = pxBorder + x * textScale;
  const finalY = pxBorder + y * textScale;

  ctx.font = `${fontStyle ? "italic" : "normal"} ${fontWeight} ${finalFontSize}px '${fontFamily}'`;
  ctx.fillStyle = color;

  ctx.textBaseline = "alphabetic";
  ctx.fillText(text, finalX, finalY);
  return true;
};

// ----------------------------------------------------------------

export const getCanvasDataUrl = <T extends HTMLCanvasElement>(
  props: Props & { canvas: T },
) => {
  const ok = drawToCanvas(props);
  if (!ok) return;
  return props.canvas.toDataURL();
};

// ---------------------------------------------------------------------

export const canvasBlobRenderer =
  (props: Omit<Props, "canvas">) => (canvasSize: number) => {
    return new Promise<Blob | null>((resolve) => {
      const canvasElement =
        typeof OffscreenCanvas !== "undefined"
          ? new OffscreenCanvas(canvasSize, canvasSize)
          : document.createElement("canvas");
      const ok = drawToCanvas({
        ...props,
        canvasSize,
        canvas: canvasElement,
      });
      if (!ok) return;
      if (canvasElement instanceof OffscreenCanvas) {
        canvasElement
          .convertToBlob({ type: "image/png" })
          .then((blob) => resolve(blob));
      } else {
        canvasElement.toBlob((blob) => resolve(blob), "image/png");
      }
    });
  };
