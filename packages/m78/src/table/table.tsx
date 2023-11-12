import { createInjector } from "../injector/index.js";
import { RCTableProps } from "./types.js";
import { _useLifeCycle } from "./use/life-cycle.js";
import { _useRender } from "./render/use-render.js";

export const _injector = createInjector<RCTableProps>(
  () => {
    _useLifeCycle();

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
