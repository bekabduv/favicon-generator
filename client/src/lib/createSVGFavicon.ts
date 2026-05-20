import type { Font } from "opentype.js";
import type { ControlsInitialState } from "@/constants";

type Props = {
  svgSize: number;
  ttfFont: Font;
  x: number;
  y: number;
} & Omit<ControlsInitialState, "fontFamily" | "fontWeight">;

const viewBox = 100;

export const createSVGFavicon = ({
  backgroundColor,
  borderColor,
  borderRadius,
  borderWidth,
  color,
  fontSize,
  fontStyle,
  svgSize,
  text,
  ttfFont,
  x,
  y,
}: Props) => {
  const unitsPerEm = ttfFont.unitsPerEm;
  const textPathData = ttfFont.getPath(text, 0, 0, unitsPerEm).toPathData(0);
  const fontScale = fontSize / unitsPerEm;
  const scale = viewBox / svgSize;
  const scaledBorderWidth = borderWidth * scale;
  const scaledRadius = Math.max(
    0,
    borderRadius * scale - scaledBorderWidth / 2,
  );
  const contentSize = Math.max(0, viewBox - scaledBorderWidth * 2);
  const contentScale = contentSize / viewBox;

  const textTransforms = `translate(${x} ${y}) scale(${fontScale}) ${
    fontStyle ? "skewX(-12)" : ""
  }`;

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${viewBox} ${viewBox}" width="512" height="512">
  <rect
    shape-rendering="geometricPrecision"
    width="${viewBox - scaledBorderWidth}" height="${viewBox - scaledBorderWidth}"
    x="${scaledBorderWidth / 2}" y="${scaledBorderWidth / 2}" rx="${scaledRadius}"
    stroke="${borderColor}" stroke-width="${scaledBorderWidth}"
    fill="${backgroundColor}"
  />
    <g transform="translate(${scaledBorderWidth} ${scaledBorderWidth}) scale(${contentScale})">
      <path d="${textPathData}" fill="${color}" fill-rule="evenodd" transform="${textTransforms}"/>
    </g>
</svg>`.trim();
};
