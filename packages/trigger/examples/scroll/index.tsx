import { createRoot } from "react-dom/client";
import React from "react";
import Page from "./page.js";

const root = createRoot(document.getElementById("root")!);
root.render(<Page />);
