import React, { ReactElement, useEffect } from "react";
import { AnyFunction, dumpFn, ensureArray } from "@m78/utils";
import { useFn, useSelf, useSetState } from "../../index.js";

/**
 * 支持的事件类型
 * - 在触控设备上, 会自动添加css到目标dom并使用preventEvent来阻止一些默认行为
 * */
export enum UseTriggerType {
  /** 点击 */
  click = "click",
  /**
   * 获得焦点, 该事件在获取焦点和失去焦点时均会触发, 可通过e.focus判断是否聚焦, 事件的x/y, offsetX/Y等坐标信息始终为0
   * - 需要确保element或其任意子级是focusable的
   * */
  focus = "focus",
  /**
   * 根据不同的设备, 会有不同的表现, 该事件在开始和结束时均会触发:
   * - 支持鼠标事件的设备 - hover
   * - 不支持鼠标且支持touch的设备 - 按住一段时间
   *
   * 此事件自动附加了一个触发延迟, 用于在大部分场景下获得更好的体验(比如鼠标快速划过)
   * */
  active = "active",
  /** 通常是鼠标的副键点击, 在移动设备, 按住超过一定时间后也会触发, 这和active在移动设备的行为一致, 所以不建议将两者混合使用 */
  contextMenu = "contextMenu",
}

export type UseTriggerTypeKeys = keyof typeof UseTriggerType;

/** 可用事件类型 */
export type UseTriggerTypeUnion = UseTriggerType | UseTriggerTypeKeys;

/** 事件对象 */
export interface UseTriggerEvent<E extends Event = Event> {
  /** 触发的事件类型 */
  type: UseTriggerTypeUnion;
  /** 是否处于active状态 */
  active: boolean;
  /** 是否处于focus状态 */
  focus: boolean;
  /** 触发位置相对屏幕的x坐标 */
  x: number;
  /** 触发位置相对屏幕的y坐标 */
  y: number;
  /** 触发位置相对目标左上角的x坐标 */
  offsetX: number;
  /** 触发位置相对目标左上角的y坐标 */
  offsetY: number;
  /** 原生事件对象, 可能是touch/mouse事件对象, 在最新的浏览器里可能是pointer对象, 如需操作需自行注意处理兼容问题 */
  nativeEvent: E;
  /** 事件目标节点 */
  target: EventTarget;
  /** 接收至UseTriggerConfig.data */
  data?: any;
}

/** 事件配置 */
export interface UseTriggerConfig {
  /**
   * 事件目标元素, 元素渲染结果必须是单个dom节点, 文本或多个dom会导致事件监听异常
   * - 弱传入无效值则不进行任何监听
   * */
  element?: ReactElement;
  /** 需要绑定的事件类型 */
  type: UseTriggerTypeUnion | UseTriggerTypeUnion[];
  /** 触发回调 */
  onTrigger?: (e: UseTriggerEvent) => void;
  /** active的特有配置 */
  active?: {
    /** 开始触发延迟(ms), mouse和touch方式触发的默认值分别是 140/400, 防止鼠标快速划过触发或移动端点击触发 */
    triggerDelay?: number;
    /** 离开触发延迟(ms) */
    leaveDelay?: number;
  };
  /** 传递给事件回调的数据, 某些场景会很有用, 比如一个事件处理函数在多个trigger中复用订阅时 */
  data?: any;
}

/** Trigger的props, 对element进行了更名 */
export interface UseTriggerProps extends Omit<UseTriggerConfig, "element"> {
  children: UseTriggerConfig["element"];
}

enum ActiveType {
  undefined,
  mouse,
  touch,
}

const createNilEvent = (
  type: UseTriggerTypeUnion,
  e: Event,
  target: HTMLElement,
  data = null
): UseTriggerEvent => {
  return {
    type,
    active: false,
    focus: false,
    x: 0,
    y: 0,
    offsetX: 0,
    offsetY: 0,
    nativeEvent: e,
    target,
    data,
  };
};

/** 将e2的xy, offsetXY赋值到e的对应属性 */
const offsetSet = (e: UseTriggerEvent, e2: any) => {
  e.x = e2.x || 0;
  e.y = e2.y || 0;
  e.offsetX = e2.offsetX || 0;
  e.offsetY = e2.offsetY || 0;
  return e;
};

