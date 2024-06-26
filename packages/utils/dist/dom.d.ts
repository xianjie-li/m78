import { AnyObject, Bound, BoundSize, TupleNumber } from "./types.js";
/**
 * get a dom, multiple calls will return the same dom
 * @param namespace - create a uniq node by namespace
 * @param extraProps - set additional props to dom elements
 * @return - dom
 * */
export declare const getPortalsNode: (namespace?: string, extraProps?: AnyObject) => HTMLDivElement;
/**
 * get scrollbar width
 * @param className - If the element customizes the scroll bar through css, pass in the class name for customization
 * @return scroll - bar [x, y] width, generally 0 on mobile, unless you customize the scroll bar
 * */
export declare function getScrollBarWidth(className?: string): TupleNumber;
/**
 * get style value of dom element
 * @param dom - target dom
 * @return - an object containing all available style values, an null means not supported
 *  */
export declare function getStyle(dom: HTMLElement): Partial<CSSStyleDeclaration>;
/** inject a css fragment to document */
export declare function loadStyle(css: any): void;
export declare function loadScript(url: string): Promise<void>;
/**
 * check if element is visible
 * @param target - an element to be detected or an object that represents location information
 * @param option
 * @param option.fullVisible - false | default is to be completely invisible, and set to true to be invisible if element is partially occluded
 * @param option.wrapEl - By default, the viewport computes visibility through this specified element (viewport is still detected)
 * @param option.offset - Offset of visibility, specifying all directions for numbers, and specific directions for object
 * @return - Whether the overall visibility information and the specified direction does not exceed the visible boundary
 * */
export declare function checkElementVisible(target: HTMLElement | Partial<Bound>, option?: {
    fullVisible?: boolean;
    wrapEl?: HTMLElement;
    offset?: number | Partial<Bound>;
}): {
    visible: boolean;
    top: boolean;
    left: boolean;
    right: boolean;
    bottom: boolean;
    bound: Partial<Bound>;
};
interface TriggerHighlightConf {
    /** #1890ff | line color */
    color?: string;
    /** true | use outline, if false use box-shadow */
    useOutline?: boolean;
}
/**
 * highlight special node (outline or shadow), if node contain (input,select,textarea), will focus them;
 * */
export declare function triggerHighlight(target: HTMLElement, TriggerHighlightConf?: TriggerHighlightConf): void;
export declare function triggerHighlight(selector: string, TriggerHighlightConf?: TriggerHighlightConf): void;
export declare function triggerHighlight(t: string | HTMLElement, TriggerHighlightConf?: TriggerHighlightConf): void;
/**
 * Query the incoming Node for the presence of a specified node in all of its parent nodes
 * @param node - node to be queried
 * @param matcher - matcher, recursively receives the parent node and returns whether it matches
 * @param depth - maximum query depth
 * */
export declare function getCurrentParent(node: Element, matcher: (node: Element) => boolean, depth?: number): boolean;
/**
 * Get scrolling parent node, get all scroll parent when pass getAll
 *
 * When setting checkOverflow, will check dom overflow property to be 'auto' or 'scroll', default us true.
 *
 * When setting or getting scrollTop/scrollLeft on document.documentElement and document.body, the performance of different browsers will be inconsistent, so when the scroll element is document.documentElement or document.body, document.documentElement is returned uniformly for easy identification
 * */
export declare function getScrollParent(ele: HTMLElement, getAll?: false, checkOverflow?: boolean): HTMLElement | null;
export declare function getScrollParent(ele: HTMLElement, getAll?: true, checkOverflow?: boolean): HTMLElement[];
/** get doc scroll offset, used to solve the problem of different versions of the browser to get inconsistent */
export declare function getDocScrollOffset(): {
    x: number;
    y: number;
};
/** set doc scroll offset */
export declare function setDocScrollOffset(conf?: {
    x?: number;
    y?: number;
}): void;
/** check whether the dom node is scrollable, if checkOverflowAttr is true, will check dom overflow property to be 'auto' or 'scroll'. */
export declare function hasScroll(el: HTMLElement, checkOverflowAttr?: boolean): {
    x: boolean;
    y: boolean;
};
/** Obtaining offsets from different events, Target is a reference node, if omitted, use e.target as the reference node */
export declare function getEventOffset(e: MouseEvent | TouchEvent | PointerEvent, target?: HTMLElement | BoundSize): TupleNumber;
/** Get xy points (clientX/Y) from different events */
export declare function getEventXY(e: TouchEvent | MouseEvent | PointerEvent): readonly [number, number, boolean];
/** checkChildren = false | check dom is focus, detected childrens focus when checkChildren is true */
export declare function isFocus(dom: HTMLElement, checkChildren?: boolean): boolean;
export {};
//# sourceMappingURL=dom.d.ts.map