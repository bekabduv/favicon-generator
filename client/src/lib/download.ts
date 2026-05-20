import type { FileName, Size } from "@/constants";

export const triggerDownload = (dataUrl: string, filename: string) => {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
};

// --------------------------------------------------------------------

const blobToUint8Array = async (blob: Blob) => {
  const arrayBuffer = await blob.arrayBuffer();
  return new Uint8Array(arrayBuffer);
};

// ------------------------------------------------------------------

type Props = {
  getCanvasBlob: (canvasSize: number) => Promise<Blob | null>;
  backgroundColor: string;
  svgString: string;
};

type Icons = Array<{
  src: `/${FileName}`;
  sizes: `${Size}x${Size}`;
  type: "image/png";
}>;

export const downloadZip = async ({
  backgroundColor,
  getCanvasBlob,
  svgString,
}: Props) => {
  const [{ strToU8, zipSync }, { default: ICO }] = await Promise.all([
    import("fflate"),
    import("icojs/browser"),
  ]);

  const pngFiles = [
    { filename: "apple-touch-icon.png", size: 180 },
    { filename: "android-chrome-192x192.png", size: 192 },
    { filename: "android-chrome-512x512.png", size: 512 },
  ] as const satisfies ReadonlyArray<{ filename: FileName; size: Size }>;

  const icoSizes = [16, 32, 48] as const satisfies ReadonlyArray<Size>;
  const allSizes: Size[] = [...pngFiles.map((each) => each.size), ...icoSizes];
  const pngAssets: Partial<Record<Size, Uint8Array>> = {};

  await Promise.all(
    allSizes.map(async (size) => {
      const blob = await getCanvasBlob(size);
      if (!blob) return;
      pngAssets[size] = await blobToUint8Array(blob);
    }),
  );

  const icoBuffers = icoSizes
    .map((size) => pngAssets[size]?.buffer)
    .filter((buffer): buffer is ArrayBuffer => Boolean(buffer))
    .map((buffer) => ({ buffer }));

  const encodedIcoBuffer = await ICO.encodeIco(icoBuffers);
  const icoUint8 = new Uint8Array(encodedIcoBuffer);

  const manifest = {
    name: "My App",
    short_name: "App",
    icons: [
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ] satisfies Icons,

    theme_color: backgroundColor,
    background_color: backgroundColor,
    display: "standalone",
    start_url: "/",
  };

  const pngUint8: Partial<Record<FileName, Uint8Array>> = {};

  for (const { filename, size } of pngFiles) {
    const uint8 = pngAssets[size];
    if (!uint8) continue;
    pngUint8[filename] = uint8;
  }

  // ----- zip it all up
  const allFiles = {
    ...pngUint8,
    "favicon.ico": icoUint8,
    "favicon.svg": strToU8(svgString),
    "site.webmanifest": strToU8(JSON.stringify(manifest, null, 2)),
  } satisfies Partial<Record<FileName, Uint8Array>>;

  const zippedFiles = zipSync(allFiles) as BlobPart;

  const zipBlob = new Blob([zippedFiles], { type: "application/zip" });
  const blobURL = URL.createObjectURL(zipBlob);
  triggerDownload(blobURL, "favicon_package.zip");
  URL.revokeObjectURL(blobURL);
};
