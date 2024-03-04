import { RCTableInstance, RCTableProps } from "../types.js";
import { createTable, TableConfig, TableInstance } from "../../table-vanilla/index.js";
import { createEvent } from "@m78/hooks";
import { i18n, TABLE_NS } from "../../i18n/index.js";
import { _useStateAct } from "./state.act.js";
import { _useEditRender } from "../render/use-edit-render.js";
import { _useCustomRender } from "../render/use-custom-render.js";
import { _injector } from "../table.js";
import {
  createRandString,
  getNamePathValue,
  isBoolean,
  isFunction,
} from "@m78/utils";
import { createForm } from "../../form/index.js";
import { _privateCtxKey, _privateInstanceCallbackKey } from "../../table-vanilla/common.js";
import { TablePluginContext } from "../../table-vanilla/types/context.js";

export function _useMethodsAct() {
  const {
    ref,
    scrollRef,
    scrollContRef,
    wrapRef,
    state,
    setState,
    self,
    plugins,
  } = _injector.useDeps(_useStateAct);
  const props = _injector.useProps();

  const editRender = _useEditRender();

  const customRender = _useCustomRender();

  /** 创建/更新表格实例 */
  function updateInstance(propsConf: Partial<RCTableProps>, isFull: boolean) {
    console.log("reload", isFull ? "full" : "index");

    const curProps = state.instance ? propsConf : props;

    const dataOperations = props.dataOperations;

    // 映射一些名称有变更的配置
    const mapProps = {
      ...curProps,
      dragSortColumn: isBoolean(dataOperations)
        ? dataOperations
        : dataOperations?.sortColumn,
      dragSortRow: isBoolean(dataOperations)
        ? dataOperations
        : dataOperations?.sortColumn,
    } as TableConfig;

    if (state.instance) {
      state.instance.setConfig(mapProps as TableConfig, !isFull);
      setState({
        renderID: Math.random(),
      });
      return;
    }

    const texts = i18n.getResourceBundle(i18n.language, TABLE_NS);

    const instanceCBConf = {
      // 获取尚未完成渲染的table实例, 部分功能中会用到
      [_privateInstanceCallbackKey](noRenderedIns: RCTableInstance) {
        self.instance = noRenderedIns;
        self.vCtx = getNamePathValue(noRenderedIns, _privateCtxKey) as TablePluginContext
      }
    }

    const ins = createTable({
      ...(mapProps as any as TableConfig),
      ...instanceCBConf,
      el: ref.current,
      viewEl: scrollRef.current,
      viewContentEl: scrollContRef.current,
      emptyNode: state.emptyNode,
      emptySize: 180,
      eventCreator: createEvent,
      render: customRender.render,
      interactive: editRender.interactiveEnableChecker,
      interactiveRender: editRender.interactiveRender,
      texts,
      extraActiveCheckEl: wrapRef.current,
      formCreator: createForm,
      plugins,
      persistenceConfig: state.persistenceConfig,
    }) as any as RCTableInstance;

    setState({
      instance: ins,
      vCtx: getNamePathValue(ins, _privateCtxKey) as TablePluginContext,
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

  /** 获取新的新的默认数据 */
  function getDefaultNewData() {
    let def = props.defaultNewData;

    if (isFunction(def)) {
      def = def();
    }

    return {
      ...def,
      [props.primaryKey]: createRandString(),
    };
  }

  /** 记录每一个需要阻止默认键盘等操作行为的弹层启用/关闭, 在包含弹层时, 阻止table的交互 */
  function overlayStackChange(open: boolean) {
    if (open) {
      self.overlayStackCount++;
    } else {
      self.overlayStackCount--;

      if (self.overlayStackCount < 0) {
        self.overlayStackCount = 0;
      }
    }

    state.instance?.isActive(!self.overlayStackCount);
  }

  /** 更新editCheckForm, 应在schema变更时触发 */
  function updateCheckForm() {
    self.editStatusMap = {};

    const ls = props.schemas || [];

    if (self.editCheckForm) {
      self.editCheckForm.setSchemas({
        schemas: ls,
      });
      return;
    }

    self.editCheckForm = createForm({
      schemas: {
        schemas: ls,
      },
      autoVerify: false,
    });
  }

  return {
    initEmptyNode,
    updateInstance,
    updateCheckForm,
    getDefaultNewData,
    overlayStackChange,
  };
}

export type _Methods = ReturnType<typeof _useMethodsAct>;
