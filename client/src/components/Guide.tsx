import CheckIcon from "lucide-solid/icons/check";
import CopyIcon from "lucide-solid/icons/copy";
import { createSignal, For } from "solid-js";
import { fileNames } from "@/constants";

const SNIPPET = `
  <link rel="icon" href="/favicon.ico">
  <link rel="icon" href="/icon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  <link rel="manifest" href="/site.webmanifest">
  `;

//

const Guide = () => {
  const [copy, setCopy] = createSignal(false);

  const onClick = async () => {
    setCopy(true);
    try {
      await navigator.clipboard.writeText(SNIPPET);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = SNIPPET;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();

      try {
        document.execCommand("copy");
      } catch {
      } finally {
        document.body.removeChild(textarea);
      }
    }
    setTimeout(setCopy, 500, false);
  };

  return (
    <article
      style={{
        "scrollbar-width": "thin",
        "scrollbar-gutter": "stable",
      }}
      class="flex-1 overflow-y-auto rounded-sm border border-border bg-card"
    >
      <div class="flex items-center gap-2 border-border/80 border-b bg-card/50 px-5 py-3">
        <div class="h-1.5 w-1.5 rounded-full bg-primary" />
        <h2 class="font-semibold text-foreground/80 text-xs uppercase tracking-widest">
          Guide
        </h2>
      </div>

      <div class="px-5">
        <section class="flex flex-col gap-4 pt-6">
          <h3 class="font-medium text-foreground/70 text-xs uppercase tracking-widest">
            Choosing a Format
          </h3>
          <p class="text-foreground/80 text-sm leading-relaxed">
            For maximum browser and platform compatibility, download the{" "}
            <strong class="font-semibold text-foreground">Zip package</strong>.
            It bundles icons sized for all major platforms, including Apple
            devices, Android, and Progressive Web Apps (PWAs).
          </p>
          <p class="text-foreground/80 text-sm leading-relaxed">
            If you prefer a minimal setup, the{" "}
            <strong class="font-semibold text-foreground">SVG</strong> format is
            highly recommended. SVGs are resolution-independent and natively
            supported by all modern browsers.
          </p>
        </section>

        <section class="mt-6 flex flex-col gap-4 border-border/80 border-t pt-6">
          <h3 class="font-medium text-foreground/70 text-xs uppercase tracking-widest">
            Zip Package Contents
          </h3>
          <ul class="flex flex-wrap gap-1.5">
            <For each={fileNames}>
              {(name) => (
                <li>
                  <code class="rounded-sm bg-muted px-1.5 py-0.5 font-mono text-foreground/80 text-xs">
                    {name}
                  </code>
                </li>
              )}
            </For>
          </ul>
        </section>

        <section class="mt-6 flex flex-col gap-4 border-border/80 border-t pt-6">
          <h3 class="font-medium text-foreground/70 text-xs uppercase tracking-widest">
            Installation
          </h3>
          <ol class="flex list-outside list-decimal flex-col gap-3 pl-5 text-foreground/80 text-sm marker:text-foreground/40">
            <li class="pl-1 leading-relaxed">Download the Zip package.</li>
            <li class="pl-1 leading-relaxed">
              Extract the contents and place them{" "}
              <strong class="font-semibold text-foreground">directly</strong>{" "}
              inside the{" "}
              <code class="rounded-sm bg-muted px-1.5 py-0.5 font-mono text-foreground/80 text-xs">
                /public
              </code>{" "}
              directory of your project. The files must sit at the root of{" "}
              <code class="rounded-sm bg-muted px-1.5 py-0.5 font-mono text-foreground/80 text-xs">
                /public
              </code>{" "}
              — do not nest them in a subdirectory.
              <br />
              <strong class="font-semibold text-foreground">
                Correct:
              </strong>{" "}
              <code class="rounded-sm bg-muted px-1.5 py-0.5 font-mono text-foreground/80 text-xs">
                public/favicon.svg
              </code>
              <br />
              <strong class="font-semibold text-foreground">
                Incorrect:
              </strong>{" "}
              <code class="rounded-sm bg-muted px-1.5 py-0.5 font-mono text-foreground/80 text-xs">
                public/favicons/favicon.svg
              </code>
            </li>
            <li class="pl-1 leading-relaxed">
              Add the following snippet to the{" "}
              <code class="rounded-sm bg-muted px-1.5 py-0.5 font-mono text-foreground/80 text-xs">
                &lt;head&gt;
              </code>{" "}
              of your{" "}
              <code class="rounded-sm bg-muted px-1.5 py-0.5 font-mono text-foreground/80 text-xs">
                index.html
              </code>
              . Order matters — paste it exactly as shown.
              <div class="relative mt-3 rounded-sm bg-muted">
                <pre class="overflow-x-auto p-4 pr-10 font-mono text-foreground/70 text-xs leading-relaxed">
                  <code>{SNIPPET}</code>
                </pre>
                <button
                  type="button"
                  aria-label={copy() ? "Copied" : "Copy snippet"}
                  onClick={onClick}
                  class="absolute top-2.5 right-2.5 rounded-sm p-1 text-foreground/30 transition-colors duration-150 hover:bg-background/60 hover:text-foreground/70"
                >
                  {copy() ? (
                    <CheckIcon class="size-3.5 text-green-500" />
                  ) : (
                    <CopyIcon class="size-3.5" />
                  )}
                </button>
              </div>
            </li>
            <li class="pl-1 leading-relaxed">
              Reload the page to verify the favicon renders correctly. If it
              blends into the browser chrome due to a similar background color,
              consider regenerating it with a more contrasting background.
            </li>
          </ol>
        </section>

        <section class="mt-6 flex flex-col gap-4 border-border/80 border-t pt-6 pb-6">
          <h3 class="font-medium text-foreground/70 text-xs uppercase tracking-widest">
            Tools Used
          </h3>
          <ul class="flex list-outside list-disc flex-col gap-2 pl-4 text-foreground/80 text-sm marker:text-foreground/30">
            <li class="pl-1 leading-relaxed">
              <strong class="font-semibold text-foreground">opentype.js</strong>{" "}
              — extracts individual glyphs from TTF/OTF font files and encodes
              them as SVG paths
            </li>
            <li class="pl-1 leading-relaxed">
              <strong class="font-semibold text-foreground">fflate</strong> —
              fast, lightweight zip compression
            </li>
            <li class="pl-1 leading-relaxed">
              <strong class="font-semibold text-foreground">icojs</strong> —
              generates multi-size{" "}
              <code class="rounded-sm bg-muted px-1.5 py-0.5 font-mono text-foreground/80 text-xs">
                .ico
              </code>{" "}
              files from PNG images
            </li>
            <li class="pl-1 leading-relaxed">
              <strong class="font-semibold text-foreground">
                TanStack Virtual
              </strong>{" "}
              — virtualized list rendering for the font family selector
            </li>
          </ul>
        </section>
      </div>
    </article>
  );
};

export default Guide;
