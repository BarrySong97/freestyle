import { createRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { FreeStyleSSGContext } from "../types";
function createClientApp(App: JSX.Element) {
  const containerEl = document.getElementById("root");
  if (!containerEl) {
    throw new Error("#root element not found");
  }
  createRoot(containerEl).render(App);
  return "client";
}

export function createSSRApp(App: JSX.Element) {
  return renderToString(App);
}
export function createSSG(App: JSX.Element) {
  const isClient = typeof window !== "undefined";

  async function createApp(client = false) {
    const context = {
      isClient,
    };

    // serialize initial state for SSR app for it to be interpolated to output HTML

    return {
      ...context,
    } as FreeStyleSSGContext;
  }

  const output = isClient ? createClientApp(App) : createSSRApp(App);
  return output;
}
