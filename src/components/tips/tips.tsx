import React, { useEffect } from 'react';
import { useFn, useSelf, useSetState } from '@lxjx/hooks';
import { animated, useTransition } from 'react-spring';
import Button from 'm78/button';
import { AnyObject, createRandString, isArray, isNumber } from '@lxjx/utils';
import { useUpdate } from 'react-use';
import { If, Switch } from 'm78/fork';
import cls from 'classnames';
import { useGesture } from 'react-use-gesture';
import { TipsItem, TipsProps, UseQueueConfig, UseQueueItem, UseQueueItemWithId } from './type';

function useQueue<Item extends AnyObject = {}>(
  { defaultItemOption, list = [] } = {} as UseQueueConfig<Item>,
) {
  /** 选项与用户扩展类型混合 */
  type MixItem = Item & UseQueueItemWithId;
  type MixItemWithoutId = Item & UseQueueItem;

  const self = useSelf({
    /** 消息队列 */
    list: [] as MixItem[],
    /** 历史记录 */
    oldList: [] as MixItem[],
    /** 开启下一条的计时器 */
    timer: null as any,
    /** 设置计时器的时间 */
    timerSetTime: null as number | null,
    /** 暂停的时间 */
    pauseTime: null as number | null,
  });

  const [state, setState] = useSetState({
    /** 当前显示消息 */
    current: null as MixItem | null,
    /** 是否暂停 */
    isPause: false,
  });

  const update = useUpdate();

  // 清理
  useEffect(() => clearTimer, []);

  /**
   * next()的实现版本，支持参数
   * */
  const nextIn = useFn((isPrev?: boolean) => {
    // if (state.isPause) return;

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

    // 未暂停且配置了持续时间, 定时切换到下一条
    if (isNumber(nextCurrent.duration) && !state.isPause) {
      self.timer = setTimeout(nextIn, nextCurrent.duration);
      self.timerSetTime = Date.now();
    }

    // 如果切换过，暂停时间就没意义了，将其清除
    self.pauseTime = null;
  });

  /**
   * 关闭当前项, 然后选中列表下一项
   * 如果配置了duration, 设置倒计时，计时结束后拉取下一项进行显示, 直到队列为空
   * */
  const next = useFn(() => nextIn() /* 过滤参数 */);

  /**
   * 显示上一项
   * */
  const prev = useFn(() => {
    // if (state.isPause) return;

    const lastOldInd = self.oldList.length - 1; // 最后一条是当前消息

    const old = self.oldList.splice(lastOldInd, 1);

    if (!old.length) return;

    // 当前消息和上一条消息重新放回队列

    state.current && self.list.unshift(state.current);

    self.list.unshift(...old);

    nextIn(true);
  });

  /**
   * 推入一个新项，如果当前没有选中项，自动执行next()
   * @param opt - 要添加的新项，可以是一个单独的项配置或配置数组
   * */
  const push = useFn((opt: MixItemWithoutId | MixItemWithoutId[]) => {
    if (isArray(opt)) {
      const ls = opt.map(item => ({ ...defaultItemOption, ...item, id: createRandString() }));
      self.list.push(...ls);
    } else {
      self.list.push({ ...defaultItemOption, ...opt, id: createRandString() });
    }

    state.current ? update() : next();
  });

  // 启动初始list
  useEffect(() => {
    if (list.length) {
      push(list);
    }
  }, []);

  /**
   * 清空列表和当前项
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
      isPause: false,
    });
  });

  /**
   * 暂停，停止所有计时，依然可以通过push/next/prev等切换项，如果要禁止切换，使用isPause帮助判断
   * */
  const pause = useFn(() => {
    if (state.isPause) return;

    setState({
      isPause: true,
    });

    clearTimeout(self.timer);

    self.pauseTime = Date.now();
  });

  /**
   * 暂停时，重新启用
   * */
  const start = useFn(() => {
    if (!state.isPause) return;

    const c = state.current;

    setState({
      isPause: false,
    });

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
   * 指定id是否包含下一项
   * */
  function hasNext(id: string) {
    const all = getAllList();
    const ind = findIndexById(id);
    return !!all[ind + 1];
  }

  /**
   * 指定id是否包含上一项
   * */
  function hasPrev(id: string) {
    const all = getAllList();
    const ind = findIndexById(id);
    return !!all[ind - 1];
  }

  /**
   * 指定id在列表中的索引
   * */
  function findIndexById(id: string) {
    const all = getAllList();
    return all.findIndex(item => item.id === id);
  }

  /**
   * 获取所有列表和当前项组成的数组, 历史和当前列表
   * */
  function getAllList() {
    const ls: MixItem[] = [];
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
    hasNext,
    hasPrev,
    clear,
    findIndexById,
    isPause: state.isPause,
    current: state.current,
    start,
    pause,
  };
}

const defaultOpt = {
  duration: 1600,
  type: 'card' as const,
};

function Tips({ controller: queue }: TipsProps) {
  const transition = useTransition<TipsItem & UseQueueItemWithId, any>(queue.current!, {
    key: queue.current?.id,
    from: { y: '-100%', x: '-50%', opacity: 0 },
    enter: { y: '0%', opacity: 1 },
    leave: { y: '-100%', opacity: 0 },
  });

  /** 暂停行为 */
  const bind = useGesture(
    {
      onHover({ hovering }) {
        hovering ? queue.pause() : queue.start();
      },
      onDrag({ down, first, last }) {
        if (first && down && !queue.isPause) {
          queue.pause();
        }

        if (last && queue.isPause) {
          queue.start();
        }
      },
    },
    {
      drag: {
        filterTaps: true,
      },
    },
  );

  return transition((style, item) => {
    if (!item) return null;

    return (
      <animated.div
        className={cls('m78-tips', `__${item.type}`, item.fitWidth && '__fitWidth')}
        style={{ width: item.width, ...style }}
        {...bind()}
      >
        <span className="m78-tips_content">{item.message}</span>
        <span className="m78-tips_action">
          {/* 非暂停状态才显示操作按钮 */}
          <If when={item.prevable && queue.hasPrev(item.id)}>
            <Button link size="small" color="red" onClick={queue.prev}>
              上一条
            </Button>
          </If>
          <If when={item.nextable}>
            {() => {
              const hasNext = queue.hasNext(item.id);
              return (
                <Button link size="small" color={hasNext ? 'primary' : 'red'} onClick={queue.next}>
                  {hasNext ? '下一条' : '关闭'}
                </Button>
              );
            }}
          </If>
          <Switch>
            <If when={item.actionsNode}>{item.actionsNode}</If>
            <If when={item.actions && item.actions.length}>
              {() =>
                item.actions?.map((it, ind) => (
                  <Button key={ind} link size="small" color={it.color} onClick={it.handler}>
                    {it.text}
                  </Button>
                ))
              }
            </If>
          </Switch>
        </span>
      </animated.div>
    );
  });
}

const useTipsController = (opt?: UseQueueConfig<UseQueueItem>) => {
  const { list, defaultItemOption } = opt || {};

  return useQueue<TipsItem>({
    list,
    defaultItemOption: {
      ...defaultOpt,
      ...defaultItemOption,
    },
  });
};

Tips.useTipsController = useTipsController;

export default Tips;
