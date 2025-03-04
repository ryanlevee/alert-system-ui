import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/app.css";
import "./styles/data.css";
import "./styles/events.css";
import "./styles/home.css";
import "./styles/index.css";
import "./styles/map.css";
import "./styles/sidebar.css";
import "./styles/theme.css";
import "./styles/animation.css";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <App />
    </StrictMode>,
);
