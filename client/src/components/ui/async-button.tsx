import { createSignal, type JSX, splitProps } from "solid-js";

type Props = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
  onClick: () => void | Promise<void>;
};

const AsyncButton = (props: Props) => {
  const [local, rest] = splitProps(props, ["onClick", "children", "class"]);
  const [pending, setPending] = createSignal(false);

  const handleClick = async () => {
    if (pending()) return;
    setPending(true);
    try {
      await local.onClick();
    } catch (error) {
      console.error(error);
    } finally {
      setPending(false);
    }
  };

  return (
    <button
      {...rest}
      aria-busy={pending()}
      data-state={pending() ? "loading" : "idle"}
      disabled={pending() || rest.disabled}
      type={rest.type ?? "button"}
      onClick={handleClick}
      class={`${local.class} group relative inline-flex cursor-pointer items-center gap-2 rounded-sm px-3 py-2 font-semibold text-white text-xs shadow-sm transition-all duration-200 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-20 disabled:shadow-none`}
      classList={{
        "group-hover:translate-y-0.5 active:scale-95": !pending(),
      }}
    >
      {local.children}
    </button>
  );
};

export default AsyncButton;
