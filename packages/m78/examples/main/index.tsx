import React from "react";
import { RouterProvider } from "react-router-dom";
import { render } from "../utils";
import { router } from "./router";

function App() {
  return <RouterProvider router={router} fallbackElement="loading..." />;
}

render(<App />);
