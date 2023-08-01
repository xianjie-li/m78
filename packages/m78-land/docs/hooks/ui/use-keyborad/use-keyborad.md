---
title: useKeyboard
---

# useKeyboard

subscribe keyboard event

## 示例

<demo demo={require("./use-keyborad.demo.tsx")} code={require("!!raw-loader!./use-keyborad.demo.tsx")}></demo>

## API

```ts
useKeyboard(option: KeyboardHelperOption): void
```

```ts
/** options */
export interface KeyboardHelperOption {
  /** event callback */
  handle: KeyboardHelperCallback;
  /** trigger when the one of specified keys down */
  code?: string | string[];
  /** trigger when the all of specified modifier keys down */
  modifier?: KeyboardHelperModifierUnion | KeyboardHelperModifierUnion[];
  /** true | event is enabled */
  enable?: ((e: KeyboardHelperEvent) => boolean) | boolean;
  /** down | event type */
  type?: KeyboardHelperTriggerTypeUnion;
  /** 0 |  event priority, higher and quicker */
  priority?: number;
  /** false | enable event overwritten, allow event be overwritten by later events. uniqueness is identified by modifier keys and code */
  overwrite?: boolean;
  /** true | disabled browser default behavior */
  preventDefault?: boolean;
}

export interface KeyboardHelperEvent {
  /** physical key */
  code: string;
  /** typed characters, see https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values */
  key: string;
  /** alt/option is down */
  altKey: boolean;
  /** ctrl/control is down */
  ctrlKey: boolean;
  /** win/command is down */
  metaKey: boolean;
  /** shift is down */
  shiftKey: boolean;
  /** system key, determined by system, command on Mac and ctrl on Windows */
  sysCmdKey: boolean;
  /** when persistent hold press key, event will be triggered continuously, if is not first triggered, repeat is true  */
  repeat: boolean;
  /** is composing event, usual signify event triggered by Input Method Editor */
  isComposing: boolean;
  /** triggered type */
  type: KeyboardHelperTriggerType;
  /** browser native event */
  nativeEvent: KeyboardEvent;
}

/** supported event types */
export enum KeyboardHelperTriggerType {
  down = "down",
  up = "up",
}

/** supported modifier keys */
export enum KeyboardHelperModifier {
  alt = "alt",
  ctrl = "ctrl",
  meta = "meta",
  shift = "shift",
  /** system key, determined by system, command on Mac and ctrl on Windows */
  sysCmd = "sysCmd",
}
```
