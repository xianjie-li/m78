import React from "react";
import {
  createHashRouter,
  NavLink,
  Outlet,
  RouteObject,
} from "react-router-dom";
import { SpinExample } from "../spin";
import { SeedExample } from "../seed";
import { I18NExample } from "../i18n";
import { ButtonExample } from "../button";
import IconExample from "../icon/icon-example";
import LayoutExample from "../layout";
import { Row } from "../../src/layout";
import InputExample from "../input/input-example";
import OverlayExample from "../overlay/overlay-example.js";

export const router = createHashRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "spin",
        index: true,
        element: <SpinExample />,
      },
      {
        path: "button",
        element: <ButtonExample />,
      },
      {
        path: "icon",
        element: <IconExample />,
      },
      {
        path: "layout",
        element: <LayoutExample />,
      },
      {
        path: "i18n",
        element: <I18NExample />,
      },
      {
        path: "seed",
        element: <SeedExample />,
      },
      {
        path: "input",
        element: <InputExample />,
      },
      {
        path: "overlay",
        element: <OverlayExample />,
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
        className={({ isActive }) => (isActive ? "mr-12 color-red" : "mr-12")}
      >
        {p}
      </NavLink>
    );
  });
}

function Root() {
  function toggleMode() {
    const mode = document.documentElement.getAttribute("data-mode") || "light";
    document.documentElement.setAttribute(
      "data-mode",
      mode === "light" ? "dark" : "light"
    );
  }

  return (
    <div className="p-12">
      <Row mainAlign="between" className="border p-8 radius mb-16">
        <div>{renderLinks(router.routes)}</div>
        <button onClick={toggleMode}>dark</button>
      </Row>
      <div className="border p-8 radius" style={{ paddingBottom: 600 }}>
        <Outlet />
      </div>
    </div>
  );
}
