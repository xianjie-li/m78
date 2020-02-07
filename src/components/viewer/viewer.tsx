import React, { useImperativeHandle } from 'react';
import { useMeasure } from 'react-use';
import { animated, useSpring, interpolate, config } from 'react-spring';
import { useGesture } from 'react-use-gesture';
import _clamp from 'lodash/clamp';
import { useSelf } from '@lxjx/hooks';

export interface ViewerProps {
  /** 任何react可渲染的东西 */
  children: React.ReactNode;
  /** 禁用任何手势或实例方法 */
  disabled?: boolean;
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

const Viewer = React.forwardRef<ViewerRef, ViewerProps>(({
  children,
  disabled = false,
}, ref) => {
  const [wrap, { width, height }] = useMeasure();
  const [sp, set] = useSpring(() => (initSpring));
  const self = useSelf({
    ...initSpring,
    drag: true,
    pinch: true,
    wheel: true,
  });

  const [scaleMin, scaleMax] = scaleBound;

  useImperativeHandle(ref, () => ({
    setRotate,
    setScale,
    reset,
    instance: self,
  }));

  const bind = useGesture({
    onDrag({ delta: [offsetX, offsetY] }) {
      if (!self.drag) return;
      self.x += offsetX;
      self.y += offsetY;

      const boundX = width * self.scale;
      const boundY = height * self.scale;

      self.x = _clamp(self.x, -boundX, boundX);
      self.y = _clamp(self.y, -boundX, boundY);

      set({ x: self.x, y: self.y, config: { mass: 3, tension: 350, friction: 40 } });
    },
    onPinchStart: disableDrag,
    onPinchEnd: enableDrag,
    onPinch({ direction: [direct], delta: [, y] }) {
      self.scale = getScale(direct, 0.06);
      self.rotateZ += y;
      set({ rotateZ: self.rotateZ, scale: self.scale, config: { mass: 1, tension: 150, friction: 17 } });
    },
    onWheelStart: disableDrag,
    onWheelEnd: enableDrag,
    onWheel({ direction: [, direct] }) {
      self.scale = getScale(direct, 0.16);
      set({ scale: self.scale, config: config.stiff });
    },
  }, {
    enabled: !disabled,
  });

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

  /** 根据传入的缩放比返回一个限定边界的缩放比 */
  function setScale(scale: number) {
    if (disabled) return;
    self.scale = _clamp(scale, scaleMin, scaleMax);
    set({ scale: self.scale });
  }

  function setRotate(rotate: number) {
    if (disabled) return;
    set({ rotateZ: self.rotateZ += rotate, config: config.slow });
  }

  function reset() {
    if (disabled) return;
    set({
      scale: self.scale = initSpring.scale,
      rotateZ: self.rotateZ = initSpring.rotateZ,
      x: self.x = initSpring.x,
      y: self.y = initSpring.y,
    });
  }

  return (
    <div ref={wrap} className="fr-viewer">
      <animated.div
        {...bind()}
        className="fr-viewer_cont"
        style={{
          transform: interpolate(
            //  @ts-ignore
            [sp.x, sp.y, sp.scale, sp.rotateZ],
            //  @ts-ignore
            (x, y, scale, rotateZ) => `translate3d(${x}px, ${y}px, 0px) scale(${scale}) rotateZ(${rotateZ}deg)`,
          ),
        }}
      >
        {children}
      </animated.div>
    </div>
  );
});

export default Viewer;
