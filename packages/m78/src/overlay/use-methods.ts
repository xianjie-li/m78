import {
  BoundSize,
  getScrollParent,
  isBoolean,
  isDom,
  TupleNumber,
} from "@m78/utils";
import { getRefDomOrDom, useFn } from "@m78/hooks";
import throttle from "lodash/throttle.js";
import debounce from "lodash/debounce.js";
import {
  _arrowSpace,
  _calcAlignment,
  _defaultAlignment,
  _defaultProps,
  _flip,
  _getDirections,
  _getMinClampBound,
  _preventOverflow,
  isBound,
} from "./common.js";
import {
  _ClampBound,
  _OverlayContext,
  OverlayDirectionUnion,
  OverlayInstance,
  OverlayTarget,
  OverlayUpdateType,
} from "./types.js";
import { EventTypes, Handler } from "@use-gesture/core/types";
import { TriggerEvent, TriggerType } from "@m78/trigger";

export function _useMethods(ctx: _OverlayContext) {
  const {
    containerRef,
    props,
    spApi,
    self,
    open,
    state,
    setState,
    arrowSpApi,
    trigger,
    setOpen,
  } = ctx;

  /** 判断当前的bound类型, 返回null表示无任何可用配置 */
  function getCurrentBoundType(): OverlayUpdateType | null {
    if (self.lastXY) return OverlayUpdateType.xy;
    if (self.lastAlignment) return OverlayUpdateType.alignment;
    if (isValidTarget(self.lastTarget)) return OverlayUpdateType.target;
    return null;
  }

  /** 根据xy获取bound */
  function getBoundWithXY(xy: TupleNumber): BoundSize {
    const [x, y] = xy;
    return {
      left: x,
      top: y,
      width: 0,
      height: 0,
    };
  }

  /** 根据alignment获取bound */
  function getBoundWithAlignment(alignment: TupleNumber): BoundSize {
    let { width, height } = containerRef.current.getBoundingClientRect();

    if (state.lastDirection) {
      width = 0;
      height = 0;
    }

    const [x, y] = _calcAlignment(alignment, [width, height]);

    return {
      left: x,
      top: y,
      width: 0,
      height: 0,
    };
  }

  /** 根据target获取bound和el */
  function getBoundWithTarget(
    target: OverlayTarget
  ): [BoundSize, HTMLElement | null] {
    if (isBound(target)) return [target, null];

    if (isValidTarget(target)) {
      // 上方已经过滤掉bound, 所以这里必定是dom节点
      const el = getRefDomOrDom(target) || null;
      return [el!.getBoundingClientRect(), el];
    }

    if (props.childrenAsTarget && trigger.el) {
      return [trigger.el.getBoundingClientRect(), trigger.el];
    }

    /** target无效时居中显示 */
    return [getBoundWithAlignment(_defaultAlignment), null];
  }

  /** 是否是有效的target */
  function isValidTarget(target?: any): target is OverlayTarget {
    if (!target) return false;
    if (isBound(target)) return true;
    const el = getRefDomOrDom(target);
    return !!isDom(el);
  }

  /**
   * 根据传入类型或当前配置获取定位bound和类型, 取值顺序为:
   * xy > alignment > target
   *
   * 如果未成功获取到, 返回null
   * */
  function getBound(
    type?: OverlayUpdateType
  ): [BoundSize | null, OverlayUpdateType | null, HTMLElement | null] {
    const uType = type || getCurrentBoundType();

    if (uType === OverlayUpdateType.xy)
      return [getBoundWithXY(self.lastXY!), uType, null];

    if (uType === OverlayUpdateType.alignment)
      return [getBoundWithAlignment(self.lastAlignment!), uType, null];

    if (uType === OverlayUpdateType.target) {
      const [bound, el] = getBoundWithTarget(self.lastTarget!);
      return [bound, uType, el];
    }

    return [null, uType, null];
  }

  /** 获取根据方向处理后的位置信息, 此函数假设位置信息存在, 在调用前需进行断言 */
  function getDirectionMeta(t: BoundSize) {
    const containerBound = containerRef.current.getBoundingClientRect();
    const dir: OverlayDirectionUnion = props.direction!;

    const offset =
      props.offset + (props.arrow ? props.arrowSize[1] + _arrowSpace : 0);

    const clampBound = _getMinClampBound(state.scrollParents);

    // 获取所有位置信息
    const directions = _getDirections(t, containerBound, clampBound, offset);

    // 根据可用信息选择一个方向, 优先使用最后使用的方向防止过多的跳动
    const pickDirection = _flip(dir, directions, state.lastDirection);

    if (pickDirection.direction !== state.lastDirection) {
      setState({
        lastDirection: pickDirection.direction,
      });
    }

    // 内容超出屏幕修正处理
    return _preventOverflow(
      pickDirection,
      t,
      containerBound,
      clampBound,
      props.arrowSize
    );
  }

  /** 在满足条件的情况下同步所有滚动父级 */
  function syncScrollParent() {
    if (!self.lastTarget) return;
    if (!isValidTarget(self.lastTarget) || isBound(self.lastTarget)) return;
    const el = getRefDomOrDom(self.lastTarget);
    if (!el) return;

    const parents = getScrollParent(el, true, false);

    let same = true;

    const filterP = parents.filter(
      (item) => item !== document.documentElement && item !== document.body
    );
    filterP.forEach((item, index) => {
      const prev = state.scrollParents[index];
      if (item !== prev) {
        same = false;
      }
    });

    if (!same) {
      setState({
        scrollParents: filterP,
      });
    }
  }

  /** 是否启用箭头 */
  function isArrowEnable() {
    return props.direction && props.arrow;
  }

  /** 使用最后更新的类型或配置类型更新位置 */
  const update = useFn<OverlayInstance["update"]>((immediate?: boolean) => {
    if (!open) return;

    // 1. 存在最后更新类型, 直接走该类型
    // 2. 不存在最后更新类型, 使用配置自动获取的类型
    // 3. 两种方式均未获取到值, 使用默认的alignment

    const [bound, type, el] = getBound(self.lastUpdateType);

    // target不同时重新获取父级
    if (el && self.lastSyncScrollElement !== el) {
      self.lastSyncScrollElement = el;
      syncScrollParent();
    }

    if (type) {
      self.lastUpdateType = type;
    }

    let tBound = bound || getBoundWithAlignment(_defaultAlignment);

    let isHidden = false;

    // 含位置配置时, 根据位置进行修正
    if (props.direction) {
      const [directionBound, arrowOffset, hide] = getDirectionMeta(tBound);

      isHidden = hide;

      if (isArrowEnable()) {
        arrowSpApi.start({
          offset: arrowOffset,
          immediate: true,
        });
      }

      tBound = {
        ...tBound,
        left: directionBound.left,
        top: directionBound.top,
      };
    }

    self.lastPosition = [tBound.left, tBound.top];

    spApi.start({
      to: {
        x: tBound.left,
        y: tBound.top,
        isHidden,
      },
      immediate,
    });
  });

  /** 根据传入的xy来更新位置 */
  const updateXY = useFn<OverlayInstance["updateXY"]>(
    (xy: TupleNumber, immediate?: boolean) => {
      self.lastUpdateType = OverlayUpdateType.xy;
      self.lastXY = xy;
      update(immediate);
    }
  );

  /** 根据传入的alignment来更新位置 */
  const updateAlignment = useFn<OverlayInstance["updateAlignment"]>(
    (alignment: TupleNumber, immediate?: boolean) => {
      self.lastUpdateType = OverlayUpdateType.alignment;
      self.lastAlignment = alignment;
      update(immediate);
    }
  );

  /** 根据传入的target来更新位置 */
  const updateTarget = useFn<OverlayInstance["updateTarget"]>(
    (target: OverlayTarget, immediate?: boolean) => {
      const notPrev = !self.lastTarget;
      self.lastUpdateType = OverlayUpdateType.target;
      self.lastTarget = target;
      update(isBoolean(immediate) ? immediate : notPrev);
    }
  );

  /** 从children获取的dom来更新target */
  const updateChildrenEl = useFn(() => {
    if (props.childrenAsTarget && trigger.el) {
      updateTarget(trigger.el);
    }
  });

  /** 内容区域活动时触发(鼠标移入 ) */
  const activeContent = useFn(() => {
    clearTimeout(self.shouldCloseTimer);
    self.activeContent = true;
  });

  /** 内容区域失活时触发 */
  const unActiveContent = useFn(() => {
    self.activeContent = false;

    // 有shouldCloseFlag标记并且不处于活动状态时关闭
    if (self.shouldCloseFlag && !self.currentActiveStatus) {
      self.shouldCloseTimer = setTimeout(() => {
        if (!self.currentActiveStatus && !ctx.isUnmount()) {
          setOpen(false);
        }
      }, 260);
    }
  });

  /** 防止高频调用的update */
  const throttleUpdate = useFn(
    () => update(true),
    (fn) => {
      return throttle(fn, 5, { trailing: true });
    }
  );

  /** 防止高频调用的update */
  const debounceUpdate = useFn(
    () => update(),
    (fn) => {
      return debounce(fn, 500);
    }
  );

  // 多触发点的特殊handle
  const onTriggerMultiple = useFn((e: TriggerEvent) => {
    clearTimeout(self.triggerMultipleDelayOpenTimer);
    clearTimeout(self.triggerMultipleTimer);

    if (e.type === TriggerType.move) {
      ctx.triggerHandle(e);
      return;
    }

    let isOpen = true;

    if (e.type === TriggerType.click) {
      isOpen = !open;
    }

    if (e.type === TriggerType.focus || e.type === TriggerType.active) {
      isOpen = e.type === TriggerType.focus ? e.focus : e.active;
    }

    if (e.type === TriggerType.contextMenu) {
      isOpen = true;
    }

    if (isOpen) {
      self.lastTriggerTarget = e.target;

      // 需要在clickAway之后触发, 并阻止部分相互存在干扰的事件
      self.triggerMultipleTimer = setTimeout(() => {
        ctx.triggerHandle(e);
        self.triggerMultipleDelayOpenTimer = setTimeout(() => {
          updateTarget(e.target.target as HTMLElement, true);
        });
      }, 10);
    } else if (self.lastTriggerTarget === e.target) {
      self.lastTriggerTarget = undefined;
      ctx.triggerHandle(e);
    }
  });

  /** 拖动处理 */
  const onDragHandle: Handler<"drag", EventTypes["drag"]> = useFn((e) => {
    if (props.direction) {
      console.warn(
        `overlay: direction and drag can't be used at the same time`
      );
      return;
    }

    updateXY(e.offset, true);
  });

  /** 获取拖动的初始坐标 */
  const getDragInitXY = useFn(() => {
    if (!self.lastPosition) return [0, 0] as TupleNumber;
    return self.lastPosition;
  });

  /** 获取拖动的限制边界 */
  const getDragBound = useFn(() => {
    // 拖动时containerRef必然已挂载
    const bound = containerRef.current?.getBoundingClientRect();
    return {
      left: 0,
      top: 0,
      right: window.innerWidth - bound.width,
      bottom: window.innerHeight - bound.height,
    } as _ClampBound;
  });

  return {
    getBoundWithXY,
    getBoundWithAlignment,
    getBoundWithTarget,
    getBound,
    activeContent,
    unActiveContent,
    updateChildrenEl,
    isArrowEnable,
    updateXY,
    updateAlignment,
    updateTarget,
    update,
    throttleUpdate,
    debounceUpdate,
    onTriggerMultiple,
    onDragHandle,
    getDragInitXY,
    getDragBound,
  };
}

export type _Methods = ReturnType<typeof _useMethods>;
