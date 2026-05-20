import { Select } from "@kobalte/core/select";
import ChevronDownIcon from "lucide-solid/icons/chevron-down";
import type { Component } from "solid-js";
import type { Size } from "@/constants";

type Props<T extends string = string> = {
  class?: string;
  options: Array<T>;
  onChange: (value: Size) => void;
  placeholder?: string;
};

const SelectSize: Component<Props> = (props) => {
  return (
    <Select
      options={props.options}
      onChange={(value) => value && props.onChange(parseInt(value, 10) as Size)}
      placeholder=""
      class="w-fit"
      placement="bottom-end"
      itemComponent={(itemProps) => (
        <Select.Item
          item={itemProps.item}
          class="group flex w-[13ch] cursor-pointer items-center gap-2 px-3 py-1.5 text-foreground/80 text-sm outline-none transition-colors duration-150 data-[highlighted]:bg-primary/10 data-[highlighted]:text-primary"
          classList={{
            "bg-primary/10": itemProps.item.rawValue === "64",
          }}
        >
          <Select.ItemLabel class="flex-1 text-center font-medium text-foreground/80 tabular-nums">
            {itemProps.item.rawValue}x{itemProps.item.rawValue}
          </Select.ItemLabel>
        </Select.Item>
      )}
    >
      <Select.Trigger
        class={`${props.class ?? ""} group flex h-full w-fit cursor-pointer items-center justify-center p-2 text-foreground/60 text-sm outline-none transition-colors duration-150 hover:bg-primary/10 hover:text-foreground/90`}
        aria-label="Select size"
      >
        <Select.Icon>
          <ChevronDownIcon class="size-3.5 transition-transform duration-200 group-data-[expanded]:rotate-180" />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content class="z-50 overflow-hidden rounded-sm border border-border/60 bg-card/90 shadow-black/10 shadow-xl backdrop-blur-md">
          <Select.Listbox class="max-h-[20ch] overflow-y-auto overscroll-contain outline-none" />
        </Select.Content>
      </Select.Portal>
    </Select>
  );
};

export default SelectSize;
