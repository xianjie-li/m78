import { useMemo, useRef } from 'react';
import { createEvent, useCheck, useFormState, useScroll, useSelf, useSetState } from '@lxjx/hooks';
import {
  _InnerSelf,
  _InnerState,
  TableColumnFixedEnum,
  TableProps,
  TableSortValue,
} from 'm78/table/types';
import useVirtualList from 'ahooks/es/useVirtualList';
import { Share } from 'm78/tree';
import { columnsBeforeFormat, syncTouchStatus, getSizeNumber } from './functions';
import { SizeEnum } from 'm78/types';

export function useStates(props: TableProps, treeState: Share['treeState']) {
  /** 滚动容器节点ref */
  const wrapElRef = useRef<HTMLDivElement>(null!);
  /** 表格节点ref */
  const tableElRef = useRef<HTMLTableElement>(null!);
  /** 表头节点ref */
  const theadElRef = useRef<HTMLTableSectionElement>(null!);

  const isVirtual = !!props.height;

  /** 状态 */
  const [state, setState] = useSetState<_InnerState>({
    touchLeft: true,
    touchRight: true,
    mounted: false,
  });

  /** 实例对象 */
  const self = useSelf<_InnerSelf>({});

  /** 控制表格expand的checker */
  const expandChecker = useCheck<string | number>({});

  /** 容器滚动控制 */
  const scroller = useScroll({
    el: wrapElRef,
    throttleTime: 0,
    onScroll: meta => {
      syncTouchStatus(state, setState, meta);
      // if (expandChecker.checked.length) {
      //   expandChecker.setChecked([]);
      // }
    },
  });

  /** 经过内部化处理的columns，应优先使用此变量代替传入的column */
  const fmtColumns = useMemo(() => columnsBeforeFormat(props), [props.columns]);

  // const fmtDataSource = useMemo(() => {}, [props.dataSource]);

  /** 排序 */
  const sortState = useFormState<TableSortValue | []>(props, [], {
    defaultValueKey: 'defaultSort',
    valueKey: 'sort',
    triggerKey: 'onSortChange',
  });

  // TableRender内部使用的通知事件
  const updateEvent = useMemo(
    () => createEvent<(type: TableColumnFixedEnum, width: number) => void>(),
    [],
  );

  // CellEffectBg状态改变事件
  const updateBgEvent = useMemo(
    () => createEvent<(rowIndex: number, isHover: boolean) => void>(),
    [],
  );

  // 虚拟列表
  const virtualList = useVirtualList(isVirtual ? treeState.showList : [], {
    overscan: 2,
    itemHeight: getSizeNumber(props.size as SizeEnum),
  });

  return {
    wrapElRef,
    tableElRef,
    theadElRef,
    state,
    setState,
    self,
    expandChecker,
    scroller,
    fmtColumns,
    sortState,
    virtualList,
    updateEvent,
    updateBgEvent,
    isVirtual,
  };
}
