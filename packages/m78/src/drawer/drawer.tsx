import React, { useMemo } from "react";
import clsx from "clsx";
import {
  omitApiProps,
  Overlay,
  OverlayApiOmitKeys,
  OverlayCustomMeta,
  OverlayInstance,
} from "../overlay/index.js";
import { isFunction, omit, TupleNumber } from "@m78/utils";
import { TransitionTypeUnion } from "../transition/index.js";
import { Position, Z_INDEX_DRAWER } from "../common/index.js";
import upperFirst from "lodash/upperFirst.js";
import createRenderApi from "@m78/render-api";
import {
  DrawerProps,
  omitDrawerOverlayProps,
  DrawerOmitOverlayProps,
} from "./types.js";

const positionMap = {
  [Position.top]: [0.5, 0] as TupleNumber,
  [Position.right]: [1, 0.5] as TupleNumber,
  [Position.bottom]: [0.5, 1] as TupleNumber,
  [Position.left]: [0, 0.5] as TupleNumber,
};

const defaultProps: Partial<DrawerProps> = {
  position: Position.bottom,
  namespace: "DRAWER",
  mask: true,
  zIndex: Z_INDEX_DRAWER,
};

const DrawerBase = (props: DrawerProps) => {
  const { className, position, header, footer, ...other } = props;

  const overlayProps: DrawerOmitOverlayProps = useMemo(() => {
    return omit(other, omitDrawerOverlayProps as any);
  }, [props]);

  function renderContent(meta: OverlayCustomMeta) {
    const content = isFunction(props.content)
      ? props.content(meta)
      : props.content;

    return (
      <>
        {header && <div className="m78-drawer_header">{header}</div>}
        <div className="m78-drawer_content">{content}</div>
        {footer && <div className="m78-drawer_footer">{footer}</div>}
      </>
    );
  }

  return (
    <Overlay
      {...overlayProps}
      className={clsx(
        "m78 m78-drawer",
        `__${position}`,
        footer && "__footer",
        className
      )}
      alignment={positionMap[position!]}
      transitionType={`slide${upperFirst(position)}` as TransitionTypeUnion}
      content={renderContent}
      springProps={{
        config: props.springProps,
      }}
    />
  );
};

DrawerBase.defaultProps = defaultProps;

const api = createRenderApi<
  Omit<DrawerProps, OverlayApiOmitKeys>,
  OverlayInstance
>({
  component: DrawerBase,
  defaultState: {
    mountOnEnter: true,
    unmountOnExit: true,
  },
  omitState: (state) => omit(state, omitApiProps as any),
});

const _Drawer = Object.assign(DrawerBase, api);

export { _Drawer };
