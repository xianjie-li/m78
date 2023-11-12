import { createInjector } from "../injector/index.js";
import { _useLifeCycle } from "./use/life-cycle.js";
import { _useRender } from "./render/use-render.js";
export var _injector = createInjector(function() {
    _useLifeCycle();
    return _useRender();
}, {
    displayName: "Table",
    defaultProps: {
        dataImport: true,
        dataExport: true
    }
});
export var _Table = _injector.Component;
