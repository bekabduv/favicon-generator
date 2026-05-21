import { Select } from "@kobalte/core/select";
import { createVirtualizer } from "@tanstack/solid-virtual";
import CheckIcon from "lucide-solid/icons/check";
import ChevronsUpDownIcon from "lucide-solid/icons/chevrons-up-down";
import SearchIcon from "lucide-solid/icons/search";
import { type Component, createMemo, createSignal, For } from "solid-js";
import { type FontsConfig, useFonts } from "@/contexts/FontContext";
import { loadMenuFont } from "@/lib/font";

type SelectedContentProps = {
  options: Array<string>;
  optionsMap: () => Map<string, FontsConfig>;
  selectedOption: string;
};

const ICON_FONTS = /\b(icons?|emojis?|symbols?)\b/i;

function SelectContent(props: SelectedContentProps) {
  // biome-ignore lint/style/useConst: <This variable is reassigned on mount>
  let listboxRef: HTMLUListElement | null = null;
  let searchRef: HTMLInputElement | undefined;

  const [search, setSearch] = createSignal("");

  const filteredItems = createMemo(() => {
    const q = search().toLowerCase().trim();
    if (!q) return props.options;
    return props.options.filter((item) => item.toLowerCase().includes(q));
  });

  const virtualizer = createVirtualizer({
    get count() {
      return filteredItems().length;
    },
    getScrollElement: () => listboxRef,
    getItemKey: (index: number) => filteredItems()?.[index],
    estimateSize: () => 38,
    overscan: 15,
  });

  // onMount(() => searchRef?.focus());

  return (
    <Select.Content class="z-50 max-w-[40ch] rounded-sm border border-border bg-card/80 shadow-lg backdrop-blur-sm">
      <div class="flex items-center gap-2 border-border/80 border-b px-3 py-2.5">
        <SearchIcon class="size-4 shrink-0 text-foreground/40" />
        <input
          ref={searchRef}
          type="text"
          value={search()}
          placeholder="Search fonts…"
          class="w-full bg-transparent text-sm outline-none placeholder:text-foreground/40"
          onInput={(e) => {
            setSearch(e.currentTarget.value);
            if (!e.currentTarget.value.trim())
              virtualizer.scrollToIndex(
                props.optionsMap().get(props.selectedOption)?.index ?? 0,
              );
          }}
          onPointerDown={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            if (e.key !== "Escape") e.stopPropagation();
          }}
        />
      </div>

      <Select.Listbox
        ref={listboxRef}
        scrollToItem={(key) => {
          const index = filteredItems().indexOf(key);
          if (index < 0) return;
          virtualizer.scrollToIndex(index);
        }}
        class="h-80 w-full overflow-auto overscroll-contain rounded-sm bg-card outline-none"
      >
        {(selectState) => (
          <div
            class="relative w-full"
            style={{ height: `${virtualizer.getTotalSize()}px` }}
          >
            <For each={virtualizer.getVirtualItems()}>
              {(virtualRow) => {
                const items = filteredItems();
                const value = items[virtualRow.index];
                const item = selectState().getItem(value);
                const fontFamily = item?.rawValue;
                const menuFontUrl = props.optionsMap().get(fontFamily)?.menu;
                if (menuFontUrl) loadMenuFont(fontFamily, menuFontUrl);

                if (!item) return null;
                return (
                  <Select.Item
                    item={item}
                    class="absolute top-0 left-0 flex w-full cursor-default items-center justify-between overflow-hidden text-ellipsis whitespace-nowrap px-3 py-2 text-sm outline-none transition-colors data-[highlighted]:bg-primary/20 data-[highlighted]:text-primary"
                    style={{
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  >
                    <Select.ItemLabel
                      style={{
                        "font-family": ICON_FONTS.test(item.rawValue)
                          ? undefined
                          : `'${item.rawValue}', system-ui`,
                      }}
                    >
                      {item.rawValue}
                    </Select.ItemLabel>
                    <Select.ItemIndicator>
                      <CheckIcon class="size-4" />
                    </Select.ItemIndicator>
                  </Select.Item>
                );
              }}
            </For>
          </div>
        )}
      </Select.Listbox>
    </Select.Content>
  );
}

type TSelectFont = {
  value: string;
  onChange: (item: string | null) => void;
  class?: string;
};

const SelectFontFamily: Component<TSelectFont> = (props) => {
  const { fontsList, fontsMap } = useFonts();
  return (
    <Select
      virtualized
      options={fontsList()}
      value={props.value}
      onChange={props.onChange}
      placeholder="Select Font"
    >
      <Select.Trigger
        aria-label="Font Families"
        class="flex w-full items-center justify-between rounded-sm border border-border bg-background/50 px-3 py-2 text-sm outline-none transition-all hover:border-primary/20 focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
      >
        <Select.Value<string>>{(state) => state.selectedOption()}</Select.Value>
        <Select.Icon>
          <ChevronsUpDownIcon class="size-4 text-foreground/40" />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <SelectContent
          options={fontsList()}
          optionsMap={fontsMap}
          selectedOption={props.value}
        />
      </Select.Portal>
    </Select>
  );
};
export default SelectFontFamily;
