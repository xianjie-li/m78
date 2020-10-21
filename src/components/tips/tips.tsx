import React, { useEffect, useState } from 'react';
import { useSelf, useSetState, useFn } from '@lxjx/hooks';
import { useTransition, animated } from 'react-spring';
import { Divider } from 'm78/layout';
import Button from 'm78/button';
import { AnyObject, createRandString, isArray } from '@lxjx/utils';
import { useUpdate } from 'react-use';
import { TipsItem } from './type';

const defaultOptions = {
  duration: 1600,
  type: 'card' as const,
};

let count = 0;

interface UseQueueConfig {
  list?: UseQueueItem[];
  defaultItemOption?: any;
}

interface UseQueueItem {
  /** 如果传入，会在指定延迟ms后自动跳转到下一条 */
  duration?: number;
}

interface UseQueueItemWithId extends UseQueueItem {
  /** 唯一id，由组件内部生成 */
  id?: string;
}

function useQueue<Item extends AnyObject = {}>({ defaultItemOption, list }: UseQueueConfig) {
  const self = useSelf({
    /** 消息队列 */
    list: [] as TipsItem[],
    /** 历史记录 */
    oldList: [] as TipsItem[],
    /** 开启下一条的计时器 */
    timer: null as any,
  });

  const [state, setState] = useSetState({
    /** 当前显示消息 */
    current: null as TipsItem | null,
  });

  const update = useUpdate();

  // 清理
  useEffect(() => clearTimer, []);

  /**
   * 关闭当前消息, 然后从列表取出第一条消息显示
   * 设置倒计时，计时结束后拉取下一条消息进行显示, 直到队列为空
   * */
  const next = useFn(() => {
    clearTimer();

    const nextCurrent = self.list[0] || null;

    if (!nextCurrent) {
      setState({
        current: null,
      });
      return;
    }

    const del = self.list.splice(0, 1);

    self.oldList.push(...del);

    setState({
      current: nextCurrent,
    });

    self.timer = setTimeout(next, nextCurrent.duration);
  });

  const prev = useFn(() => {
    const lastOldInd = self.oldList.length - 2; // 最后一条是当前消息

    const old = self.oldList.splice(lastOldInd, 2);

    if (!old.length) return;

    // 当前消息和上一条消息重新放回队列
    self.list.unshift(...old);

    next();
  });

  /**
   * 推入一条消息, 如果当前没有消息，执行next()
   * */
  const push = useFn((opt: TipsItem | TipsItem[]) => {
    if (isArray(opt)) {
      const ls = opt.map(item => ({ ...defaultOptions, ...item, id: createRandString() }));
      self.list.push(...ls);
    } else {
      self.list.push({ ...defaultOptions, ...opt, id: createRandString() });
    }

    state.current ? update() : next();
  });

  const clear = useFn(() => {
    self.list = [];
    self.oldList = [];
    clearTimer();
    setState({
      current: null,
    });
  });

  function clearTimer() {
    self.timer && clearTimeout(self.timer);
  }

  function hasNext(id: string) {
    const all = [...self.oldList, ...self.list];
    const ind = findIndexById(id);
    return !!all[ind + 1];
  }

  function hasPrev(id: string) {
    const all = [...self.oldList, ...self.list];
    const ind = findIndexById(id);
    return !!all[ind - 1];
  }

  function findIndexById(id: string) {
    const all = [...self.oldList, ...self.list];
    return all.findIndex(item => item.id === id);
  }

  return [
    state.current,
    {
      push,
      prev,
      next,
      hasNext,
      hasPrev,
      clear,
      findIndexById,
    },
  ] as const;
}

function Tips() {
  const [current, queue] = useQueue({});

  const transition = useTransition<TipsItem, any>(current!, {
    key: current?.id,
    from: { y: '-100%', x: '-50%', opacity: 0 },
    enter: { y: '0%', opacity: 1 },
    leave: { y: '-100%', opacity: 0 },
  });

  const fragment = transition((style, item) => {
    if (!item) return null;

    return (
      <animated.div className="m78-tips __card" style={style}>
        <span className="m78-tips_content">{item.message}</span>
        <span className="m78-tips_action">
          {item.prevable && queue.hasPrev(item.id!) && (
            <Button link size="small" color="red" onClick={queue.prev}>
              上一条
            </Button>
          )}
          {item.closeable && (
            <Button link size="small" color="red" onClick={queue.next}>
              {queue.hasNext(item.id!) ? '下一条' : '关闭'}
            </Button>
          )}
        </span>
      </animated.div>
    );
  });

  function addOne() {
    queue.push([
      {
        message: `这是第${++count}条消息`,
        closeable: true,
        duration: 3000,
      },
      {
        message: `这是第${++count}条消息`,
        closeable: true,
        duration: 3000,
      },
      {
        message: `这是第${++count}条消息`,
        closeable: true,
        duration: 3000,
      },
    ]);
  }

  return (
    <div>
      <div>{fragment}</div>

      <Divider margin={100} />

      <div>
        <button onClick={addOne}>addOne</button>
        <button onClick={queue.prev}>prev</button>
        <button onClick={queue.next}>next</button>
        <button onClick={queue.clear}>clear</button>
      </div>
    </div>
  );
}

export default Tips;
