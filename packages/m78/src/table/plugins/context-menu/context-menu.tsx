import { _useContextMenuAct } from "./use-context-menu.act";
import { RCTablePlugin } from "../../plugin";
import { _injector } from "../../table";

export class _ContextMenuPlugin extends RCTablePlugin {
  rcRuntime() {
    _injector.useDeps(_useContextMenuAct);
  }

  rcExtraRender(): React.ReactNode {
    return this.getDeps(_useContextMenuAct).node;
  }
}
