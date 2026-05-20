import { createEffect, createMemo, createResource, onCleanup } from "solid-js";
import type { Store } from "solid-js/store";
import {
  CONTROLS_INITIAL_STATE,
  type ControlsInitialState,
  PNG_SIZE,
  type Size,
  SVG_SIZE,
} from "@/constants";
import { useFonts } from "@/contexts/FontContext";
import { canvasBlobRenderer, getCanvasDataUrl } from "@/lib/canvas";
import { createSVGFavicon } from "@/lib/createSVGFavicon";
import { downloadZip, triggerDownload } from "@/lib/download";
import { loadFont, loadTTFFont } from "@/lib/font";
import { getVisualTextCenterOffset } from "@/lib/getVisualTextCenterOffset";
import BrowserTab from "./ui/browser-tab";
import DownloadButtons from "./ui/download-buttons";
import Icon from "./ui/favicon-icon";

type Props = {
  controls: Store<ControlsInitialState>;
};

const Favicon = (props: Props) => {
  const { fontsMap } = useFonts();

  const links = document.querySelectorAll(
    "link:is([rel='icon'], [rel='apple-touch-icon']",
  );
  links.forEach((link) => {
    link?.remove();
  });

  const link = Object.assign(document.createElement("link"), { rel: "icon" });
  document.head.append(link);
  const canvas = document.createElement("canvas");
  onCleanup(() => {
    canvas.remove();
    link.remove();
  });

  const [loadedFont] = createResource(
    () => ({
      fontFamily: props.controls.fontFamily,
      fontWeight: props.controls.fontWeight,
      text: props.controls.text,
    }),
    async ({ fontFamily, fontWeight, text }) => {
      await loadFont(fontFamily, fontWeight, text);
      return { fontFamily, fontWeight };
    },
    {
      initialValue: {
        fontFamily: CONTROLS_INITIAL_STATE.fontFamily,
        fontWeight: CONTROLS_INITIAL_STATE.fontWeight,
      },
    },
  );

  const offset = createMemo(() =>
    getVisualTextCenterOffset({
      fontFamily: loadedFont().fontFamily,
      fontWeight: loadedFont().fontWeight,
      fontSize: props.controls.fontSize,
      fontStyle: props.controls.fontStyle,
      text: props.controls.text,
    }),
  );

  const ttfUrl = () => {
    return fontsMap().get(props.controls.fontFamily)?.files[
      props.controls.fontWeight === 400 ? "regular" : props.controls.fontWeight
    ];
  };

  const canvasParams = () => ({
    ...props.controls,
    fontFamily: loadedFont().fontFamily,
    fontWeight: loadedFont().fontWeight,
    svgSize: SVG_SIZE,
    x: offset().x,
    y: offset().y,
  });

  createEffect(() => {
    if (loadedFont.loading) return;
    const url = getCanvasDataUrl({ ...canvasParams(), canvas });
    if (url) link.href = url;
  });

  const getSVGString = async () => {
    const url = ttfUrl();
    if (!url) return;
    const ttf = await loadTTFFont(url);
    if (!ttf) return;
    const { x, y } = offset();
    return createSVGFavicon({
      x,
      y,
      svgSize: SVG_SIZE,
      ttfFont: ttf,
      ...props.controls,
    });
  };

  const onZipClick = async () => {
    const svgString = await getSVGString();
    if (!svgString) return;
    const getCanvasBlob = canvasBlobRenderer(canvasParams());

    await downloadZip({
      getCanvasBlob,
      backgroundColor: props.controls.backgroundColor,
      svgString,
    });
  };

  const onSVGClick = async () => {
    const svgString = await getSVGString();
    if (!svgString) return;
    const blob = new Blob([svgString], { type: "image/svg+xml" });
    const blobURL = URL.createObjectURL(blob);
    triggerDownload(blobURL, "favicon.svg");
    URL.revokeObjectURL(blobURL);
  };

  const onPNGClick = (size: Size = PNG_SIZE) => {
    if (loadedFont.loading) return;
    const url = getCanvasDataUrl({
      ...canvasParams(),
      canvas,
      canvasSize: size,
    });
    if (url) triggerDownload(url, `favicon-${size}x${size}.png`);
  };

  return (
    <section
      aria-label="Favicon preview"
      class="sticky top-0 flex @lg:flex-row flex-col items-center gap-4 rounded-sm border border-border bg-card p-4 [@media(max-height:400px)]:@lg:flex-row"
    >
      <Icon
        {...props.controls}
        iconSize={SVG_SIZE}
        loadedFont={loadedFont}
        loading={loadedFont.loading}
        offset={offset}
        class="drop-shadow-sm"
      />
      <div class="flex flex-1 flex-col justify-around gap-4">
        <BrowserTab
          Icon={(iconSize) => (
            <Icon
              iconSize={iconSize}
              {...props.controls}
              loadedFont={loadedFont}
              loading={loadedFont.loading}
              offset={offset}
            />
          )}
          title={"Favicon Generator"}
        />
        <DownloadButtons
          fontLoading={loadedFont.loading}
          onPNGClick={onPNGClick}
          onSVGClick={onSVGClick}
          onZipClick={onZipClick}
        />
      </div>
    </section>
  );
};

export default Favicon;
