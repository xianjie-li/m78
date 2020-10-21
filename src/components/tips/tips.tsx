import React, { useEffect, useState } from 'react';
import { useSelf, useSetState, useFn } from '@lxjx/hooks';
import { useTransition, animated } from 'react-spring';
import { Divider } from 'm78/layout';
import Button from 'm78/button';
import { createRandString } from '@lxjx/utils';
import { TipsItem } from './type';

const defaultOptions = {
  duration: 1600,
  type: 'card' as const,
};

let count = 0;

function Tips() {
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

  const transition = useTransition<TipsItem, any>(state.current!, {
    key: state.current?.id,
    from: { y: '-100%', x: '-50%', opacity: 0 },
    enter: { y: '0%', opacity: 1 },
    leave: { y: '-100%', opacity: 0 },
  });

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

    const mergeOpt = {
      ...defaultOptions,
      ...nextCurrent,
    };

    setState({
      current: mergeOpt,
    });

    self.timer = setTimeout(next, mergeOpt.duration);
  });

  const prev = useFn(() => {
    console.log(self);

    return;

    const lastOldInd = self.oldList.length - 1;

    const old = self.oldList.splice(lastOldInd, 1);

    console.log(old);

    if (!old.length) return;

    // 当前消息重新返回队列, 历史中最后一条放到第一条
    state.current && self.list.unshift(state.current);
    self.list.unshift(old[0]);

    next();
  });

  /**
   * 推入一条消息, 如果当前没有消息，执行next()
   * */
  const push = useFn((opt: TipsItem) => {
    self.list.push({ ...opt, id: createRandString() });

    if (!state.current) next();
  });

  const clear = useFn(() => {
    self.list = [];
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

  const fragment = transition((style, item) => {
    if (!item) return null;

    return (
      <animated.div className="m78-tips __card" style={style}>
        <span className="m78-tips_content">{item.message}</span>
        <span className="m78-tips_action">
          {item.closeable && hasPrev(item.id!) && (
            <Button link size="small" color="red" onClick={prev}>
              上一条
            </Button>
          )}
          {item.closeable && (
            <Button link size="small" color="red" onClick={next}>
              {hasNext(item.id!) ? '下一条' : '关闭'}
            </Button>
          )}
        </span>
      </animated.div>
    );
  });

  function addOne() {
    push({
      message: `这是第${++count}条消息`,
      closeable: true,
    });
  }

  return (
    <div>
      <div>{fragment}</div>

      <Divider margin={100} />

      <div>
        <button onClick={addOne}>addOne</button>
        <button onClick={next}>next</button>
        <button onClick={clear}>clear</button>
      </div>
    </div>
  );
}

export default Tips;
