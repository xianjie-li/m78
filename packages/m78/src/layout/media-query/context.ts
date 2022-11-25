import { createContext } from "react";
import { _MediaQueryTypeContext } from "./types";
import { _onChangeHandle } from "./common";

export const _defaultContext: _MediaQueryTypeContext = {
  onChange: (size) => _onChangeHandle(size, _defaultContext),
  changeListeners: [],
  meta: null,
  isRoot: true,
};

export const _mediaQueryCtx =
  createContext<_MediaQueryTypeContext>(_defaultContext);
