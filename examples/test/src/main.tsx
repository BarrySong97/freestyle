import { BrowserRouter } from 'react-router-dom';
import { StaticRouter } from 'react-router-dom/server';
import App from "./App.tsx";
import { createRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import "./index.css";
function createClientApp() {
  
  const containerEl = document.getElementById("root");
  if (!containerEl) {
    throw new Error("#root element not found");
  }
  createRoot(containerEl).render(
     <BrowserRouter>
      <App />
    </BrowserRouter>
  )
  return "client";
}

export function createSSRApp() {
  return renderToString(<StaticRouter location={'/'}><App /></StaticRouter>);
}

export function createSSG() {
  const isClient = typeof window !== "undefined";
  const output = isClient ? createClientApp() : createSSRApp();
  return output;
}

createSSG();
