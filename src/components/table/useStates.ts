import { useEffect, useMemo, useRef } from 'react';
import { useCheck, useFormState, useScroll, useSelf, useSetState } from '@lxjx/hooks';
import { _InnerSelf, _InnerState, TableProps, TableSortValue } from 'm78/table/types';
import { columnsBeforeFormat, syncTouchStatus } from './functions';

export function useStates(props: TableProps) {
  /** 滚动容器节点ref */
  const wrapElRef = useRef<HTMLDivElement>(null!);
  /** 表格节点ref */
  const tableElRef = useRef<HTMLTableElement>(null!);
  /** 表头节点ref */
  const theadElRef = useRef<HTMLTableSectionElement>(null!);
  /** 表格体首行tr节点的ref */
  const firstTBodyRowRef = useRef<HTMLTableRowElement>(null!);

  /** 状态 */
  const [state, setState] = useSetState<_InnerState>({
    touchLeft: true,
    touchRight: true,
    mounted: false,
  });

  /** 实例对象 */
  const self = useSelf<_InnerSelf>({
    fixedSizeMap: {},
  });

  /** 容器滚动控制 */
  const scroller = useScroll({
    el: wrapElRef,
    onScroll: meta => syncTouchStatus(state, setState, meta),
  });

  /** 控制表格expand的checker */
  const expandChecker = useCheck<string>({});

  /** 经过内部化处理的columns，应优先使用此变量代替传入的column */
  const fmtColumns = useMemo(() => columnsBeforeFormat(props), [props.columns]);

  const sortState = useFormState<TableSortValue | []>(props, [], {
    defaultValueKey: 'defaultSort',
    valueKey: 'sort',
    triggerKey: 'onSortChange',
  });

  // 每次render前还原fixedSizeMap
  self.fixedSizeMap = {};

  return {
    wrapElRef,
    tableElRef,
    theadElRef,
    firstTBodyRowRef,
    state,
    setState,
    self,
    expandChecker,
    scroller,
    fmtColumns,
    sortState,
  };
}
