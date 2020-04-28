import Portal from '@lxjx/fr/lib/portal';
import React, { useEffect, useRef, useState } from 'react';
import { useFn, useSelf, useSetState } from '@lxjx/hooks';
import { useSpring, animated, interpolate, config } from 'react-spring';
import cls from 'classnames';
import { useUpdateEffect } from 'react-use';
import _throttle from 'lodash/throttle';
import { isDom, isNumber } from '@lxjx/utils';
import { GetBoundMetasDirectionKeys, getPopperMetas } from './getPopperMetas';

interface PopperProps {
  /** 直接指定目标元素 */
  targetEl?: HTMLElement;
  /** 气泡方向 */
  direction?: GetBoundMetasDirectionKeys;
  /** 可选的子元素 */
  children?: React.ReactElement;
  /** 包裹元素，作为气泡边界的标识，并会在滚动时对气泡进行更新, 默认情况下，边界为窗口，并在window触发滚动时更新气泡 */
  wrapEl?: HTMLElement | React.MutableRefObject<any>;
}

/** 传入dom时原样返回，传入执行dom对象的ref时返回current，否则返回undefined */
function getRefDomOrDom(
  target?: HTMLElement | React.MutableRefObject<any>,
): HTMLElement | undefined {
  if (!target) return undefined;
  if (isDom(target)) return target;
  if (target && isDom(target.current)) return target.current as HTMLElement;
  return undefined;
}

const Popper: React.FC<PopperProps> = ({ children, direction = 'top', wrapEl }) => {
  const popperEl = useRef<HTMLDivElement>(null!);
  const targetEl = useRef<any>(null!);

  const self = useSelf({
    // 优化动画
    refreshCount: 0,
    /** 气泡最近一次获取的x轴位置，用于减少更新 */
    lastX: (undefined as unknown) as number,
    /** 气泡最近一次获取的y轴位置，用于减少更新 */
    lastY: (undefined as unknown) as number,
    /** 最近一次的可见状态，用于：优化显示效果、提高性能 */
    lastVisible: true,
    /** 最后获取到的气泡宽度 */
    lastPopperW: 0,
    /** 最后获取到的气泡高度 */
    lastPopperH: 0,
  });

  const [state, setState] = useSetState({
    /** 气泡所在方向 */
    direction: direction as GetBoundMetasDirectionKeys,
    /** 是否可见 */
    show: true,
  });

  const showBase = state.show ? 1 : 0;

  const [spProps, set] = useSpring(() => ({
    xy: [0, 0],
    opacity: showBase,
    scale: showBase,
    config: config.stiff,
  }));

  /** 保存气泡尺寸，由于有缩放动画，直接获取dom信息会出现偏差 */
  useEffect(() => {
    if (state.show) {
      self.lastPopperW = popperEl.current.offsetWidth;
      self.lastPopperH = popperEl.current.offsetHeight;
    }
  });

  /** 更新气泡位置、状态、显示等 */
  const refresh = useFn(
    () => {
      if (!targetEl.current) return;
      if (!isNumber(self.lastPopperW) || !isNumber(self.lastPopperH)) return;

      const { currentDirection, currentDirectionKey, visible } = getPopperMetas(
        { width: self.lastPopperW, height: self.lastPopperH },
        targetEl.current,
        {
          offset: 12,
          wrap: getRefDomOrDom(wrapEl),
          direction,
          prevDirection: state.direction,
        },
      );

      if (currentDirection && currentDirectionKey) {
        // 方向与上次不同时更新方向
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
          self.refreshCount = 0; // 防止初次入场/重入场时气泡不必要的更新动画
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
    f => _throttle(f, 60),
  );

  /** 初始化定位、默认触发气泡更新方式(wrap滚动触发) */
  useEffect(() => {
    refresh();
    const e = getRefDomOrDom(wrapEl) || window;

    e.addEventListener('scroll', refresh);

    return () => {
      e.addEventListener('scroll', refresh);
    };
  }, [wrapEl]);

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
    <>
      <span
        onClick={() => setState({ show: !state.show })}
        style={{ margin: 700, display: 'inline-block' }}
        ref={targetEl}
      >
        {children}
      </span>
      <Portal namespace="popper">
        <animated.div
          ref={popperEl}
          style={{
            transform: interpolate(
              [spProps.xy, spProps.scale] as number[],
              ([x, y]: any, sc) => `translate3d(${x}px, ${y}px, 0) scale3d(${sc}, ${sc}, ${sc})`,
            ),
            opacity: spProps.opacity.interpolate(o => o),
          }}
          className={cls('fr-popper', state.direction && `__${state.direction}`)}
        >
          <span className={cls('fr-popper_arrow', state.direction && `__${state.direction}`)} />
          <div className="fr-popper_content">提示一段提示</div>
        </animated.div>
      </Portal>
    </>
  );
};

export default Popper;
