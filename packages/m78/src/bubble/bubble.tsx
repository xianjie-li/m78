import React, { isValidElement, useMemo } from "react";
import {
  Overlay,
  OverlayCustomMeta,
  OverlayDirection,
  OverlayProps,
} from "../overlay/index.js";
import { Size, statusIconMap, Z_INDEX_MESSAGE } from "../common/index.js";
import clsx from "clsx";
import { Button, ButtonColor } from "../button/index.js";
import { Row } from "../layout/index.js";
import { isBoolean, isFunction, omit } from "@m78/utils";
import { BubbleProps, BubbleType, omitBubbleOverlayProps } from "./types.js";
import { COMMON_NS, Translation } from "../i18n/index.js";
import { TriggerType } from "@m78/trigger";

const defaultProps: Partial<BubbleProps> = {
  type: BubbleType.tooltip,
  childrenAsTarget: true,
  zIndex: Z_INDEX_MESSAGE,
  namespace: "BUBBLE",
  lockScroll: false,
  direction: OverlayDirection.top,
  arrow: true,
  autoFocus: false,
};

const _Bubble = (p: BubbleProps) => {
  const props = {
    ...defaultProps,
    ...p,
  };

  const {
    title,
    type,
    onConfirm,
    cancelText,
    confirmText,
    icon,
    status,
    ...other
  } = props;

  const overlayProps: OverlayProps = useMemo(() => {
    return omit(other, omitBubbleOverlayProps as any);
  }, [props]);

  // 在不同类型下使用不同的mountOnEnter/unmountOnExit默认值
  const [mount, unmount] = useMemo(() => {
    let m = true;
    let unm = false;

    // 提示和确认框使用时渲染, 不用时卸载
    if (type === BubbleType.tooltip || type === BubbleType.confirm) {
      m = true;
      unm = true;
    }

    // 若用户明确传入则使用传入配置
    if (isBoolean(props.mountOnEnter)) m = props.mountOnEnter;
    if (isBoolean(props.unmountOnExit)) unm = props.unmountOnExit;

    return [m, unm];
  }, [type, props.mountOnEnter, props.unmountOnExit]);

  // 在不同类型下使用不同的triggerType默认值
  const triggerType = useMemo(() => {
    let t: OverlayProps["triggerType"] =
      type === BubbleType.tooltip ? TriggerType.active : TriggerType.click;

    if (props.triggerType !== undefined) t = props.triggerType;

    return t;
  }, [type, props.triggerType]);

  function render(meta: OverlayCustomMeta) {
    const StatusIcon = statusIconMap[status!] || icon;

    const cont = isFunction(props.content)
      ? props.content(meta)
      : props.content;

    if (type === BubbleType.tooltip)
      return (
        <>
          {StatusIcon && (
            <span className="mr-4 vm">
              {isValidElement(StatusIcon) ? StatusIcon : <StatusIcon />}
            </span>
          )}
          <span className="vm">{cont}</span>
        </>
      );

    if (type === BubbleType.confirm) {
      return (
        <div>
          <Row crossAlign="start">
            {StatusIcon && (
              <span className="mr-8 fs-20">
                {isValidElement(StatusIcon) ? StatusIcon : <StatusIcon />}
              </span>
            )}
            {cont}
          </Row>
          <Row className="m78-bubble_confirm-btn" mainAlign="end">
            <Button size={Size.small} onClick={() => meta.setOpen(false)}>
              {cancelText || (
                <Translation ns={[COMMON_NS]}>{(t) => t("cancel")}</Translation>
              )}
            </Button>
            <Button
              size={Size.small}
              color={ButtonColor.primary}
              onClick={() => {
                onConfirm?.();
                meta.setOpen(false);
              }}
            >
              {confirmText || (
                <Translation ns={[COMMON_NS]}>
                  {(t) => t("confirm")}
                </Translation>
              )}
            </Button>
          </Row>
        </div>
      );
    }

    return (
      <>
        {title && (
          <div className="m78-bubble_title">
            {StatusIcon && (
              <span className="mr-4 fs-md">
                {isValidElement(StatusIcon) ? StatusIcon : <StatusIcon />}
              </span>
            )}
            {title}
          </div>
        )}
        <div className="m78-bubble_cont">{cont}</div>
      </>
    );
  }

  return (
    <Overlay
      {...overlayProps}
      triggerType={triggerType}
      className={clsx("m78-init m78-bubble", `__${type}`, props.className)}
      content={render}
      mountOnEnter={mount}
      unmountOnExit={unmount}
    />
  );
};

_Bubble.displayName = "Bubble";

export { _Bubble };
