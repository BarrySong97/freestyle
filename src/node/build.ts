import { join } from "path";
import { build as viteBuild, InlineConfig } from "vite";
import type { RollupOutput } from "rollup";
import pluginReact from "@vitejs/plugin-react";
import * as fs from "fs-extra";
import { log } from "console";

export async function renderPage(
  render: () => string,
  root: string,
  clientBundle: RollupOutput
) {
  const clientChunk = clientBundle.output.find(
    (chunk) => chunk.type === "chunk" && chunk.isEntry
  );
  console.log(`Rendering page in server side...`);
  const appHtml = render();
  const html = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>title</title>
    <meta name="description" content="xxx">
  </head>
  <body>
    <div id="root">${appHtml}</div>
    <script type="module" src="/${clientChunk?.fileName}"></script>
  </body>
</html>`.trim();
  await fs.ensureDir(join(root, "build"));
  await fs.writeFile(join(root, "build/index.html"), html);
  await fs.remove(join(root, ".temp"));
}
export async function build(root: string) {
  // 1. bundle
  console.log(root);
  const resolveViteConfig = (isServer: boolean): InlineConfig => ({
    mode: "production",
    root,
    build: {
      ssr: isServer,
      outDir: isServer ? ".temp" : "build",
      rollupOptions: {
        input: join(root, "/src/main.tsx"),
        output: isServer
          ? {
              format: "cjs",
              entryFileNames: "[name].cjs",
            }
          : {
              format: "esm",
            },
      },
    },
  });
  try {
    const [clientBundle] = (await Promise.all([
      // client build
      viteBuild(resolveViteConfig(false)),
      viteBuild(resolveViteConfig(true)),
    ])) as [RollupOutput, RollupOutput];
    const serverEntryPath = join(root, ".temp", "main.cjs");
    const { createSSG } = require(serverEntryPath);

    // // 3. 服务端渲染，产出 HTML
    await renderPage(createSSG, root, clientBundle);
  } catch (error) {
    console.log(error);
  }
  // 2. server-entry
  // 3. static generation
}
