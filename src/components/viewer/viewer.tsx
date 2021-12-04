import React, { useEffect, useImperativeHandle, useRef } from 'react';
import { animated, useSpring, to, config } from 'react-spring';
import { useGesture } from 'react-use-gesture';
import _clamp from 'lodash/clamp';
import { useSelf, useSetState } from '@lxjx/hooks';
import { AxisBounds } from 'react-use-gesture/dist/types';
import { ComponentBaseProps } from 'm78/types/types';
import cls from 'clsx';
import { getBoundMeta } from './utils';

export interface ViewerProps extends ComponentBaseProps {
  /** 任何react可渲染的东西 */
  children: React.ReactNode;
  /** false | 禁用任何手势或实例方法 */
  disabled?: boolean;
  /** 传入一个dom元素或一个ref对象用于限制可拖动的范围, 默认拖动范围为当前元素宽高值 * 缩放比 */
  bound?: React.MutableRefObject<Element> | Element;
  /** true | 单独开启关闭某一类事件 */
  drag?: boolean;
  pinch?: boolean;
  wheel?: boolean;
}

export interface ViewerRef {
  /** 设置旋转角度 */
  setRotate(rotate: number): void;
  /** 设置缩放比例 */
  setScale(scale: number): void;
  /** 还原所有状态 */
  reset(): void;
  /** 实例属性 */
  instance: {
    /** 只读 | 当前缩放比 */
    scale: number;
    /** 只读 | 当前旋转角度 */
    rotateZ: number;
    /** 只读 | x轴偏移距离 */
    x: number;
    /** 只读 | y轴偏移距离 */
    y: number;
    /** 拖动是否可用 */
    drag: boolean;
    /** 捏、双指展开是否可用 */
    pinch: boolean;
    /** 鼠标滚动是否可用 */
    wheel: boolean;
  };
}

const scaleBound = [0.5, 3];

const initSpring = {
  scale: 1,
  rotateZ: 0,
  x: 0,
  y: 0,
};

const Viewer = React.forwardRef<ViewerRef, ViewerProps>(
  (
    {
      children,
      disabled = false,
      bound,
      drag = true,
      pinch = true,
      wheel = true,
      className,
      style,
    },
    ref,
  ) => {
    const innerWrap = useRef<HTMLDivElement>(null!);
    const eventEl = useRef<HTMLDivElement>(null!);

    const [sp, set] = useSpring(() => initSpring);

    const self = useSelf({
      ...initSpring,
      /* 这三个开关只作用于组件内部，不与prop上的同名属性相关, 因为某些情况下需要在不触发组件render的情况下更改状态(提升性能) */
      drag: true,
      pinch: true,
      wheel: true,

      /** 手势结束并重启drag的计时器 */
      pinchTimer: null as any,
    });

    const [scaleMin, scaleMax] = scaleBound;

    const [state, setState] = useSetState<{ bound?: AxisBounds }>({
      bound: undefined,
    });

    useImperativeHandle(ref, () => ({
      setRotate,
      setScale,
      reset,
      instance: self,
    }));

    const bind = useGesture(
      {
        onDrag({ event, movement: [offsetX, offsetY], first }) {
          event?.preventDefault();

          if (!self.drag) return;

          if (first) {
            refreshBound();
          }

          self.x = offsetX;
          self.y = offsetY;

          set({ x: self.x, y: self.y, config: config.default });
        },
        onPinchStart: disableDrag,
        onPinchEnd() {
          // 防止pinch结束后收到drag影响移动位置
          clearTimeout(self.pinchTimer);
          self.pinchTimer = setTimeout(() => {
            enableDrag();
          }, 100);
        },
        onPinch({ direction: [direct], delta: [, y] }) {
          self.scale = getScale(direct, 0.03);
          self.rotateZ += y;

          set({
            rotateZ: self.rotateZ,
            scale: self.scale,
            config: { mass: 1, tension: 150, friction: 17 },
          });
        },
        onWheelStart: disableDrag,
        onWheelEnd: enableDrag,
        onWheel({ event, direction: [, direct] }) {
          event?.preventDefault();
          self.scale = getScale(direct, 0.16);
          set({ scale: self.scale, config: config.stiff });
        },
      },
      {
        domTarget: eventEl,
        enabled: !disabled,
        drag: {
          enabled: drag,
          bounds: state.bound,
          rubberband: true,
          initial: () => [self.x, self.y],
        },
        pinch: {
          enabled: pinch,
        },
        wheel: {
          enabled: wheel,
        },
        eventOptions: { passive: false },
      },
    );

    useEffect(bind as any, [bind]);

    /** 根据缩放方向和缩放值返回一个在合法缩放区域的缩放值 */
    function getScale(direct: number, value: number): number {
      const diff = direct > 0 ? +value : -value;
      let scale = Math.round((self.scale + diff) * 100) / 100; // 去小数
      scale = _clamp(scale, scaleMin, scaleMax);
      return scale;
    }

    function disableDrag() {
      self.drag = false;
    }

    function enableDrag() {
      self.drag = true;
    }

    function setScale(scale: number) {
      if (disabled) return;
      self.scale = _clamp(scale, scaleMin, scaleMax);
      set({ scale: self.scale });
    }

    function setRotate(rotate: number) {
      if (disabled) return;
      set({ rotateZ: (self.rotateZ += rotate), config: config.slow });
    }

    function reset() {
      if (disabled) return;

      set({
        scale: (self.scale = initSpring.scale),
        rotateZ: (self.rotateZ = initSpring.rotateZ),
        x: (self.x = initSpring.x),
        y: (self.y = initSpring.y),
      });
    }

    function refreshBound() {
      if (!bound || !innerWrap.current) return;

      let boundNode;

      if ('getBoundingClientRect' in bound) {
        boundNode = bound;
      } else {
        boundNode = bound.current;
      }

      if (!boundNode) return;

      const boundMeta = getBoundMeta(boundNode, innerWrap.current);

      if (boundMeta === state.bound) return;

      setState({
        bound: boundMeta,
      });
    }

    return (
      <div ref={innerWrap} className={cls('m78 m78-viewer', className)} style={style}>
        <animated.div
          ref={eventEl}
          className="m78-viewer_cont"
          style={{
            transform: to(
              [sp.x, sp.y, sp.scale, sp.rotateZ],
              (x, y, scale, rotateZ) =>
                `translate3d(${x}px, ${y}px, 0px) scale(${scale}) rotateZ(${rotateZ}deg)`,
            ),
          }}
        >
          {children}
        </animated.div>
      </div>
    );
  },
);

export default Viewer;
