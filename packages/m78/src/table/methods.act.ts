import { RCTableInstance, RCTableProps } from "./types.js";
import { createTable, TableConfig } from "../table-vanilla/index.js";
import { createEvent } from "@m78/hooks";
import { i18n, TABLE_NS } from "../i18n/index.js";
import { _useStateAct } from "./state.act.js";
import { _useEditRender } from "./use-edit-render.js";
import { _useCustomRender } from "./use-custom-render.js";
import { _injector } from "./table.js";

export function _useMethodsAct() {
  const { ref, scrollRef, scrollContRef, state, setState } =
    _injector.useDeps(_useStateAct);

  const editRender = _useEditRender();

  const customRender = _useCustomRender();

  /** 创建/更新表格实例 */
  function updateInstance(propsConf: Partial<RCTableProps>, isFull: boolean) {
    console.log("reload", isFull ? "full" : "index");

    if (state.instance) {
      state.instance.setConfig(propsConf as TableConfig, !isFull);
      setState({
        renderID: Math.random(),
      });
      return;
    }

    const texts = i18n.getResourceBundle(i18n.language, TABLE_NS);

    setState({
      instance: createTable({
        ...(propsConf as TableConfig),
        el: ref.current,
        viewEl: scrollRef.current,
        viewContentEl: scrollContRef.current,
        emptyNode: state.emptyNode,
        emptySize: 120,
        eventCreator: createEvent,
        render: customRender.render,
        interactive: editRender.interactiveEnableChecker,
        interactiveRender: editRender.interactiveRender,
        texts,
      }) as any as RCTableInstance,
    });
  }

  /** 初始化定制空节点 */
  function initEmptyNode() {
    const emptyNode = document.createElement("div");

    emptyNode.className = "m78-table_empty-wrap";

    setState({
      emptyNode,
    });
  }

  return {
    initEmptyNode,
    updateInstance,
  };
}

export type _Methods = ReturnType<typeof _useMethodsAct>;
