import { Select } from "@kobalte/core/select";
import CheckIcon from "lucide-solid/icons/check";
import ChevronsUpDownIcon from "lucide-solid/icons/chevrons-up-down";
import type { Component } from "solid-js";
import { useFonts } from "@/contexts/FontContext";

type SelectFontWeightProps = {
  class?: string;
  currentFont: string;
  value: number;
  onChange: (value: number | null) => void;
};

const SelectFontWeight: Component<SelectFontWeightProps> = (props) => {
  const { fontsMap } = useFonts();
  const fontWeights = () =>
    fontsMap()
      .get(props.currentFont)
      ?.variants.filter((each) => !each.includes("italic"))
      .map((each) => parseInt(each, 10) || 400) || [];

  return (
    <Select
      value={
        fontsMap()
          .get(props.currentFont)
          ?.variants.includes(props.value.toString())
          ? props.value
          : 400
      }
      onChange={props.onChange}
      options={fontWeights()}
      placeholder="Select a Font variant"
      class={`${props.class} rounded-sm border border-border bg-background/50`}
      itemComponent={(props) => (
        <Select.Item
          item={props.item}
          class="flex w-full cursor-default items-center justify-between overflow-hidden text-ellipsis whitespace-nowrap px-3 py-2 text-sm outline-none transition-colors data-[highlighted]:bg-primary/20 data-[highlighted]:text-primary"
        >
          <Select.ItemLabel>{props.item.rawValue}</Select.ItemLabel>
          <Select.ItemIndicator>
            <CheckIcon class="size-4" />
          </Select.ItemIndicator>
        </Select.Item>
      )}
    >
      <Select.Trigger
        class={`${props.class} flex w-full items-center justify-between rounded-sm bg-background/50 px-3 py-2 text-sm outline-none transition-all hover:ring hover:ring-primary/10 focus:border-primary/50 focus:ring-2 focus:ring-primary/20`}
        aria-label="Font Weight"
      >
        <Select.Value<string> class="text-foreground/80">
          {(state) => state.selectedOption()}
        </Select.Value>
        <Select.Icon>
          <ChevronsUpDownIcon class="size-4 text-foreground/40" />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content class="rounded-sm border border-border bg-card/80 shadow-lg backdrop-blur-sm">
          <Select.Listbox class="overflow-auto overscroll-contain rounded-sm bg-card outline-none" />
        </Select.Content>
      </Select.Portal>
    </Select>
  );
};

export default SelectFontWeight;
