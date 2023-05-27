import App from "./App.tsx";
import { createRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import "./index.css";

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
  const output = isClient ? createClientApp(App) : createSSRApp(App);
  return output;
}

createSSG(<App />);
