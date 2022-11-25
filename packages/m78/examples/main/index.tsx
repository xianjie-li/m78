import React from "react";
import { RouterProvider } from "react-router-dom";
import { render } from "../utils";
import { router } from "./router";

function App() {
  return (
    <div className="p-12">
      <RouterProvider router={router} fallbackElement="loading..." />
    </div>
  );
}

render(<App />);
