import { lazy, Suspense } from "solid-js";
import type { SetStoreFunction, Store } from "solid-js/store";
import {
  CONTROLS_CONFIGS,
  type ControlKey,
  type ControlsInitialState,
} from "@/constants";
import ControllerInput from "./ui/controller-input";

const SelectFontFamily = lazy(() => import("./ui/select-font-family"));
const SelectFontStyle = lazy(() => import("./ui/select-font-style"));
const SelectFontWeight = lazy(() => import("./ui/select-font-weight"));

type Props = {
  controls: Store<ControlsInitialState>;
  setControls: SetStoreFunction<ControlsInitialState>;
};

const Controller = (props: Props) => {
  const onInput =
    <T extends ControlKey>(controlKey: T) =>
    (value: ControlsInitialState[T]) => {
      props.setControls(controlKey, value);
    };

  const getProps = (controlKey: ControlKey) => {
    const cfg = CONTROLS_CONFIGS[controlKey];
    return {
      controlKey,
      label: cfg.label,
      type: cfg.type,
      min: "min" in cfg ? cfg.min : undefined,
      max: "max" in cfg ? cfg.max : undefined,
      value: props.controls[controlKey],
      setValue: onInput(controlKey),
    };
  };

  return (
    <div class="rounded-sm border border-border bg-card/50">
      <div class="flex items-center gap-2 border-border/80 border-b bg-card/50 px-4 py-3">
        <div class="h-1.5 w-1.5 rounded-full bg-primary" />
        <h2 class="font-semibold text-foreground/80 text-xs uppercase tracking-widest">
          Design Panel
        </h2>
      </div>

      <div class="space-y-4 px-3 [&>div]:flex [&>div]:flex-col [&>div]:gap-3 [&>div]:pt-3">
        <div>
          <ControllerInput {...getProps("text")} />
        </div>

        <div class="border-border/80 border-t">
          <h3 class="font-medium text-foreground/70 text-xs uppercase tracking-widest">
            Colors
          </h3>
          <div class="flex justify-between gap-2">
            <ControllerInput {...getProps("color")} />
            <ControllerInput {...getProps("backgroundColor")} />
            <ControllerInput {...getProps("borderColor")} />
          </div>
        </div>

        <div class="border-border/80 border-t">
          <h3 class="font-medium text-foreground/70 text-xs uppercase tracking-widest">
            Size
          </h3>
          <div class="grid grid-cols-2 gap-2">
            <ControllerInput {...getProps("fontSize")} />
            <ControllerInput {...getProps("borderWidth")} />
            <ControllerInput {...getProps("borderRadius")} class="col-span-2" />
          </div>
        </div>

        <div class="border-border/80 border-t pb-3">
          <h3 class="font-medium text-foreground/70 text-xs uppercase tracking-widest">
            Typography
          </h3>

          <div class="flex flex-wrap gap-2">
            <div class="flex basis-full flex-col gap-2">
              <div class="font-medium text-foreground/70 text-xs uppercase tracking-wider">
                Family
              </div>
              <Suspense
                fallback={
                  <div class="flex w-full items-center justify-between rounded-sm border border-border bg-background/50 px-3 py-2 text-sm outline-none transition-all hover:border-primary/20 focus:border-primary/50 focus:ring-2 focus:ring-primary/20">
                    Loading...
                  </div>
                }
              >
                <SelectFontFamily
                  value={props.controls.fontFamily}
                  onChange={(item) =>
                    item && props.setControls("fontFamily", item)
                  }
                />
              </Suspense>
            </div>

            <div class="flex flex-1 flex-col gap-2">
              <div class="font-medium text-foreground/70 text-xs uppercase tracking-wider">
                Style
              </div>
              <Suspense
                fallback={
                  <div class="flex-1 rounded-sm border border-border/80 px-2 py-2 font-medium font-medium text-foreground/60 text-foreground/70 text-sm tracking-wider hover:border-border hover:bg-muted/30 hover:text-foreground/80">
                    Italic
                  </div>
                }
              >
                <SelectFontStyle
                  italic={props.controls.fontStyle}
                  setItalic={() =>
                    props.setControls("fontStyle", (prev) => !prev)
                  }
                />
              </Suspense>
            </div>

            <div class="flex flex-1 flex-col gap-2">
              <div class="font-medium text-foreground/70 text-xs uppercase tracking-wider">
                Weight
              </div>
              <Suspense
                fallback={
                  <div class="flex w-full items-center justify-between rounded-sm border border-border bg-background/50 bg-background/50 px-3 py-2 text-sm outline-none transition-all hover:ring hover:ring-primary/10 focus:border-primary/50 focus:ring-2 focus:ring-primary/20">
                    Loading...
                  </div>
                }
              >
                <SelectFontWeight
                  currentFont={props.controls.fontFamily}
                  value={props.controls.fontWeight}
                  onChange={(value) =>
                    value && props.setControls("fontWeight", value || 400)
                  }
                />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Controller;
