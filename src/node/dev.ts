import { createServer } from "vite";

export function createDevServer(root: string = process.cwd()) {
  return createServer({
    root,
  });
}
