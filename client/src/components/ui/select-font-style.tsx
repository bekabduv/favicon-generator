type Props = {
  italic: boolean;
  setItalic: () => void;
  class?: string;
};

const SelectFontStyle = (props: Props) => {
  return (
    <button
      class={`${props.class} flex-1 rounded-sm border px-2 py-2 font-medium font-medium text-foreground/70 text-sm tracking-wider transition-all duration-200 ${
        props.italic
          ? "border-border bg-muted text-primary"
          : "border-border/80 text-foreground/60 hover:border-border hover:bg-muted/30 hover:text-foreground/80"
      }`}
      classList={{ italic: props.italic }}
      type="button"
      aria-pressed={props.italic}
      onClick={props.setItalic}
    >
      Italic
    </button>
  );
};

export default SelectFontStyle;
