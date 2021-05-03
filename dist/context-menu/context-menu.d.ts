/// <reference types="react" />
import { ContextMenuItemProps, ContextMenuProps } from './types';
declare const ContextMenu: {
    ({ content, customer, className, style, children }: ContextMenuProps): JSX.Element;
    Item: (props: ContextMenuItemProps) => JSX.Element;
};
declare const ContextMenuItem: (props: ContextMenuItemProps) => JSX.Element;
export default ContextMenu;
export { ContextMenuItem };
