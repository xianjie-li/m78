/** 支持的事件类型 */
import React, { ReactElement, useEffect, useMemo, useState } from 'react';
import { useFn, useSelf } from '@lxjx/hooks';
import { AnyFunction, isArray } from '@lxjx/utils';

export enum UseTriggerTypeEnum {
  /** 点击 */
  click = 'click',
  /**
   * 获得焦点, 该事件在获取焦点和失去焦点时均会触发, 对象中的focus属性会根据是否focus改变, 事件的x/y, offsetX/Y等坐标信息始终为0
   * */
  focus = 'focus',
  /**
   * 根据不同的设备, 会有不同的表现, 该事件在开始和结束时均会触发:
   * - 支持鼠标事件的设备 - hover
   * - 不支持鼠标且支持touch的设备 - 按住
   *
   * 此事件自动附加了一个前置触发和后置触发延迟, 用于在大部分场景下获得更好的体验
   * */
  active = 'active',
  /** 通常是鼠标的副键点击, 在移动设备, 按住超过一定时间后也会触发, 并且会和通过touch触发的active一同触发, 所以不建议将两者混合使用 */
  contextMenu = 'contextMenu',
}

export type UseTriggerTypeKeys = keyof typeof UseTriggerTypeEnum;

/** 可用事件类型 */
export type UseTriggerType = UseTriggerTypeEnum | UseTriggerTypeKeys;

/** 自定义的触发事件对象 */
export interface UseTriggerEvent {
  /** 触发的事件类型 */
  type: UseTriggerType;
  /** 是否处于active事件中 */
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
  /** 原生事件对象, 可能是touch/mouse事件对象, 在最新的浏览器里可能是pointer对象, 如需操作需自行断言并注意处理兼容性问题 */
  nativeEvent: Event;
}

export interface UseTriggerConfig {
  /**
   * 事件目标
   * - element的渲染结果必须是一个正常的dom节点, 不能是文本等特殊节点
   * - 渲染的dom必须位于组件声明的位置, 即不能使用 ReactDOM.createPortal() 这类会更改渲染位置的api
   * */
  element?: ReactElement;
  /** 需要绑定的事件类型 */
  type: UseTriggerType | UseTriggerType[];
  /** 触发回调 */
  onTrigger?: (e: UseTriggerEvent) => void;
  /** active的特定配置 */
  active?: {
    /** 开始触发延迟(ms), mouse和touch方式触发的默认值分别是 140/400 */
    triggerDelay?: number;
    /** 离开触发延迟(ms) */
    leaveDelay?: number;
  };
}

enum ActiveType {
  undefined,
  mouse,
  touch,
}