/** 根据touch事件和目标节点生成事件对象 */
function touchGen(e: TouchEvent, ele: HTMLElement, data = null) {
  const touch = e.changedTouches[0];

  if (!touch || !ele) return null;

  const tBound = ele.getBoundingClientRect();

  return offsetSet(createNilEvent(UseTriggerType.active, e, ele, data), {
    x: touch.clientX,
    y: touch.clientY,
    offsetX: touch.clientX - tBound.left,
    offsetY: touch.clientY - tBound.top,
  });
}

/**
 * 用来为一个ReactElement绑定常用的触发事件
 * */
export function useTrigger(config: UseTriggerConfig) {
  const { element, type, onTrigger, active = {}, data = null } = config;
  const { triggerDelay, leaveDelay = 100 } = active;

  const types = ensureArray(type);

  const self = useSelf({
    /**
     * 用于防止active绑定的touch和mouse事件冲突, 某些设备同时支持两者, 此配置用于在某一事件触发后永远的禁用另一事件
     * 0为待定 1为mouse 2为touch
     * */
    activeType: ActiveType.undefined,
    /** 是否处于active状态中 */
    active: false,
    /** active delay 计时器 */
    activeTimer: null as any,
  });

  // 保持事件回调引用
  const trigger = useFn((e) => onTrigger?.(e));

  // 事件是否启用
  const has = useFn((key: UseTriggerTypeUnion) => types.includes(key));

  /** 处理active事件延迟的帮助函数 */
  const activeDelayHelper = useFn((cb: AnyFunction, delay: number) => {
    clearTimeout(self.activeTimer);

    if (delay) {
      self.activeTimer = setTimeout(cb, Math.max(delay));
      return;
    }

    cb();
  });

  const clickHandle = useFn((e: FocusEvent) => {
    const event = offsetSet(
      createNilEvent(UseTriggerType.click, e, state.el!, data),
      e
    );
    trigger(event);
  });

  const focusHandle = useFn((e: FocusEvent) => {
    e.stopPropagation();
    const event = createNilEvent(UseTriggerType.focus, e, state.el!, data);
    event.focus = true;
    trigger(event);
  });

  const blurHandle = useFn((e: FocusEvent) => {
    e.stopPropagation();
    const event = createNilEvent(UseTriggerType.focus, e, state.el!, data);
    event.data = data;
    trigger(event);
  });

  // active start基础逻辑
  const activeEnterHandle = useFn(
    (e, aType: ActiveType, reverseType: ActiveType) => {
      if (self.activeType === reverseType) return;

      self.activeType = aType;

      let d = triggerDelay;

      // 如果未设置, 根据类型为其设置默认值
      if (d === undefined) {
        if (aType === ActiveType.mouse) d = 140;
        if (aType === ActiveType.touch) d = 400;
      }

      activeDelayHelper(() => {
        if (self.active) return;

        const event =
          aType === ActiveType.mouse
            ? offsetSet(
                createNilEvent(UseTriggerType.active, e, state.el!, data),
                e
              )
            : touchGen(e, state.el!, data);

        if (!event) return;

        self.active = true;
        event.active = true;

        trigger(event);
      }, d!);
    }
  );

  // active end基础逻辑
  const activeLeaveHandle = useFn((e, aType: ActiveType) => {
    if (self.activeType !== aType) return;

    clearTimeout(self.activeTimer);

    activeDelayHelper(() => {
      if (!self.active) return;

      self.active = false;

      const event =
        aType === ActiveType.mouse
          ? offsetSet(
              createNilEvent(UseTriggerType.active, e, state.el!, data),
              e
            )
          : touchGen(e, state.el!, data);

      if (!event) return;

      trigger(event);
    }, leaveDelay);
  });

  const mouseEnterHandle = useFn((e: MouseEvent) => {
    activeEnterHandle(e, ActiveType.mouse, ActiveType.touch);
  });

  const mouseLeaveHandle = useFn((e: MouseEvent) => {
    activeLeaveHandle(e, ActiveType.mouse);
  });

  const touchStartHandle = useFn((e: TouchEvent) => {
    activeEnterHandle(e, ActiveType.touch, ActiveType.mouse);
  });

  const touchEndHandle = useFn((e: TouchEvent) => {
    activeLeaveHandle(e, ActiveType.touch);
  });

  const contextMenuHandle = useFn((e: MouseEvent) => {
    const hasContext = has(UseTriggerType.contextMenu);

    // context点击, 获取touch式的active时, 阻止上下文菜单
    if (hasContext || (has(UseTriggerType.active) && self.activeType === 2)) {
      e.preventDefault();
    }

    if (!hasContext) return;

    const event = offsetSet(
      createNilEvent(UseTriggerType.contextMenu, e, state.el!, data),
      e
    );
    trigger(event);
  });

  const [state, setState] = useSetState({
    el: null as null | HTMLElement,
  });

  // 通过ref测量element实际渲染的dom
  const refCallback = useFn((node) => {
    if (!node) return;

    if (state.el !== node.nextSibling) {
      setState({
        el: node.nextSibling,
      });
    }

    // 从dom中删除测量节点
    if (node && node.parentNode) {
      const parentNode = node.parentNode;

      const back: AnyFunction = parentNode.removeChild.bind(parentNode);

      // 直接删除节点会导致react-refresh等刷新节点时报错, 所以需要添加一些补丁代码进行处理, 减少对dom树的破坏
      // 主要是为了使兄弟级的css选择器(~ +等)能保持正常运行
      // parentNode.appendChild(n);
      parentNode.removeChild = (...arg: any) => {
        try {
          back(...arg);
        } catch (e) {
          dumpFn(e);
        }
      };

      parentNode.removeChild(node);
    }
  });

  // 事件绑定
  useEffect(() => {
    const el = state.el;

    if (!el) return;

    if (has(UseTriggerType.click)) {
      el.addEventListener("click", clickHandle);
    }
    if (has(UseTriggerType.focus)) {
      el.addEventListener("focus", focusHandle);
      el.addEventListener("blur", blurHandle);
    }
    if (has(UseTriggerType.active)) {
      el.addEventListener("mouseenter", mouseEnterHandle);
      el.addEventListener("mouseleave", mouseLeaveHandle);
      el.addEventListener("touchstart", touchStartHandle);
      el.addEventListener("touchend", touchEndHandle);
    }

    // active内部故意没有处理preventDefault, 因为会导致contextmenu不触发, 放到contextMenu事件中一起处理
    el.addEventListener("contextmenu", contextMenuHandle);

    // 综合考虑还是主动为用户禁用默认行为, 在触控设备上自动添加阻止默认行为css
    if (
      "ontouchstart" in document.documentElement &&
      (has(UseTriggerType.active) || has(UseTriggerType.contextMenu))
    ) {
      el.style.touchAction = "none";
      el.style.userSelect = "none";
    }

    return () => {
      el.removeEventListener("click", clickHandle);
      el.removeEventListener("focus", focusHandle);
      el.removeEventListener("blur", blurHandle);
      el.removeEventListener("mouseenter", mouseEnterHandle);
      el.removeEventListener("mouseleave", mouseLeaveHandle);
      el.removeEventListener("touchstart", touchStartHandle);
      el.removeEventListener("touchend", touchEndHandle);
      el.removeEventListener("contextmenu", contextMenuHandle);
    };
  }, [state.el, ...types]);

  return {
    node: (
      <>
        {React.isValidElement(element) && (
          <span
            style={{ display: "none" }}
            ref={refCallback}
            // 这里key是为了强制每次render时都让react重绘span, 因为我们每次成功拿到element
            // 渲染的dom后就会删除掉该span节点来避免对用户dom结构的破坏
            // 而react是不知道其已经被删除的, 我们后续测量就会失效, (因为span只存在内存中, span.nextSibling)
            key={String(Math.random())}
          />
        )}
        {element}
      </>
    ),
    el: state.el,
  };
}

export function Trigger(config: UseTriggerProps) {
  const trigger = useTrigger({
    ...config,
    element: config.children,
  });

  return trigger.node;
}
