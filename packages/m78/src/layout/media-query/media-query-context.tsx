import React, { useRef } from "react";
import { useFn } from "@m78/hooks";
import { _MediaQueryTypeContext } from "./types.js";
import { _mediaQueryCtx } from "./context.js";
import { _onChangeHandle } from "./common.js";
import _MediaQueryCalc from "./media-query-calc.js";

/**
 * 将其作为要监听容器的子节点, 能够提供一个独立的MediaQuery上下文，其内部的所有MediaQuery会在此上下文中单独管理, 用于要为窗口以外的节点监听断点时
 * - MediaQueryContext会在容器内挂载一个用于计算尺寸的节点, 你需要容器的position为static以外的值
 * */
export const _MediaQueryContext: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const value = useRef<_MediaQueryTypeContext>({
    onChange: () => {},
    changeListeners: [],
    meta: null,
  });

  value.current.onChange = useFn<_MediaQueryTypeContext["onChange"]>((size) =>
    _onChangeHandle(size, value.current)
  );

  return (
    <_mediaQueryCtx.Provider value={value.current}>
      {children}
      <_MediaQueryCalc />
    </_mediaQueryCtx.Provider>
  );
};

_MediaQueryContext.displayName = "MediaQueryContext";
