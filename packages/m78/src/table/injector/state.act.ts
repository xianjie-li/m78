import { useMemo, useRef } from "react";
import { createEvent, useSelf, useSetState } from "@m78/hooks";
import {
  _RCTableSelf,
  _RCTableState,
  TableDataOperationsConfig,
} from "../types.js";
import { _injector } from "../table.js";
import { preInstantiationRCPlugin } from "../common.js";
import { RCTablePlugin } from "../plugin.js";
import { isBoolean } from "@m78/utils";
import { _FilterPlugin } from "../plugins/filter/filter.js";
import { _FeedBackPlugin } from "../plugins/feedback/feedback.js";
import { _RedoAndUndoPlugin } from "../plugins/redo-and-undo.js";
import { _CountTextPlugin } from "../plugins/count-text.js";
import { _XLSHandlePlugin } from "../plugins/xls-handle.js";
import { _DataActionPlugin } from "../plugins/data-actions.js";
import { _ConfigSyncPlugin } from "../plugins/config-sync.js";
import { _DragMovePlugin } from "../plugins/drag-move.js";
import { _ContextMenuPlugin } from "../plugins/context-menu/context-menu.js";

export function _useStateAct() {
  const props = _injector.useProps();
  const getters = _injector.useGetter();

  /** 实例容器 */
  const ref = useRef<HTMLDivElement>(null!);
  /** 滚动容器 */
  const scrollRef = useRef<HTMLDivElement>(null!);
  /** 滚动内容 */
  const scrollContRef = useRef<HTMLDivElement>(null!);
  /** 最外层包裹容器 */
  const wrapRef = useRef<HTMLDivElement>(null!);

  const plugins = useMemo(() => {
    return preInstantiationRCPlugin([
      _FilterPlugin,
      _FeedBackPlugin,
      _RedoAndUndoPlugin,
      _DragMovePlugin,
      _CountTextPlugin,
      _ConfigSyncPlugin,
      _XLSHandlePlugin,
      _DataActionPlugin,
      _ContextMenuPlugin,
      ...(props.plugins || [])!,
    ]);
  }, []);

  // 所有RCTablePlugin实例
  const rcPlugins = useMemo(() => {
    return plugins.filter((p) => p instanceof RCTablePlugin) as RCTablePlugin[];
  }, []);

  // 同步getter到插件实例
  useMemo(() => {
    rcPlugins.forEach((p) => {
      p.getDeps = getters.getDeps;
      p.getProps = getters.getProps;
    });
  }, [getters]);

  const self = useSelf<_RCTableSelf>(
    useMemo(() => {
      const _self: _RCTableSelf = {
        renderMap: {},
        editMap: {},
        editStatusMap: {},
        editCheckForm: null as any,
        overlayStackCount: 0,
        instance: null as any,
        vCtx: null as any,
      };

      rcPlugins.forEach((p) => p.rcSelfInitializer?.(_self));

      return _self;
    }, [])
  );

  const [state, setState] = useSetState<_RCTableState>(() => {
    const _state: _RCTableState = {
      selectedRows: [],
      rowCount: 0,
      instance: null as any,
      vCtx: null as any,
      initializing: true,
      initializingTip: null,
      blockError: null,
    };

    rcPlugins.forEach((p) => p.rcStateInitializer?.(_state));

    return _state;
  });

  const scrollEvent = useMemo(() => createEvent(), []);

  const dataOperations = useMemo(() => {
    const conf: TableDataOperationsConfig = {
      edit: false,
      add: false,
      delete: false,
      sortRow: false,
      sortColumn: true,
      import: false,
      export: true,
    };

    const pConf = props.dataOperations;

    if (isBoolean(pConf) && pConf) {
      Object.keys(conf).forEach((k) => ((conf as any)[k] = true));
      return conf;
    }

    if (isBoolean(pConf) && !pConf) {
      conf.sortColumn = false;
      conf.export = false;
      return conf;
    }

    if (!pConf) return conf;

    return Object.assign(conf, pConf);
  }, [props.dataOperations]);

  return {
    self,
    state,
    setState,
    ref,
    scrollRef,
    scrollContRef,
    wrapRef,
    scrollEvent,
    plugins,
    rcPlugins,
    dataOperations,
  };
}
