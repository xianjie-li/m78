import { createContext } from "react";
import { _onChangeHandle } from "./common.js";
export var _defaultContext = {
    onChange: function(size) {
        return _onChangeHandle(size, _defaultContext);
    },
    changeListeners: [],
    meta: null,
    isRoot: true
};
export var _mediaQueryCtx = createContext(_defaultContext);
