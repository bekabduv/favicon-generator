import MoonIcon from "lucide-solid/icons/moon";
import SunIcon from "lucide-solid/icons/sun";

type Props = {
  dark: boolean;
  toggleTheme: () => void;
};

const ToggleThemeButton = (props: Props) => {
  return (
    <button
      onClick={props.toggleTheme}
      type="button"
      aria-label={props.dark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={props.dark}
      class="z-11 ml-1.5 flex size-7.5 cursor-pointer items-center justify-center rounded-lg bg-card text-foreground"
    >
      {props.dark ? (
        <SunIcon aria-hidden="true" class="size-4" />
      ) : (
        <MoonIcon aria-hidden="true" class="size-4" />
      )}
    </button>
  );
};

export default ToggleThemeButton;
