import { _useContextMenuAct } from "./use-context-menu.act.js";
import { RCTablePlugin } from "../../plugin.js";
import { _injector } from "../../table.js";

export class _ContextMenuPlugin extends RCTablePlugin {
  rcRuntime() {
    _injector.useDeps(_useContextMenuAct);
  }

  rcExtraRender(): React.ReactNode {
    return this.getDeps(_useContextMenuAct).node;
  }
}
