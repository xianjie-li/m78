import { isFunction } from "../is.js";
import { getCmdKey, getCmdKeyStatus } from "../bom.js";
import { ensureArray } from "../array.js";
import { createUniqString } from "../string.js";

/** supported event types */
export enum KeyboardHelperTriggerType {
  down = "down",
  up = "up",
}

export type KeyboardHelperTriggerTypeKeys =
  keyof typeof KeyboardHelperTriggerType;

export type KeyboardHelperTriggerTypeUnion =
  | KeyboardHelperTriggerType
  | KeyboardHelperTriggerTypeKeys;

/** supported modifier keys */
export enum KeyboardHelperModifier {
  alt = "alt",
  ctrl = "ctrl",
  meta = "meta",
  shift = "shift",
  /** system key, determined by system, command on Mac and ctrl on Windows */
  sysCmd = "sysCmd",
}

export type KeyboardHelperModifierKeys = keyof typeof KeyboardHelperModifier;

export type KeyboardHelperModifierUnion =
  | KeyboardHelperModifier
  | KeyboardHelperModifierKeys;

/** event callback, return false represent event is interrupted, behavior like enable = false  */
export type KeyboardHelperCallback = (e: KeyboardHelperEvent) => void | false;

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

/** global listener is bound, delay binding for ssr compatible */
let init = false;

/** all events. string is uniq key */
const events: string[] = [];
const eventMap: Map<string, KeyboardHelperOption> = new Map();

/** special priority event count  */
let sortCount = 0;

const defaultOption = {
  enable: true,
  type: KeyboardHelperTriggerType.down,
  priority: 0,
  overwrite: false,
  code: [],
  modifier: [],
  preventDefault: true,
};

/** mapper KeyboardEvent.type to KeyboardTriggerType */
function typeMapper(type: string) {
  if (type === "keydown") return KeyboardHelperTriggerType.down;
  if (type === "keyup") return KeyboardHelperTriggerType.up;
  return KeyboardHelperTriggerType.down;
}

/** dispatch events by a single event listener */
function initBind() {
  if (init || typeof document === "undefined") return;
  init = true;

  document.addEventListener("keydown", handle);
  document.addEventListener("keyup", handle);
}

