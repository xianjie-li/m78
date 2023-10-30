import { useMemo, useRef } from "react";
import { createEvent, useSelf, useSetState } from "@m78/hooks";
import { _RCTableSelf, _RCTableState } from "../types.js";
import { _injector } from "../table.js";
import { preInstantiationRCPlugin } from "../common.js";
import { _builtinPlugins } from "../plugins/index.js";
import { RCTablePlugin } from "../plugin.js";

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

  const self = useSelf<_RCTableSelf>({
    renderMap: {},
    editMap: {},
    editStatusMap: {},
    editCheckForm: null as any,
    overlayStackCount: 0,
  });

  const plugins = useMemo(
    () =>
      preInstantiationRCPlugin([..._builtinPlugins, ...(props.plugins || [])!]),
    []
  );

  // 所有RCTablePlugin实例
  const rcPlugins = useMemo(() => {
    return plugins.filter((p) => p instanceof RCTablePlugin) as RCTablePlugin[];
  }, []);

  const [state, setState] = useSetState<_RCTableState>({
    selectedRows: [],
    rowCount: 0,
    instance: null as any,
  });

  const scrollEvent = useMemo(() => createEvent(), []);

  // 同步getter到插件实例
  useMemo(() => {
    rcPlugins.forEach((p) => {
      p.getDeps = getters.getDeps;
      p.getProps = getters.getProps;
    });
  }, [getters]);

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
  };
}
