import type { Component } from "solid-js";
import {
  createContext,
  createResource,
  type JSXElement,
  useContext,
} from "solid-js";
import type { APIResponse } from "../../../shared/types/api";

type FontContextProps = {
  children: JSXElement;
};

export type FontsConfig = {
  index: number;
} & APIResponse[number];

type FontContextValues = {
  fontsList: () => Array<string>;
  fontsMap: () => Map<string, FontsConfig>;
};

const FontContext = createContext<FontContextValues>();

export const FontProvider: Component<FontContextProps> = (props) => {
  const [fonts] = createResource(
    async () => {
      const response = await fetch(import.meta.env.VITE_API_URL);
      const data: APIResponse = await response.json();

      const map = new Map<string, FontsConfig>();
      const list: Array<string> = [];

      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        if (!item) continue;
        (item as FontsConfig & { index: number }).index = i;
        map.set(item.family, item as FontsConfig);

        list.push(item.family);
      }

      return { map, list };
    },
    {
      initialValue: { list: [], map: new Map() },
    },
  );

  ////////////////////////////
  return (
    <FontContext.Provider
      value={{
        fontsList: () => fonts().list,
        fontsMap: () => fonts().map,
      }}
    >
      {props.children}
    </FontContext.Provider>
  );
};

export const useFonts = () => {
  const context = useContext(FontContext);
  if (!context) throw new Error("useFonts must be used within a FontProvider");
  return context;
};
