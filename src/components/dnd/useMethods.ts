import { useFn } from '@lxjx/hooks';
import { Handler } from 'react-use-gesture/dist/types';
import { useEffect } from 'react';
import { ChangeHandle, Share } from './types';

import { edgeRatio, initStatus } from './consts';

export function useMethods(share: Share) {
  const { elRef, status, setStatus, self, id, ctx, props } = share;

  // 拖动中持续触发，通知和更新其他关联的DND组件
  const changeHandle: ChangeHandle = useFn((x, y, down) => {
    if (!down) {
      setStatus(initStatus);
      return;
    }

    const { left, top, right, bottom } = elRef.current.getBoundingClientRect();

    const width = right - left;
    const height = bottom - top;

    const triggerXOffset = width * edgeRatio;
    const triggerYOffset = height * edgeRatio;

    const dragOver = x > left && x < right && y > top && y < bottom;
    const dragTop = dragOver && y < top + triggerYOffset;
    const dragBottom = dragOver && !dragTop && y > bottom - triggerYOffset;
    const dragRight = dragOver && !dragTop && !dragBottom && x > right - triggerXOffset;
    const dragLeft = dragOver && !dragTop && !dragBottom && x < left + triggerXOffset;
    const dragCenter = dragOver && !dragTop && !dragBottom && !dragRight && !dragLeft;

    if (
      status.dragOver === dragOver &&
      status.dragTop === dragTop &&
      status.dragBottom === dragBottom &&
      status.dragLeft === dragLeft &&
      status.dragRight === dragRight &&
      status.dragCenter === dragCenter
    ) {
      return;
    }

    setStatus({
      dragOver,
      dragTop,
      dragBottom,
      dragLeft,
      dragRight,
      dragCenter,
    });
  });

  useEffect(() => {
    ctx.listeners.push({
      id,
      handler: changeHandle,
    });
  }, [changeHandle]);

  const dragHandle: Handler<'drag'> = useFn(
    ({ movement: [moveX, moveY], xy: [x, y], down, first, tap, event }) => {
      if (tap) return;

      event?.preventDefault();

      if (first) {
        clearCloneNode();
        startHandle();
      }

      ctx.listeners.forEach(cItem => {
        if (cItem.id !== id) cItem.handler(x, y, down);
      });

      if (!down) {
        endHandle();
        return;
      }

      self.cloneNode.style.transform = `translate(${moveX}px, ${moveY}px)`;

      // console.log(cloneNode.current.getBoundingClientRect());
    },
  );

  /** 开始拖动 */
  function startHandle() {
    props.onDrag?.();

    clearTimeout(self.clearCloneTimer);

    setStatus({
      dragging: true,
    });

    self.cloneNode = elRef.current.cloneNode(true) as HTMLElement;

    const { x, y } = elRef.current.getBoundingClientRect();

    self.cloneNode.style.position = 'fixed';
    self.cloneNode.style.left = `${x}px`;
    self.cloneNode.style.top = `${y}px`;
    self.cloneNode.style.opacity = '0.7';
    self.cloneNode.style.pointerEvents = 'none';
    self.cloneNode.style.zIndex = '10000';

    document.body.appendChild(self.cloneNode);
  }

  /** 结束拖动 */
  function endHandle() {
    setStatus(initStatus);

    if (self.cloneNode) {
      self.cloneNode.style.transition = `0.1s`;
      self.cloneNode.style.transform = `translate(0, 0)`;
    }

    self.clearCloneTimer = setTimeout(clearCloneNode, 400);
  }

  /** 清理克隆节点 */
  function clearCloneNode() {
    if (self.cloneNode) {
      const parentNode = self.cloneNode.parentNode;
      parentNode && parentNode.removeChild(self.cloneNode);
    }
  }

  return {
    changeHandle,
    dragHandle,
  };
}
