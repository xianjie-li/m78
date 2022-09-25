import React from "react";
import { createRoot } from "react-dom/client";
import UseVirtualListDemo from "./use-virual-list/useVirtualList.demo";

const App = () => {
  return (
    <div>
      <UseVirtualListDemo />
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);

root.render(<App />);
