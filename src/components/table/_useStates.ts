import { useMemo, useRef } from 'react';
import { createEvent, useFormState, useScroll, useSelf, useSetState } from '@lxjx/hooks';
import { _InnerSelf, _InnerState, TableProps, TableSortValue } from './_types';
import { columnsBeforeFormat, syncTouchStatus } from './_functions';

export function _useStates(props: TableProps) {
  /** 滚动容器节点ref */
  const wrapElRef = useRef<HTMLDivElement>(null!);
  /** 表格节点ref */
  const tableElRef = useRef<HTMLTableElement>(null!);

  /** 状态 */
  const [state, setState] = useSetState<_InnerState>({
    touchLeft: true,
    touchRight: true,
    mounted: false,
  });

  /** 实例对象 */
  const self = useSelf<_InnerSelf>({});

  /** 容器滚动控制 */
  const scroller = useScroll({
    el: wrapElRef,
    throttleTime: 0,
    onScroll: meta => syncTouchStatus(state, setState, meta),
  });

  /** 经过内部化处理的columns，应优先使用此变量代替传入的column */
  const fmtColumns = useMemo(() => columnsBeforeFormat(props), [props.columns]);

  /** 排序 */
  const sortState = useFormState<TableSortValue | []>(props, [], {
    defaultValueKey: 'defaultSort',
    valueKey: 'sort',
    triggerKey: 'onSortChange',
  });

  // CellEffectBg状态改变事件
  const updateBgEvent = useMemo(
    () => createEvent<(rowIndex: number, isHover: boolean) => void>(),
    [],
  );

  return {
    wrapElRef,
    tableElRef,
    state,
    setState,
    self,
    scroller,
    fmtColumns,
    sortState,
    updateBgEvent,
  };
}