function handle(e: KeyboardEvent) {
  const revEvents = events
    .slice()
    .reverse()
    .map((key) => eventMap.get(key)!);

  if (sortCount) {
    revEvents.sort((a, b) => {
      return (b.priority || 0) - (a.priority || 0);
    });
  }

  const event: KeyboardHelperEvent = {
    code: e.code,
    key: e.key,
    altKey: e.altKey,
    ctrlKey: e.ctrlKey,
    metaKey: e.metaKey,
    shiftKey: e.shiftKey,
    sysCmdKey: getCmdKeyStatus(e),
    repeat: e.repeat,
    isComposing: e.isComposing,
    type: typeMapper(e.type) as KeyboardHelperTriggerType, // handle只会被内部的两种事件触发,
    nativeEvent: e,
  };

  Object.freeze(event);

  let eventKey = event.code;

  const baseKey = eventKey;

  if (event.altKey) eventKey += `+${KeyboardHelperModifier.alt}`;
  if (event.ctrlKey) eventKey += `+${KeyboardHelperModifier.ctrl}`;
  if (event.metaKey) eventKey += `+${KeyboardHelperModifier.meta}`;
  if (event.shiftKey) eventKey += `+${KeyboardHelperModifier.shift}`;
  if (event.sysCmdKey) eventKey += `+${KeyboardHelperModifier.sysCmd}`;

  // mark event triggered
  const triggerFlags = new Map<string, boolean>();

  for (let i = 0; i < revEvents.length; i++) {
    const opt = revEvents[i];

    if (!opt || opt.type !== event.type) continue;

    const code = ensureArray(opt.code);

    if (code.length && !code.includes(event.code)) continue;

    const modifier = ensureArray(opt.modifier);

    if (modifier.length) {
      // all modifier key must be same

      const actualModifierStatus = {
        [KeyboardHelperModifier.alt]: event.altKey,
        [KeyboardHelperModifier.ctrl]: event.ctrlKey,
        [KeyboardHelperModifier.meta]: event.metaKey,
        [KeyboardHelperModifier.shift]: event.shiftKey,
        [KeyboardHelperModifier.sysCmd]: event.sysCmdKey,
      };

      const hasSysCmd = modifier.includes(KeyboardHelperModifier.sysCmd);
      const hasCtrl = modifier.includes(KeyboardHelperModifier.ctrl);
      const hasMeta = modifier.includes(KeyboardHelperModifier.meta);
      const hasAlt = modifier.includes(KeyboardHelperModifier.alt);
      const hasShift = modifier.includes(KeyboardHelperModifier.shift);

      const sysCmdKey = getCmdKey();

      const sysKeyIsCtrl = sysCmdKey === "ctrlKey";
      const sysKeyIsMeta = sysCmdKey === "metaKey";

      const optModifierStatus = {
        [KeyboardHelperModifier.alt]: hasAlt,
        [KeyboardHelperModifier.ctrl]: sysKeyIsCtrl
          ? hasSysCmd || hasCtrl
          : hasCtrl,
        [KeyboardHelperModifier.meta]: sysKeyIsMeta
          ? hasSysCmd || hasMeta
          : hasMeta,
        [KeyboardHelperModifier.shift]: hasShift,
        [KeyboardHelperModifier.sysCmd]: hasSysCmd,
      };

      let breakFlag = false;

      for (const key of Object.keys(optModifierStatus)) {
        if (optModifierStatus[key] !== actualModifierStatus[key]) {
          breakFlag = true;
          break;
        }
      }

      if (breakFlag) continue;
    } else if (baseKey !== eventKey) {
      // if no modifier, and press any modifier key, ignore
      continue;
    }

    if (opt.enable === false) {
      continue;
    } else if (isFunction(opt.enable) && !opt.enable(event)) {
      continue;
    }

    if (opt.overwrite && triggerFlags.get(eventKey)) continue;

    const ret = opt.handle(event);

    if (ret === false) continue;

    if (opt.preventDefault) e.preventDefault();

    triggerFlags.set(eventKey, true);
  }
}

export type KeyboardHelper = ReturnType<typeof createKeyboardHelper>;

/** create helper */
export function createKeyboardHelper(option: KeyboardHelperOption) {
  const key = createUniqString();

  events.push(key);
  update(option);

  initBind();

  function destroy() {
    const ind = events.indexOf(key);
    if (ind > -1) {
      events.splice(ind, 1);
    }

    const opt = eventMap.get(key);

    if (opt && opt.priority) {
      sortCount--;
    }

    eventMap.delete(key);
  }

  /** update event option */
  function update(option: Partial<KeyboardHelperOption>) {
    const old = eventMap.get(key);

    // update
    if (old) {
      // update sortCount
      if (old.priority && !option.priority) {
        sortCount--;
      }

      eventMap.set(key, {
        ...old,
        ...option,
      });

      return;
    }

    // new
    if (option.priority) {
      sortCount++;
    }

    eventMap.set(key, {
      ...defaultOption,
      ...option,
    } as KeyboardHelperOption);
  }

  return {
    destroy,
    update,
    get option() {
      return eventMap.get(key);
    },
  };
}

export type KeyboardMultipleHelper = ReturnType<
  typeof createKeyboardHelpersBatch
>;

/** create helper by multiple option */
export function createKeyboardHelpersBatch(options: KeyboardHelperOption[]) {
  const helpers: KeyboardHelper[] = options.map((opt) =>
    createKeyboardHelper(opt)
  );

  return {
    /** all helper instance */
    helpers,
    /** destroy all helper */
    destroy() {
      helpers.forEach((i) => {
        i.destroy();
      });
    },
    /** get all options */
    get options() {
      return helpers.map((i) => i.option!);
    },
  };
}
