import type { Component } from "solid-js";
import {
  createContext,
  createMemo,
  createResource,
  type JSXElement,
  useContext,
} from "solid-js";
import type { APIResponse } from "../../../shared/types/api";

type FontContextProps = {
  children: JSXElement;
};

export type FontMapConfig = {
  index: number;
} & APIResponse[number];

type FontContextValues = {
  fontsList: () => APIResponse | undefined;
  fontsMap: () => Map<string, FontMapConfig>;
  loading: () => boolean;
};

const FontContext = createContext<FontContextValues>();

export const FontProvider: Component<FontContextProps> = (props) => {
  const [fontsList] = createResource<APIResponse>(() =>
    fetch(import.meta.env.VITE_API_URL).then((res) => res.json()),
  );

  const fontsMap = createMemo(() => {
    const map = new Map<string, FontMapConfig>();
    if (!fontsList()) return map;
    fontsList()?.forEach(({ family, files, menu, variants }, index) => {
      map.set(family, { index, family, files, menu, variants });
    });
    return map;
  });

  return (
    <FontContext.Provider
      value={{
        fontsList,
        fontsMap,
        loading: () => fontsList.loading,
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
