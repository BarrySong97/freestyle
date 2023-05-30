import { join } from 'path';
import { build as viteBuild, InlineConfig, resolveConfig } from 'vite';
import type { RollupOutput } from 'rollup';
import * as fs from 'fs-extra';

export async function renderPage(
  render: () => string,
  root: string,
  clientBundle: RollupOutput
) {
  const clientChunk = clientBundle.output.find(
    (chunk) => chunk.type === 'chunk' && chunk.isEntry
  );
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
  await fs.ensureDir(join(root, 'build'));
  await fs.writeFile(join(root, 'build/index.html'), html);
  await fs.remove(join(root, '.temp'));
}
export async function build(root: string) {
  // 1. bundle
  const config = await resolveConfig(
    {
      configFile: join(root, 'vite.config.ts')
    },
    'build',
    'production'
  );
  const resolveViteConfig = (isServer: boolean): InlineConfig => ({
    mode: 'production',
    root,
    ssr: {
      // 注意加上这个配置，防止 cjs 产物中 require ESM 的产物，因为 react-router-dom 的产物为 ESM 格式
      noExternal: ['react-router-dom']
    },
    build: {
      ssr: isServer,
      outDir: isServer ? '.temp' : 'build',
      rollupOptions: {
        input: join(root, '/src/main.tsx'),
        output: isServer
          ? {
              format: 'cjs',
              entryFileNames: '[name].cjs'
            }
          : {
              format: 'esm'
            }
      }
    }
  });
  const ssgOption = config?.ssgOptions;
  try {
    const [clientBundle] = (await Promise.all([
      // client build
      viteBuild(resolveViteConfig(false)),
      viteBuild(resolveViteConfig(true))
    ])) as [RollupOutput, RollupOutput];
    const serverEntryPath = join(root, '.temp', 'main.cjs');
    const { createSSG } = await import(serverEntryPath);

    // // // 3. 服务端渲染，产出 HTML
    await renderPage(createSSG, root, clientBundle);
  } catch (error) {
    console.log(error);
  }
  // 2. server-entry
  // 3. static generation
}
