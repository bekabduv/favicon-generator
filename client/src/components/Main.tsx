import { makePersisted } from "@solid-primitives/storage";
import { createStore } from "solid-js/store";
import { CONTROLS_INITIAL_STATE, type ControlsInitialState } from "@/constants";
import { FontProvider } from "@/contexts/FontContext";
import Controller from "./Controller";
import Favicon from "./Favicon";
import Guide from "./Guide";

const Main = () => {
  const [controls, setControls] = makePersisted(
    createStore<ControlsInitialState>(CONTROLS_INITIAL_STATE),
    { name: "app-state-details-v1" },
  );

  return (
    <FontProvider>
      <main class="flex flex-col gap-2 p-2 md:h-dvh md:flex-row">
        <div
          style={{
            "scrollbar-width": "none",
            "overflow-y": "overlay",
          }}
          class="@container relative flex h-[calc(100dvh-2rem)] flex-col gap-2 overflow-y-auto md:h-auto md:flex-1"
        >
          <Favicon controls={controls} />
          <Controller controls={controls} setControls={setControls} />
        </div>
        <Guide />
      </main>
    </FontProvider>
  );
};

export default Main;
