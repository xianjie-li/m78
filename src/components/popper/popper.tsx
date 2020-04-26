import Portal from '@lxjx/fr/lib/portal';
import React, { useEffect, useRef, useState } from 'react';
import { useFn, useSelf, useSetState } from '@lxjx/hooks';
import { useSpring, animated, config } from 'react-spring';
import cls from 'classnames';
import { GetBoundMetasDirectionKeys, getPopperMetas } from './getPopperMetas';

interface PopperProps {
  /** 直接指定目标元素 */
  targetEl?: HTMLElement;
  /** 气泡方向 */
  direction?: GetBoundMetasDirectionKeys;
  children?: React.ReactElement;
}

const Popper: React.FC<PopperProps> = ({ children, direction = 'top' }) => {
  const popperEl = useRef<HTMLDivElement>(null!);
  const targetEl = useRef<any>(null!);
  const wrapEl = useRef<any>(null!);

  const self = useSelf({
    // 用于跳过初次动画
    refreshCount: 0,
    lastX: (undefined as unknown) as number,
    lastY: (undefined as unknown) as number,
    lastVisible: true,
  });

  const [state, setState] = useSetState({
    direction: direction as GetBoundMetasDirectionKeys,
    show: true,
  });

  const showBase = state.show ? 1 : 0;

  const [spProps, set] = useSpring(() => ({
    left: 0,
    top: 0,
    opacity: showBase,
    transform: `scale3d(${showBase}, ${showBase}, ${showBase})`,
    config: config.stiff,
  }));

  const refresh = useFn(() => {
    if (!popperEl.current || !targetEl.current) return;

    const { currentDirection, currentDirectionKey, visible } = getPopperMetas(
      popperEl.current,
      targetEl.current,
      {
        offset: 12,
        wrap: wrapEl.current,
        direction,
        prevDirection: state.direction,
      },
    );

    if (currentDirection && currentDirectionKey) {
      // 方向与上次不同时同步
      if (currentDirectionKey !== state.direction) {
        setState({
          direction: currentDirectionKey,
        });
      }

      // 前一次位置与后一次完全相等时跳过
      if (self.lastX === currentDirection.x && self.lastY === currentDirection.y) {
        return;
      }

      // 前后visible状态均为false时跳过
      if (!self.lastVisible && !visible) {
        self.refreshCount = 0; // 防止初次入场时抖动
        return;
      }

      self.lastVisible = visible;
      self.lastX = currentDirection.x;
      self.lastY = currentDirection.y;

      set({
        left: currentDirection.x,
        top: currentDirection.y,
        opacity: visible ? 1 : 0,
        immediate: self.refreshCount === 0,
      });

      self.refreshCount++;
    }
  });

  useEffect(() => {
    refresh();
    wrapEl.current.addEventListener('scroll', refresh);
  }, []);

  useEffect(() => {
    set({
      opacity: showBase,
      transform: `scale3d(${showBase}, ${showBase}, ${showBase})`,
    });
  }, [state.show]);

  return (
    <div className="wrap" ref={wrapEl} onClick={() => setState({ show: !state.show })}>
      <div className="inner">
        <span style={{ margin: 700, display: 'inline-block' }} ref={targetEl}>
          {children}
        </span>
        {/* {children && React.cloneElement(children, { onClick: clickHandle })} */}
        <Portal namespace="popper">
          <animated.div
            ref={popperEl}
            style={spProps}
            className={cls('fr-popper', state.direction && `__${state.direction}`)}
          >
            <span className={cls('fr-popper_arrow', state.direction && `__${state.direction}`)} />
            <div className="fr-popper_content">提示一段提示</div>
          </animated.div>
        </Portal>
      </div>
    </div>
  );
};

export default Popper;
