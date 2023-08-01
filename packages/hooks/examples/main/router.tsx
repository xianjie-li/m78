import React from "react";
import {
  createHashRouter,
  NavLink,
  Outlet,
  RouteObject,
} from "react-router-dom";
import UseTriggerExample from "../use-trigger-example/use-trigger-example.js";

import css from "./style.module.css";
import UseScrollExample from "../use-scroll/use-scroll-example.js";
import { UseKeyboardExample } from "../use-keyboard/index.js";
import Play from "../play.js";

export const router = createHashRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "hello",
        index: true,
        element: <Play />,
      },
      {
        path: "useTrigger",
        index: true,
        element: <UseTriggerExample />,
      },
      {
        path: "useScroll",
        index: true,
        element: <UseScrollExample />,
      },
      {
        path: "useKeyboard",
        index: true,
        element: <UseKeyboardExample />,
      },
    ],
  },
]);

function renderLinks(routes: RouteObject[], parentPath = ""): React.ReactNode {
  return routes.map((i) => {
    const basePath = parentPath === "/" ? "" : parentPath;
    const p = parentPath ? `${basePath}/${i.path}` : i.path;
    if (!p) return null;
    if (i.children) return renderLinks(i.children, p);
    return (
      <NavLink
        key={p}
        to={p}
        className={({ isActive }) => (isActive ? css.red : "")}
        style={{ marginRight: 12 }}
      >
        {p}
      </NavLink>
    );
  });
}

function Root() {
  return (
    <div style={{ padding: 12 }}>
      <div>{renderLinks(router.routes)}</div>
      <div style={{ padding: 16, paddingBottom: 600 }}>
        <Outlet />
      </div>
    </div>
  );
}
