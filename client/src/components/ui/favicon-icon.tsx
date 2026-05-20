import { type Accessor, createMemo } from "solid-js";
import type { Store } from "solid-js/store";
import { type ControlsInitialState, SVG_SIZE } from "@/constants";

type Props = {
  iconSize: number;
  offset: Accessor<{ x: number; y: number }>;
  loadedFont: Accessor<{ fontFamily: string; fontWeight: number }>;
  loading: boolean;
  class?: string;
} & Store<ControlsInitialState>;

const Icon = (props: Props) => {
  const scale = 100 / SVG_SIZE;
  const scaledBorderWidth = createMemo(() => props.borderWidth * scale);
  const scaledBorderRadius = createMemo(() =>
    Math.max(0, props.borderRadius * scale - scaledBorderWidth() / 2),
  );
  const contentSize = createMemo(() =>
    Math.max(0, 100 - scaledBorderWidth() * 2),
  );
  const contentScale = createMemo(() => contentSize() / 100);
  return (
    <svg
      role="img"
      aria-label={`Favicon preview: "${props.text}"`}
      viewBox="0 0 100 100"
      class={`${props.class} min-w-${props.iconSize} min-h-${props.iconSize} shrink-0`}
      width={props.iconSize}
      height={props.iconSize}
      // "background-image":
      //   "conic-gradient(#eee 25%, #fff 0 50%, #eee 0 75%, #fff 0)",
      // "background-size": "20px 20px",
    >
      <rect
        shape-rendering={"geometricPrecision"}
        x={scaledBorderWidth() / 2}
        y={scaledBorderWidth() / 2}
        width={100 - scaledBorderWidth()}
        height={100 - scaledBorderWidth()}
        rx={scaledBorderRadius()}
        fill={props.backgroundColor}
        stroke={props.borderColor}
        stroke-width={scaledBorderWidth()}
      />
      <g
        transform={`translate(${scaledBorderWidth()}, ${scaledBorderWidth()}) scale(${contentScale()})`}
      >
        <text
          x={props.offset().x}
          y={props.offset().y}
          style={{
            fill: props.color,
            "font-size": `${props.fontSize}px`,
            "font-family": `'${props.loadedFont()?.fontFamily}'`,
            "font-weight": props.loadedFont()?.fontWeight,
          }}
          classList={{
            invisible:
              props.fontFamily === props.loadedFont()?.fontFamily &&
              props.fontWeight === props.loadedFont()?.fontWeight &&
              props.loading,
            italic: props.fontStyle,
          }}
        >
          {props.text}
        </text>
      </g>
    </svg>
  );
};

export default Icon;
