import { useEffect, useMemo } from "react";
import { createRandString, getCmdKeyStatus } from "@m78/utils";

// 组合按键支持
// 除了默认触发类型, 事件可以随意指定down/up
// 事件拦截器
// 支持自定义匹配器, 比如用正则来判断是否作用

/** 支持的事件类型 */
export enum UseKeyboardTriggerType {
  down = "down",
  up = "up",
}

export type UseKeyboardTriggerTypeKeys = keyof typeof UseKeyboardTriggerType;

/** 支持的修饰键 */
export enum UseKeyboardModifier {
  alt = "alt",
  ctrl = "ctrl",
  meta = "meta",
  shift = "shift",
  /** 特定于系统的控制建, mac上为command, win上位ctrl */
  sysCmd = "sysCmd",
}

export type UseKeyboardModifierKeys = keyof typeof UseKeyboardModifier;

/** 事件回调 */
export type UseKeyboardCallback = (e: UseKeyboardEvent) => void;

/** useKeyboard配置对象 */
export interface UseKeyboardOption {
  /** 事件触发回调 */
  onTrigger: UseKeyboardCallback;
  /** 只有指定的按键按下触发 */
  code?: string[];
  /** 只有指定的修饰符按下触发 */
  modifier?: Array<UseKeyboardModifier | UseKeyboardModifierKeys>;
  /** true | 是否启用事件 */
  enable?: boolean;
  /** down | 触发的事件类型, press已被废弃故不提供 */
  type?: UseKeyboardTriggerType | UseKeyboardTriggerTypeKeys;
  /** 0 | 事件优先级, 越大则相对其他绑定越早触发 */
  priority?: number;
  /** false | 启用事件覆盖, 允许事件被更靠后注册的事件或更高优先级的同键位事件覆盖(由 修饰键 + 按件 标识唯一性) */
  cover?: boolean;
}

/** useKeyboard事件对象 */
export interface UseKeyboardEvent {
  /** 按下的物理键, 更关注按下的按键时使用 */
  code: string;
  /** 键入的字符, 更关注录入的字符时, 见 https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values */
  key: string;
  /** alt/option 是否被按下 */
  altKey: boolean;
  /** ctrl/control 是否被按下 */
  ctrlKey: boolean;
  /** win/command 是否被按下 */
  metaKey: boolean;
  /** shift 是否被按下 */
  shiftKey: boolean;
  /** 特定于系统的控制建, mac上为command, win上位ctrl */
  sysCmdKey: boolean;
  /** 是否由保持按住的事件触发 */
  repeat: boolean;
  /** 是否为合成事件 */
  isComposing: boolean;
  /** 触发类型 */
  type: UseKeyboardTriggerType;
  /** 浏览器原生事件 */
  nativeEvent: KeyboardEvent;
}

/** 全局事件是否绑定, 延迟绑定, 以兼容ssr */
let init = false;
/** 存放所有事件, 这样能在每一次render时快速通过hash更新事件的最新配置, 而不用进行遍历 */
const eventMap = new Map<string, Required<UseKeyboardOption>>();

/** 映射浏览器事件名为hook特有的 */
const typeMapper = (type: string) => {
  if (type === "keydown") return UseKeyboardTriggerType.down;
  if (type === "keyup") return UseKeyboardTriggerType.up;
};

/** 所有hook共享一个全局事件 */
function initBind() {
  if (init) return;
  init = true;

  document.addEventListener("keydown", handle);
  document.addEventListener("keyup", handle);
}

function handle(e: KeyboardEvent) {
  const eventList = Array.from(eventMap.values()).reverse();

  eventList.sort((a, b) => {
    return b.priority - a.priority;
  });

  // 标记同键位事件是否调用过, key是 修饰键 + 按钮
  const triggerFlags = new Map<string, boolean>();

  const event: UseKeyboardEvent = {
    code: e.code,
    key: e.key,
    altKey: e.altKey,
    ctrlKey: e.ctrlKey,
    metaKey: e.metaKey,
    shiftKey: e.shiftKey,
    sysCmdKey: getCmdKeyStatus(e),
    repeat: e.repeat,
    isComposing: e.isComposing,
    type: typeMapper(e.type) as UseKeyboardTriggerType, // handle只会被内部的两种事件触发,
    nativeEvent: e,
  };

  // 共用一个事件对象, 防篡改
  Object.freeze(event);

  let flagKey = event.code;

  if (event.altKey) flagKey += `+${UseKeyboardModifier.alt}`;
  if (event.ctrlKey) flagKey += `+${UseKeyboardModifier.ctrl}`;
  if (event.metaKey) flagKey += `+${UseKeyboardModifier.meta}`;
  if (event.shiftKey) flagKey += `+${UseKeyboardModifier.shift}`;
  if (event.sysCmdKey) flagKey += `+${UseKeyboardModifier.sysCmd}`;

  eventList.forEach((opt) => {
    if (!opt.enable) return;
    if (opt.type !== event.type) return;
    if (opt.code.length && !opt.code.includes(event.code)) return;
    if (
      opt.modifier.length &&
      !opt.modifier.every((i) => flagKey.includes(`+${i}`))
    ) {
      return;
    }

    if (opt.cover && triggerFlags.get(flagKey)) return;

    opt.onTrigger(event);

    triggerFlags.set(flagKey, true);
  });
}

/** 默认配置 */
const defaultOption = {
  enable: true,
  type: UseKeyboardTriggerType.down,
  priority: 0,
  cover: false,
  code: [],
  modifier: [],
};

/**
 * 订阅键盘事件
 * - 此hook主要目的是简化按键事件的绑定和分派, 不处理兼容性, 如果需要兼容旧的浏览器, 需要自行处理兼容
 * - 订阅时间越晚的事件越先触发
 * */
export function useKeyboard(option: UseKeyboardOption) {
  const opt: Required<UseKeyboardOption> = {
    ...defaultOption,
    ...option,
  };

  useMemo(() => initBind(), []);

  /** 事件的唯一id */
  const eventId = useMemo(() => createRandString(), []);

  // 实时更新事件对象
  eventMap.set(eventId, opt);

  // 清理
  useEffect(() => {
    return () => {
      eventMap.delete(eventId);
    };
  }, []);
}
