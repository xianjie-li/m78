import { createInjector } from "../injector/index.js";
import { RCTableProps } from "./types.js";
import { _useLifeCycle } from "./use/life-cycle.js";
import { _useRender } from "./render/use-render.js";

const defaultProps = {
  dataImport: true,
  dataExport: true,
  softRemove: true,
} satisfies Partial<RCTableProps>;

export const _injector = createInjector<RCTableProps, typeof defaultProps>(
  () => {
    _useLifeCycle();

    return _useRender();
  },
  {
    displayName: "Table",
    defaultProps,
  }
);

export const _Table = _injector.Component;
