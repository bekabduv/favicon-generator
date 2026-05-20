import ChevronDownIcon from "lucide-solid/icons/chevron-down";
import XIcon from "lucide-solid/icons/x";
import { createSignal, type JSXElement } from "solid-js";
import ToggleThemeButton from "./toggle-theme-button";

type Props = {
  Icon: (iconSize: number) => JSXElement;
  title: string;
  class?: string;
};

const BrowserTab = (props: Props) => {
  const [dark, setDark] = createSignal(false);
  return (
    <div
      aria-label="Browser tab preview"
      role="img"
      class={`${props.class} flex items-start justify-center rounded-sm bg-foreground/20 px-3 pt-3 outline outline-foreground/10 outline-offset-4`}
    >
      <div
        class="flex-1 rounded-t-[12px] bg-card pb-2"
        classList={{ dark: dark() }}
      >
        <div class="flex min-w-2/3 items-start overflow-visible rounded-t-[12px] bg-subtle px-1.5 pt-1.5">
          <div
            aria-hidden="true"
            class="z-11 mr-1.5 flex size-7.5 items-center justify-center rounded-sm bg-secondary/80 text-foreground"
          >
            <ChevronDownIcon class="size-4" />
          </div>

          <div class="relative z-10 flex flex-1 items-center gap-2 rounded-t-[10px] bg-card px-2 py-2 text-sm">
            <div class="absolute bottom-0 -left-[10px] h-[10px] w-[10px] bg-card">
              <div class="h-full w-full rounded-br-[10px] bg-subtle"></div>
            </div>

            <div class="absolute -right-[10px] bottom-0 h-[10px] w-[10px] bg-card">
              <div class="h-full w-full rounded-bl-[10px] bg-subtle"></div>
            </div>

            {props.Icon(20)}

            <div class="flex-grow select-none truncate pr-4 text-[13px] text-foreground">
              Favicon Generator
            </div>

            <div
              aria-hidden="true"
              class="flex flex-shrink-0 items-center justify-center p-0.5 text-muted-foreground"
            >
              <XIcon class="size-3.5" />
            </div>
          </div>
          <ToggleThemeButton
            dark={dark()}
            toggleTheme={() => setDark((prev) => !prev)}
          />
        </div>
      </div>
    </div>
  );
};

export default BrowserTab;
