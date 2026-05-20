import ChevronDownIcon from "lucide-solid/icons/chevron-down";
import DownloadIcon from "lucide-solid/icons/download";
import FileArchiveIcon from "lucide-solid/icons/file-archive";
import FileCodeCornerIcon from "lucide-solid/icons/file-code-corner";
import ImageIcon from "lucide-solid/icons/image";
import { lazy, Suspense } from "solid-js";
import { imgSizes, type Size } from "@/constants";
import AsyncButton from "./async-button";

const SelectSize = lazy(() => import("./select-size"));

type Props = {
  fontLoading: boolean;
  onZipClick: () => void;
  onSVGClick: () => void;
  onPNGClick: (size?: Size) => void;
  class?: string;
};

const DownloadButtons = (props: Props) => {
  return (
    <div class={`${props.class} flex gap-2`}>
      <AsyncButton
        aria-label="Download ZIP package"
        disabled={props.fontLoading}
        onClick={props.onZipClick}
        class="bg-gradient-to-br from-primary to-primary/80 hover:from-primary hover:to-primary/70"
      >
        <FileArchiveIcon aria-hidden="true" class="size-4" />
        <span>Zip</span>
        <DownloadIcon
          aria-hidden="true"
          class="size-3.5 transition-transform duration-200 group-data-[state=idle]:group-hover:translate-y-0.5"
        />
      </AsyncButton>

      <AsyncButton
        aria-label="Download as SVG"
        onClick={props.onSVGClick}
        class="bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-500 hover:to-blue-500"
      >
        <FileCodeCornerIcon aria-hidden="true" class="size-4" />
        <span>SVG</span>
        <DownloadIcon
          aria-hidden="true"
          class="size-3.5 transition-transform duration-200 group-data-[state=idle]:group-hover:translate-y-0.5"
        />
      </AsyncButton>

      <div
        class="inline-flex overflow-hidden rounded-sm border border-border bg-gradient-to-br from-background to-background/80 shadow-sm transition-all duration-200 has-[[data-png]:active]:scale-95"
        classList={{
          "cursor-not-allowed opacity-20 pointer-events-none":
            props.fontLoading,
        }}
      >
        <button
          data-png
          type="button"
          aria-label="Download as PNG"
          disabled={props.fontLoading}
          class="group flex cursor-pointer items-center gap-2 px-3 py-2 font-semibold text-foreground text-xs transition-colors duration-200 active:bg-primary/10 disabled:cursor-not-allowed hover:bg-primary/10"
          onClick={() => props.onPNGClick()}
        >
          <ImageIcon aria-hidden="true" class="size-4" />
          <span>PNG</span>
        </button>
        <div class="my-auto h-6 w-px bg-border" />
        <Suspense
          fallback={
            <div class="flex h-full w-fit items-center justify-center p-2 text-foreground/60 text-sm">
              <ChevronDownIcon class="size-3.5" />
            </div>
          }
        >
          <SelectSize
            options={imgSizes}
            onChange={(value) => value && props.onPNGClick(value)}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default DownloadButtons;
