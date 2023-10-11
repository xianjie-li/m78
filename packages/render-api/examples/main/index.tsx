import React from "react";
import { createRoot } from "react-dom/client";
import Demo1 from "./demo1";

const App = () => {
  return (
    <div>
      <Demo1 />
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);

root.render(<App />);