/** 创建一个零值对象 */
const createNilEvent = (type: UseTriggerType, e: Event): UseTriggerEvent => {
  return {
    type,
    active: false,
    focus: false,
    x: 0,
    y: 0,
    offsetX: 0,
    offsetY: 0,
    nativeEvent: e,
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
function touchGen(e: TouchEvent, ele: Element | null) {
  const touch = e.changedTouches[0];

  if (!touch || !ele) return null;

  const tBound = ele.getBoundingClientRect();

  return offsetSet(createNilEvent(UseTriggerTypeEnum.active, e), {
    x: touch.clientX,
    y: touch.clientY,
    offsetX: touch.clientX - tBound.left,
    offsetY: touch.clientY - tBound.top,
  });
}

const tempNodeCls = 'm78-use-trigger-temp-node';

/**
 * 用来为一个ReactElement绑定常用的事件
 * */
export function useTrigger<E = HTMLElement>(config: UseTriggerConfig) {
  const { element, type, onTrigger, active = {} } = config;
  const { triggerDelay, leaveDelay = 100 } = active;

  const [el, setEl] = useState<HTMLElement | null>(null);

  const types = useMemo(() => {
    return isArray(type) ? type : [type];
  }, [type]);

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

  const refCallback = useFn(node => {
    if (!node) {
      if (el) setEl(null);
      return;
    }

    if (el !== node.nextSibling) {
      setEl(node.nextSibling);
    }

    if (node && node.parentNode) {
      const parentNode = node.parentNode;

      const back: AnyFunction = parentNode.removeChild.bind(parentNode);

      // 直接删除节点会导致react-refresh等刷新节点时报错, 所以需要添加一些补丁代码进行处理, 减少对dom树的破坏
      // 主要是为了使兄弟级的css选择器(~ +等)能保持正常运行
      // parentNode.appendChild(n);
      parentNode.removeChild = (...arg: any) => {
        back(...arg);
      };

      parentNode.removeChild(node);
    }
  });

  // 保持事件回调引用
  const trigger = useFn(e => onTrigger?.(e));

  // 事件是否启用
  const has = useFn((key: UseTriggerType) => types.includes(key));

  /** 处理active事件延迟的帮助函数 */
  const activeDelayHelper = useFn((cb: AnyFunction, delay: number) => {
    clearTimeout(self.activeTimer);

    if (delay) {
      self.activeTimer = setTimeout(cb, Math.max(delay));
      return;
    }

    cb();
  });

  const clickHandle = useFn((e: MouseEvent) => {
    const event = offsetSet(createNilEvent(UseTriggerTypeEnum.click, e), e);
    trigger(event);
  });

  const focusHandle = useFn(e => {
    const event = createNilEvent(UseTriggerTypeEnum.focus, e);
    event.focus = true;
    trigger(event);
  });

  const blurHandle = useFn(e => {
    const event = createNilEvent(UseTriggerTypeEnum.focus, e);
    trigger(event);
  });

  // active start基础逻辑
  const activeEnterHandle = useFn((e, aType: ActiveType, reverseType: ActiveType) => {
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
          ? offsetSet(createNilEvent(UseTriggerTypeEnum.active, e), e)
          : touchGen(e, el);

      if (!event) return;

      self.active = true;
      event.active = true;

      trigger(event);
    }, d!);
  });

  // active end基础逻辑
  const activeLeaveHandle = useFn((e, aType: ActiveType) => {
    if (self.activeType !== aType) return;

    clearTimeout(self.activeTimer);

    activeDelayHelper(() => {
      if (!self.active) return;

      self.active = false;

      const event =
        aType === ActiveType.mouse
          ? offsetSet(createNilEvent(UseTriggerTypeEnum.active, e), e)
          : touchGen(e, el);

      if (!event) return;

      trigger(event);
    }, leaveDelay);
  });

  const mouseEnterHandle = useFn(e => {
    activeEnterHandle(e, ActiveType.mouse, ActiveType.touch);
  });

  const mouseLeaveHandle = useFn(e => {
    activeLeaveHandle(e, ActiveType.mouse);
  });

  const touchStartHandle = useFn((e: TouchEvent) => {
    activeEnterHandle(e, ActiveType.touch, ActiveType.mouse);
  });

  const touchEndHandle = useFn(e => {
    activeLeaveHandle(e, ActiveType.touch);
  });

  const contextMenuHandle = useFn(e => {
    const hasContext = has(UseTriggerTypeEnum.contextMenu);

    // context点击, 获取touch式的active时, 阻止上下文菜单
    if (hasContext || (has(UseTriggerTypeEnum.active) && self.activeType === 2)) {
      e.preventDefault();
    }

    if (!hasContext) return;

    const event = offsetSet(createNilEvent(UseTriggerTypeEnum.contextMenu, e), e);
    trigger(event);
  });

  useEffect(() => {
    if (!el) return;

    if (has(UseTriggerTypeEnum.click)) {
      el.addEventListener('click', clickHandle);
    }
    if (has(UseTriggerTypeEnum.focus)) {
      el.addEventListener('focus', focusHandle);
      el.addEventListener('blur', blurHandle);
    }
    if (has(UseTriggerTypeEnum.active)) {
      el.addEventListener('mouseenter', mouseEnterHandle);
      el.addEventListener('mouseleave', mouseLeaveHandle);
      el.addEventListener('touchstart', touchStartHandle);
      el.addEventListener('touchend', touchEndHandle);
    }

    // active会在按压时禁用右键菜单, 防止误触发, 所以此事件触发条件在处理函数内部进行
    el.addEventListener('contextmenu', contextMenuHandle);

    return () => {
      el.removeEventListener('click', clickHandle);
      el.removeEventListener('focus', focusHandle);
      el.removeEventListener('blur', blurHandle);
      el.removeEventListener('mouseenter', mouseEnterHandle);
      el.removeEventListener('mouseleave', mouseLeaveHandle);
      el.removeEventListener('touchstart', touchStartHandle);
      el.removeEventListener('touchend', touchEndHandle);
      el.removeEventListener('contextmenu', contextMenuHandle);
    };
  }, [el, ...types]);

  function render() {
    if (!element) return null;

    return React.createElement(
      React.Fragment,
      null,
      React.createElement('span', {
        ref: refCallback,
        style: { display: 'none' },
        className: tempNodeCls,
      }),
      element,
    );
  }

  return {
    node: render(),
    el,
  };
}
