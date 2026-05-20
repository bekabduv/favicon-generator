import type { Font } from "opentype.js";

// -----------------------------------

const getFontUrl = (
  family: string,
  weight: number,
  text: string,
  options: { loadFull: boolean },
) =>
  options.loadFull
    ? `https://fonts.googleapis.com/css2?family=${family}:wght@${weight}&display=swap`
    : `https://fonts.googleapis.com/css2?family=${family}:wght@${weight}&text=${encodeURIComponent(text)}&display=swap`;

// -----------------------------------------------

type FontCacheEntry = {
  full: Record<string, boolean>;
  chars: Record<string, Set<string>>;
};

const loadedFontsCache = new Map<string, FontCacheEntry>();

const FULL_FONT_THRESHOLD = 3;

export const loadFont = async (
  fontFamily: string,
  fontWeight: number,
  text: string,
) => {
  if (!/\S/.test(text)) return;
  const existing = loadedFontsCache.get(fontFamily);
  if (existing?.full[fontWeight]) return;

  const uniqueChars = new Set(text);

  if (
    existing &&
    [...uniqueChars].every((c) => existing.chars[fontWeight]?.has(c))
  )
    return;

  const loadFull =
    text.length > FULL_FONT_THRESHOLD ||
    /\b(icons?|emojis?|symbols?)\b/i.test(fontFamily);

  const newChars = [...uniqueChars]
    .filter((c) => !existing?.chars[fontWeight]?.has(c))
    .join("");
  if (!newChars.length) return;

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = getFontUrl(
    fontFamily.replace(/\s/g, "+"),
    fontWeight,
    newChars.replace(/\s/g, ""),
    // .replace(/[^\x20-\x7E]/g, "") use this to prevent unsupported glyphs
    {
      loadFull,
    },
  );
  document.head.append(link);

  await new Promise<void>((resolve) => {
    link.onload = () => resolve();
    link.onerror = () => {
      console.warn(`Failed for font: ${fontFamily}`);
      resolve();
    };
  });

  try {
    await document.fonts.load(`${fontWeight} 16px '${fontFamily}'`, text);
    loadedFontsCache.set(fontFamily, {
      full: { ...existing?.full, [fontWeight]: loadFull },
      chars: {
        ...existing?.chars,
        [fontWeight]: new Set([
          ...(existing?.chars[fontWeight] || []),
          ...newChars,
        ]),
      },
    });
  } catch (error) {
    console.warn(`Error while loading font: ${fontFamily}\n${error}`);
  }
};

// ----------------------------------------------

export async function loadMenuFont(fontFamily: string, url: string) {
  const existing = loadedFontsCache.get(fontFamily);
  if (existing?.full?.[400]) return;
  try {
    const newFont = new FontFace(fontFamily, `url(${url})`);
    await newFont.load();
    document.fonts.add(newFont);
    loadedFontsCache?.set(fontFamily, {
      chars: {
        ...existing?.chars,
        400: new Set([...(existing?.chars[400] || []), ...fontFamily]),
      },
      full: { ...existing?.full, 400: false },
    });
  } catch (error) {
    console.warn(`Failed to to load: ${error}`);
  }
}

// -----------------------------------------

const openTypeCache = new Map<string, Font>();

export const loadTTFFont = async (ttfUrl: string) => {
  if (openTypeCache.has(ttfUrl)) return openTypeCache.get(ttfUrl);
  const [response, opentype] = await Promise.all([
    fetch(ttfUrl),
    import("opentype.js"),
  ]);
  const buffer = await response.arrayBuffer();
  const font = opentype.parse(buffer);
  openTypeCache.set(ttfUrl, font);
  return font;
};
