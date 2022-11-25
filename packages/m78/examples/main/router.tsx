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
  return (
    <div>
      <div className="border p-8 radius mb-16">
        {renderLinks(router.routes)}
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
}
