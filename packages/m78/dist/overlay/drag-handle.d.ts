import { AnyFunction } from "@m78/utils";
interface Props {
    children: (bind: AnyFunction) => React.ReactElement;
}
/** 用于Overlay子级, 绑定到需要支持拖动的节点上来实现Overlay拖动 */
export declare const _DragHandle: {
    ({ children }: Props): import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
    displayName: string;
};
export {};
//# sourceMappingURL=drag-handle.d.ts.map