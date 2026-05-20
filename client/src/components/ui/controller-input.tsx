import { cva } from "class-variance-authority";
import type { Component } from "solid-js";
import type { InputVariant } from "@/constants";
import { cn } from "@/lib/cn";
import type { InputInputEvent } from "@/types";

const inputVariants = cva("rounded", {
  variants: {
    intent: {
      text: "w-full border border-border bg-background px-3 py-2 text-sm transition-all placeholder:text-foreground/30 hover:border-foreground/20 focus:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/30",
      range:
        "h-2 w-full cursor-pointer appearance-none bg-gradient-to-r from-muted to-muted/50 accent-primary transition-all [&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:transition-transform [&::-moz-range-thumb]:hover:scale-110 [&::-moz-range-track]:border-0 [&::-moz-range-track]:bg-transparent [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:-mt-1 [&::-webkit-slider-runnable-track]:h-2 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:border-0 [&::-webkit-slider-runnable-track]:bg-transparent",
      number:
        "w-full rounded border border-border bg-background px-3 py-2 text-sm transition-all placeholder:text-foreground/20 hover:border-foreground/20 focus:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/30",
      color:
        "h-9 w-16 border border-border bg-background p-1 transition-colors hover:border-border",
    } satisfies Record<InputVariant, string>,
  },
});

type Props = {
  controlKey: string;
  label: string;
  type: InputVariant;
  min: number | undefined;
  max: number | undefined;
  value: string | number;
  setValue: (value: string | number) => void;
  class?: string;
};

const ControllerInput: Component<Props> = (props) => {
  const onInput = (e: InputInputEvent) => {
    props.setValue(e.currentTarget.value);
  };

  return (
    <div class={`${props.class} flex flex-col justify-center gap-2`}>
      <label
        for={props.controlKey}
        class={`font-medium text-foreground/70 text-xs uppercase tracking-wider`}
      >
        {props.label}
      </label>
      <input
        id={props.controlKey}
        class={cn(inputVariants({ intent: props.type }))}
        type={props.type}
        value={props.value}
        onInput={onInput}
        min={props.min}
        max={props.max}
      />
    </div>
  );
};

export default ControllerInput;
