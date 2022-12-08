import React, { ReactElement, useMemo } from "react";
import { AnyFunction, AnyObject, ensureArray, isFunction } from "@m78/utils";
import { useFn, useSelf } from "../../index.js";

/** 支持的事件类型 */
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
   * - 不支持鼠标且支持touch的设备 - 按住
   *
   * 此事件自动附加了一个触发延迟, 用于在大部分场景下获得更好的体验(比如鼠标快速划过)
   * */
  active = "active",
  /** 通常是鼠标的副键点击, 在移动设备, 按住超过一定时间后也会触发, 并且会和通过touch触发的active一同触发, 所以不建议将两者混合使用 */
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
  /** 接收至UseTriggerConfig.data */
  data?: any;
}

/** 事件配置 */
export interface UseTriggerConfig {
  /**
   * 事件目标节点, 根据绑定的事件类型, 需要支持以下事件props:
   * - click -> onClick
   * - focus -> onFocus/onBlur
   * - active -> 使用鼠标的设备: onMouseEnter/onMouseLeave  触控设备: onTouchStart/onTouchEnd, 如果需要两端都兼容, 需要同时支持传入这4个事件
   * - contextMenu -> onContextMenu
   * */
  element: ReactElement;
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
function touchGen(e: TouchEvent, ele: Element | null, data = null) {
  const touch = e.changedTouches[0];

  if (!touch || !ele) return null;

  const tBound = ele.getBoundingClientRect();

  return offsetSet(createNilEvent(UseTriggerType.active, e, data), {
    x: touch.clientX,
    y: touch.clientY,
    offsetX: touch.clientX - tBound.left,
    offsetY: touch.clientY - tBound.top,
  });
}

/** 调用eType指定的element.props事件, 自动进行空处理, 用来确保内部事件不会覆盖用户主动向节点传入的事件 */
const elementPropsEventCall = (
  element: React.ReactElement,
  eType: string,
  e: React.SyntheticEvent
) => {
  const call = element?.props?.[eType];

  if (isFunction(call)) {
    call(e);
  }
};

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

  const clickHandle = useFn((e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    elementPropsEventCall(element, "onClick", e);
    const event = offsetSet(
      createNilEvent(UseTriggerType.click, e.nativeEvent, data),
      e.nativeEvent
    );
    trigger(event);
  });

  const focusHandle = useFn((e: React.FocusEvent<HTMLElement, MouseEvent>) => {
    elementPropsEventCall(element, "onFocus", e);
    e.stopPropagation();
    const event = createNilEvent(UseTriggerType.focus, e.nativeEvent, data);
    event.focus = true;
    trigger(event);
  });

  const blurHandle = useFn((e: React.FocusEvent<HTMLElement, MouseEvent>) => {
    elementPropsEventCall(element, "onBlur", e);
    e.stopPropagation();
    const event = createNilEvent(UseTriggerType.focus, e.nativeEvent, data);
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
                createNilEvent(UseTriggerType.active, e, data),
                e.nativeEvent
              )
            : touchGen(e, e.nativeEvent.currentTarget, data);

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
              createNilEvent(UseTriggerType.active, e, data),
              e.nativeEvent
            )
          : touchGen(e, e.nativeEvent.currentTarget, data);

      if (!event) return;

      trigger(event);
    }, leaveDelay);
  });

  const mouseEnterHandle = useFn(
    (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
      elementPropsEventCall(element, "onMouseEnter", e);
      activeEnterHandle(e, ActiveType.mouse, ActiveType.touch);
    }
  );

  const mouseLeaveHandle = useFn(
    (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
      elementPropsEventCall(element, "onMouseLeave", e);
      activeLeaveHandle(e, ActiveType.mouse);
    }
  );

  const touchStartHandle = useFn((e: React.TouchEvent<HTMLElement>) => {
    elementPropsEventCall(element, "onTouchStart", e);
    activeEnterHandle(e, ActiveType.touch, ActiveType.mouse);
  });

  const touchEndHandle = useFn((e: React.TouchEvent<HTMLElement>) => {
    elementPropsEventCall(element, "onTouchEnd", e);
    activeLeaveHandle(e, ActiveType.touch);
  });

  const contextMenuHandle = useFn(
    (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
      elementPropsEventCall(element, "onContextMenu", e);
      const hasContext = has(UseTriggerType.contextMenu);

      // context点击, 获取touch式的active时, 阻止上下文菜单
      if (hasContext || (has(UseTriggerType.active) && self.activeType === 2)) {
        e.preventDefault();
      }

      if (!hasContext) return;

      const event = offsetSet(
        createNilEvent(UseTriggerType.contextMenu, e.nativeEvent),
        e.nativeEvent
      );
      trigger(event);
    }
  );

  const events = useMemo(() => {
    const events: AnyObject = {
      // active会在按压时禁用右键菜单, 防止误触发, 所以此事件触发条件在处理函数内部进行
      onContextMenu: contextMenuHandle,
    };

    if (has(UseTriggerType.click)) {
      events["onClick"] = clickHandle;
    }
    if (has(UseTriggerType.focus)) {
      events["onFocus"] = focusHandle;
      events["onBlur"] = blurHandle;
    }
    if (has(UseTriggerType.active)) {
      events["onMouseEnter"] = mouseEnterHandle;
      events["onMouseLeave"] = mouseLeaveHandle;
      events["onTouchStart"] = touchStartHandle;
      events["onTouchEnd"] = touchEndHandle;
    }
    return events;
  }, types);

  return useMemo(() => {
    return React.cloneElement(element, {
      ...element.props,
      ...events,
    });
  }, [events, element]);
}

export function Trigger(config: UseTriggerProps) {
  return useTrigger({
    ...config,
    element: config.children,
  });
}
