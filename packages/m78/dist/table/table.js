import { createInjector } from "../injector/index.js";
import { _useLifeCycleAct } from "./life-cycle.js";
import { _useEvent } from "./use-event.js";
import { _useRender } from "./render.js";
export var _injector = createInjector(function() {
    _useLifeCycleAct();
    _useEvent();
    return _useRender();
}, {
    displayName: "Table",
    defaultProps: {
        dataImport: true,
        dataExport: true
    }
});
export var _Table = _injector.Component;
