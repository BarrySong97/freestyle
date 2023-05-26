import { build as viteBuild } from "vite";
export async function build(root: string) {
  // 1. bundle
  try {
    const clientBuild = await viteBuild({
      root,
      build: {},
    });

    const serverBuild = await viteBuild({
      root,
      build: {
        ssr: true,
      },
    });
  } catch (error) {}
  // 2. server-entry
  // 3. static generation
}
