import { createInjector } from "../injector/index.js";
import { RCTableProps } from "./types.js";
import { _useLifeCycleAct } from "./life-cycle.js";
import { _useEvent } from "./use-event.js";
import { _useRender } from "./render.js";

export const _injector = createInjector<RCTableProps>(
  () => {
    _useLifeCycleAct();

    _useEvent();

    return _useRender();
  },
  {
    displayName: "Table",
    defaultProps: {
      dataImport: true,
      dataExport: true,
    },
  }
);

export const _Table = _injector.Component;
