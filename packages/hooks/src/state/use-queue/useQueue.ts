import { AnyObject, createRandString, isArray, isNumber } from "@m78/utils";
import { useFn, useSelf, useSetState, useUpdate } from "../../";
import _differenceBy from "lodash/differenceBy";
import { useEffect } from "react";

type IDType = string | number;

interface UseQueueConfig<ItemOption> {
  /** 初始列表 */
  list?: (ItemOption & UseQueueItem)[];
  /** 默认项配置 */
  defaultItemOption?: Partial<ItemOption & UseQueueItem>;
  /** 是否默认为手动模式 */
  defaultManual?: boolean;
  /** 每次current变更时触发 */
  onChange?: (current?: ItemOption & UseQueueItem) => void;
}

interface UseQueueItem {
  /** 自动模式时，如果传入此项，会在此延迟(ms)后自动切换到下一项 */
  duration?: number;
  /** 唯一id，如果未传入会由内部自动生成一个随机id */
  id?: IDType;
}

interface UseQueueItemWidthId extends UseQueueItem {
  id: IDType;
}

/*
 * old[] <->  current  <-> list[]
 * */

function useQueue<Item extends AnyObject = {}>(
  {
    defaultItemOption,
    list = [],
    defaultManual = false,
    onChange,
  } = {} as UseQueueConfig<Item>
) {
  /** 选项与用户扩展类型混合 */
  type MixItem = Item & UseQueueItem;
  type MixItemWithId = Item & UseQueueItemWidthId;

  const self = useSelf({
    /** 消息队列 */
    list: [] as MixItemWithId[],
    /** 历史记录 */
    oldList: [] as MixItemWithId[],
    /** 开启下一条的计时器 */
    timer: null as any,
    /** 设置计时器的时间 */
    timerSetTime: null as number | null,
    /** 暂停的时间 */
    pauseTime: null as number | null,
  });

  const [state, setState] = useSetState({
    /** 当前显示消息 */
    current: null as MixItemWithId | null,
    /** 是否暂停 */
    manual: defaultManual,
  });

  const update = useUpdate();

  // 清理
  useEffect(() => clearTimer, []);

  /**
   * next()的实现版本，支持参数
   * */
  const nextIn = useFn((isPrev?: boolean) => {
    clearTimer();

    const nextCurrent = self.list[0] || null;

    // 将当前项添加到历史
    if (!isPrev && state.current) {
      self.oldList.push(state.current);
    }

    if (!nextCurrent) {
      setState({
        current: null,
      });
      return;
    }

    // 移除新项
    self.list.splice(0, 1);

    // self.oldList.push(...del);

    setState({
      current: nextCurrent,
    });

    onChange?.(nextCurrent);

    // 未暂停且配置了持续时间, 定时切换到下一条
    if (isNumber(nextCurrent.duration) && !state.manual) {
      self.timer = setTimeout(nextIn, nextCurrent.duration);
      self.timerSetTime = Date.now();
    }

    // 如果切换过，暂停时间就没意义了，将其清除
    self.pauseTime = null;
  });

  /**
   * 切换到下一项
   * */
  const next = useFn(() => nextIn() /* 过滤参数 */);

  /**
   * 切换到上一项
   * */
  const prev = useFn(() => {
    const lastOldInd = self.oldList.length - 1; // 最后一条是当前消息

    const old = self.oldList.splice(lastOldInd, 1);

    if (!old.length) return;

    // 当前消息和上一条消息重新放回队列

    state.current && self.list.unshift(state.current);

    self.list.unshift(...old);

    nextIn(true);
  });

  /**
   * 推入一个或一组新项，如果当前没有选中项且非手动模式，自动执行next()
   * @param opt - 要添加的新项，可以是一个单独的项配置或配置数组
   * */
  const push = useFn((opt: MixItem | MixItem[]) => {
    if (isArray(opt)) {
      const ls = opt.map((item) => ({
        ...defaultItemOption,
        id: createRandString(),
        ...item,
      }));
      self.list.push(...ls);
    } else {
      self.list.push({ ...defaultItemOption, id: createRandString(), ...opt });
    }

    if (state.current || state.manual) update();
    else next();
  });

  /**
   * 跳转到指定id项，该项左侧所有项会被移到历史列表，右侧所有项会移到待执行列表
   * */
  const jump = useFn((id: IDType) => {
    clearTimer();

    const all = getAllList();

    const cInd = findIndexById(id);

    const leftList = all.slice(0, cInd);

    const rightList = all.slice(cInd);

    self.oldList = leftList;
    self.list = rightList;
    setState({
      current: null,
    });

    nextIn();
  });

  /** 完全移除指定id或一组id的项, 如果你要关闭当前消息，应当使用next而不是remove，因为此方法会破坏队列的完整性 */
  const remove = useFn((id: IDType | IDType[]) => {
    const ids = isArray(id) ? id : [id];

    if (!ids.length) return;

    const diffList = (ls: MixItemWithId[]) =>
      _differenceBy(
        ls,
        ids.map((item) => ({ id: item })),
        (item) => item.id
      );

    self.oldList = diffList(self.oldList);

    self.list = diffList(self.list);

    if (state.current && ids.includes(state.current.id)) {
      setState({
        current: null,
      });
    } else {
      update();
    }
  });

  // 启动初始list
  useEffect(() => {
    if (list.length) {
      push(list); // +执行next()
    }
  }, []);

  /**
   * 清空队列
   * */
  const clear = useFn(() => {
    self.list = [];
    self.oldList = [];
    self.timer = null;
    self.timerSetTime = null;
    self.pauseTime = null;
    clearTimer();
    setState({
      current: null,
      manual: false,
    });
  });

  /**
   * 从自动模式切换为启用手动模式，暂停所有计时器
   * */
  const manual = useFn(() => {
    if (state.manual) return;

    setState({
      manual: true,
    });

    clearTimeout(self.timer);

    self.pauseTime = Date.now();
  });

  /**
   * 从手动模式切换为自动模式, 如果包含暂停的计时器，会从暂停位置重新开始
   * */
  const auto = useFn(() => {
    if (!state.manual) return;

    setState({
      manual: false,
    });

    const c = state.current;

    // 如果当前有选中项，且包含计时器, 根据打断时间重新设置计时器
    if (c) {
      clearTimeout(self.timer);

      // 包含必要参数，还原暂停时间
      if (self.pauseTime && self.timerSetTime) {
        const spend = self.pauseTime - self.timerSetTime;

        if (isNumber(c.duration) && isNumber(spend)) {
          self.timer = setTimeout(next, c.duration - spend);
        }

        // 使用默认时间
      } else if (isNumber(c.duration)) {
        self.timer = setTimeout(next, c.duration);
      }
    } else {
      // 没有消息时重新启用队列
      next();
    }

    self.pauseTime = null;
  });

  /**
   * 指定id是否包含下一项, 不传id查当前项
   * */
  function hasNext(id?: IDType) {
    if (!id && !state.current) {
      return !!self.list.length;
    }

    const _id = id || state.current?.id;

    if (!_id) return false;

    const all = getAllList();
    const ind = findIndexById(_id!);
    return !!all[ind + 1];
  }

  /**
   * 指定id是否包含上一项, 不传id查当前项
   * */
  function hasPrev(id?: IDType) {
    let _id = id;

    if (!_id && !state.current) return false;

    if (!_id) {
      _id = state.current?.id;
    }

    const all = getAllList();
    const ind = findIndexById(_id!);
    return !!all[ind - 1];
  }

  /**
   * 查询指定id在列表中的索引
   * */
  function findIndexById(id: IDType) {
    const all = getAllList();
    return all.findIndex((item) => item.id === id);
  }

  /**
   * 获取所有列表和当前项组成的数组, 历史和当前列表
   * */
  function getAllList() {
    const ls: MixItemWithId[] = [];
    ls.push(...self.oldList);

    if (state.current) {
      ls.push(state.current);
    }

    ls.push(...self.list);

    return ls;
  }

  function clearTimer() {
    if (self.timer) {
      clearTimeout(self.timer);
      self.timerSetTime = null;
    }
  }

  return {
    push,
    prev,
    next,
    jump,
    hasNext,
    hasPrev,
    clear,
    findIndexById,
    isManual: state.manual,
    current: state.current,
    auto,
    manual,
    list: getAllList(),
    leftList: self.oldList,
    rightList: self.list,
    index: state.current ? findIndexById(state.current.id) : null,
    remove,
  };
}

export { useQueue, UseQueueConfig, UseQueueItem };
