import { useMemo, useRef } from "react";
import { createEvent, useSelf, useSetState } from "@m78/hooks";
import { _RCTableSelf, _RCTableState } from "./types.js";
import { _useFilterForm } from "./filter/use-filter-form.js";
import { _injector } from "./table.js";

export function _useStateAct() {
  const props = _injector.useProps();

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

  const [state, setState] = useSetState<_RCTableState>({
    selectedRows: [],
    rowCount: 0,
    instance: null as any,
  });

  const filterForm = _useFilterForm(props);

  const scrollEvent = useMemo(() => createEvent(), []);

  return {
    self,
    state,
    setState,
    ref,
    scrollRef,
    scrollContRef,
    wrapRef,
    filterForm,
    scrollEvent,
  };
}
