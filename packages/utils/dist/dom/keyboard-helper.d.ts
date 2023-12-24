/** supported event types */
export declare enum KeyboardHelperTriggerType {
    down = "down",
    up = "up"
}
export type KeyboardHelperTriggerTypeKeys = keyof typeof KeyboardHelperTriggerType;
export type KeyboardHelperTriggerTypeUnion = KeyboardHelperTriggerType | KeyboardHelperTriggerTypeKeys;
/** supported modifier keys */
export declare enum KeyboardHelperModifier {
    alt = "alt",
    ctrl = "ctrl",
    meta = "meta",
    shift = "shift",
    /** system key, determined by system, command on Mac and ctrl on Windows */
    sysCmd = "sysCmd"
}
export type KeyboardHelperModifierKeys = keyof typeof KeyboardHelperModifier;
export type KeyboardHelperModifierUnion = KeyboardHelperModifier | KeyboardHelperModifierKeys;
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
export type KeyboardHelper = ReturnType<typeof createKeyboardHelper>;
/** create helper */
export declare function createKeyboardHelper(option: KeyboardHelperOption): {
    destroy: () => void;
    update: (option: Partial<KeyboardHelperOption>) => void;
    readonly option: KeyboardHelperOption | undefined;
};
export type KeyboardMultipleHelper = ReturnType<typeof createKeyboardHelpersBatch>;
/** create helper by multiple option */
export declare function createKeyboardHelpersBatch(options: KeyboardHelperOption[]): {
    /** all helper instance */
    helpers: {
        destroy: () => void;
        update: (option: Partial<KeyboardHelperOption>) => void;
        readonly option: KeyboardHelperOption | undefined;
    }[];
    /** destroy all helper */
    destroy(): void;
    /** get all options */
    readonly options: KeyboardHelperOption[];
};
//# sourceMappingURL=keyboard-helper.d.ts.map