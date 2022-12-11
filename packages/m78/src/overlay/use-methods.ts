import { BoundSize, getScrollParent, isDom, TupleNumber } from "@m78/utils";
import {
  getRefDomOrDom,
  useFn,
  UseTriggerEvent,
  UseTriggerType,
} from "@m78/hooks";
import throttle from "lodash/throttle";
import debounce from "lodash/debounce";
import {
  _arrowSpace,
  _calcAlignment,
  _defaultAlignment,
  _flip,
  _getDirections,
  _getMinClampBound,
  isBound,
  _preventOverflow,
} from "./common.js";
import {
  _Context,
  OverlayDirectionUnion,
  OverlayInstance,
  OverlayTarget,
  OverlayUpdateType,
} from "./types.js";
import { t } from "i18next";

export function _useMethods(ctx: _Context) {
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

  /** 根据target获取bound */
  function getBoundWithTarget(target: OverlayTarget): BoundSize {
    if (isBound(target)) return target;

    if (isValidTarget(target)) {
      return getRefDomOrDom(target)!.getBoundingClientRect();
    }

    if (props.childrenAsTarget && trigger.el) {
      return trigger.el.getBoundingClientRect();
    }

    /** target无效时居中显示 */
    return getBoundWithAlignment(_defaultAlignment);
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
  ): [BoundSize | null, OverlayUpdateType | null] {
    const uType = type || getCurrentBoundType();

    if (uType === OverlayUpdateType.xy)
      return [getBoundWithXY(self.lastXY!), uType];

    if (uType === OverlayUpdateType.alignment)
      return [getBoundWithAlignment(self.lastAlignment!), uType];

    if (uType === OverlayUpdateType.target)
      return [getBoundWithTarget(self.lastTarget!), uType];

    return [null, uType];
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

    const parents = getScrollParent(el, true);

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
    const [bound, type] = getBound(self.lastUpdateType);

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

      // target不同时重新获取父级
      if (self.lastTarget !== target) {
        self.lastTarget = target; // 必须在进入前设置
        syncScrollParent();
      }

      self.lastTarget = target;
      update(immediate || notPrev);
    }
  );

  /** 从children获取的节点中同步state.childrenEl */
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
    () => update(),
    (fn) => {
      return throttle(fn, 30, { trailing: true });
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
  const onTriggerMultiple = useFn((e: UseTriggerEvent) => {
    let isOpen = true;

    if (e.type === UseTriggerType.click) {
      isOpen = !open;
    }

    if (e.type === UseTriggerType.focus || e.type === UseTriggerType.active) {
      isOpen = e.type === UseTriggerType.focus ? e.focus : e.active;
    }

    if (e.type === UseTriggerType.contextMenu) {
      isOpen = true;
    }

    if (isOpen) {
      updateTarget(e.target as HTMLElement, true);
      ctx.triggerHandle(e);
    } else if (self.lastTarget === e.target) {
      ctx.triggerHandle(e);
    }
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
  };
}

export type _Methods = ReturnType<typeof _useMethods>;
