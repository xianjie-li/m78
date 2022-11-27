---
title: useKeyboard
---

# useKeyboard

订阅键盘事件

- 此hook主要目的是简化按键事件的绑定和分派, 不处理兼容性, 如果需要兼容旧的浏览器, 需要自行处理兼容
- 订阅时间越晚的事件越先触发

## 示例

<demo demo={require("./use-keyborad.demo.tsx")} code={require("!!raw-loader!./use-keyborad.demo.tsx")}></demo>

## API

```ts
function useKeyboard(option: UseKeyboardOption): void
```

```ts
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
  /** true | 启用事件覆盖, 允许事件被更靠后注册的事件或更高优先级的同键位事件覆盖(由 修饰键 + 案件 标识唯一性) */
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

/** 支持的事件类型 */
export enum UseKeyboardTriggerType {
  down = "down",
  up = "up",
}

/** 支持的修饰键 */
export enum UseKeyboardModifier {
  alt = "alt",
  ctrl = "ctrl",
  meta = "meta",
  shift = "shift",
  /** 特定于系统的控制建, mac上为command, win上位ctrl */
  sysCmd = "sysCmd",
}

/** 事件回调 */
export type UseKeyboardCallback = (e: UseKeyboardEvent) => void;
```
