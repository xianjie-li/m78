import React from "react";
import { createRoot } from "react-dom/client";
import { Play } from "./play";

const root = createRoot(document.getElementById("root")!);

root.render(<Play />);
