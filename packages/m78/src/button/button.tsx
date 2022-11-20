import React, { useMemo, useState } from "react";
import cls from "clsx";

import { Spin } from "../spin";
import { m78Config as config } from "../config";

import { FullSize } from "../common";
import { ButtonPropsWithHTMLButton, ButtonPropsWithHTMLLink } from "./types";
import { formatChildren } from "./utils";
import { useFn } from "@m78/hooks";
import { isPromiseLike } from "@m78/utils";

function Button(btnProps: ButtonPropsWithHTMLButton): JSX.Element;
function Button(btnProps: ButtonPropsWithHTMLLink): JSX.Element;
function Button(btnProps: ButtonPropsWithHTMLLink | ButtonPropsWithHTMLButton) {
  const {
    size,
    color,
    circle,
    outline,
    block,
    icon,
    disabled,
    loading: _loading,
    children,
    className,
    text,
    href,
    innerRef,
    ...props
  } = btnProps as ButtonPropsWithHTMLLink & ButtonPropsWithHTMLButton;

  const darkMode = config.useState((state) => state.darkMode);

  // 由内部控制的加载状态
  const [innerLoading, setInnerLoading] = useState(false);

  const loading = _loading || innerLoading;

  // 配置了color切是text/icon以外的按钮类型, 或是无color且darkMode下，直接使用亮色水波纹
  const isLightEffect = (!!color && !text && !icon) || (!color && darkMode);

  const classNames = cls(
    "m78 m78-init m78-btn",
    "m78-effect",
    "__md",
    {
      [`__${color}`]: color,
      [`__${size}`]: size,
      __circle: circle,
      __outline: outline,
      __block: block,
      __text: text,
      __icon: icon,
      __light: isLightEffect,
      __disabled: disabled || loading,
    },
    className
  );

  const newChildren = useMemo(() => formatChildren(children), [children]);

  const isLink = !!href;

  const onClick = useFn(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      // 如果用户点击事件返回了promise like, 自动设置loading状态
      const res = btnProps.onClick?.(e);

      if (isPromiseLike(res)) {
        setInnerLoading(true);
        res.finally(() => {
          setInnerLoading(false);
        });
      }
    }
  );

  return React.createElement(
    isLink ? "a" : "button",
    {
      type: isLink ? undefined : "button", // 禁用默认的html button submit类型
      href,
      ...props,
      className: classNames,
      disabled: !!disabled || !!loading,
      ref: innerRef,
      onClick,
    },
    <Spin open={!!loading} size={FullSize.small} full />,
    ...newChildren
  );
}

export { Button };
