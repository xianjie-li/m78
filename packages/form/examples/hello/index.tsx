import { createRoot } from "react-dom/client";
import React from "react";
import FormExample from "./form-example.js";

const root = createRoot(document.getElementById("root")!);
root.render(<FormExample />);
