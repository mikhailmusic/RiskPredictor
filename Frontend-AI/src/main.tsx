import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { validateEnv } from "./validateEnv.ts";
import App from "./App.tsx";
import './assets/index.css'

validateEnv();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
