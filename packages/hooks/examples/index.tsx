import React from "react";
import { createRoot } from "react-dom/client";
import UseVirtualListDemo from "./use-virual-list/useVirtualList.demo";
import UseSelect from "./use-select/use-select";

const App = () => {
  return (
    <div>
      {/*<UseVirtualListDemo /> */}
      <UseSelect />
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);

root.render(<App />);
