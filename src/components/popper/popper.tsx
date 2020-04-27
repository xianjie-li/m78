import Portal from '@lxjx/fr/lib/portal';
import React, { useEffect, useRef, useState } from 'react';
import { useFn, useSelf, useSetState } from '@lxjx/hooks';
import { useSpring, animated, interpolate, config } from 'react-spring';
import cls from 'classnames';
import { useUpdateEffect } from 'react-use';
import _throttle from 'lodash/throttle';
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
    lastPopperW: 0,
    lastPopperH: 0,
  });

  const [state, setState] = useSetState({
    direction: direction as GetBoundMetasDirectionKeys,
    show: true,
  });

  const showBase = state.show ? 1 : 0;

  const [spProps, set] = useSpring(() => ({
    xy: [0, 0],
    opacity: showBase,
    scale: showBase,
    config: config.stiff,
  }));

  useEffect(() => {
    if (state.show) {
      self.lastPopperW = popperEl.current.offsetWidth;
      self.lastPopperH = popperEl.current.offsetHeight;
    }
  });

  console.log(123);

  const refresh = useFn(
    () => {
      if (!popperEl.current || !targetEl.current) return;

      const { currentDirection, currentDirectionKey, visible } = getPopperMetas(
        // popperEl.current,
        { width: self.lastPopperW, height: self.lastPopperH },
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
          self.refreshCount = 0; // 防止初次入场/重入场时抖动
          return;
        }

        self.lastVisible = visible;
        self.lastX = currentDirection.x;
        self.lastY = currentDirection.y;

        set({
          xy: [currentDirection.x, currentDirection.y],
          opacity: visible && state.show ? 1 : 0,
          scale: showBase,
          immediate: self.refreshCount === 0,
        });

        self.refreshCount++;
      }
    },
    f => _throttle(f, 0),
  );

  /** 初始化定位、默认触发变更方式(wrap滚动触发) */
  useEffect(() => {
    refresh();
    wrapEl.current.addEventListener('scroll', refresh);
  }, []);

  /** show变更处理 */
  useUpdateEffect(() => {
    self.lastX = 0;
    self.lastY = 0;
    self.lastVisible = true;
    refresh();
    // set({
    //   opacity: showBase,
    // });
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
            style={{
              transform: interpolate(
                [spProps.xy, spProps.scale],
                ([x, y], sc) => `translate3d(${x}px, ${y}px, 0) scale3d(${sc}, ${sc}, ${sc})`,
              ),
              opacity: spProps.opacity.interpolate(o => o),
            }}
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
