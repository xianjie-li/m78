/// <reference types="react" />
import { ActionSheetProps } from './type';
declare function _ActionSheet<Val = any>(props: ActionSheetProps<Val>): JSX.Element;
declare const actionSheetApi: ({ singleton, ...props }: Pick<ActionSheetProps<any>, "title" | "onChange" | "value" | "defaultValue" | "onClose" | "confirm" | "options" | "onShowChange" | "triggerNode"> & import("@lxjx/react-render-api/dist").ReactRenderApiExtraProps) => [import("@lxjx/react-render-api/dist").ReactRenderApiInstance<Pick<ActionSheetProps<any>, "title" | "onChange" | "value" | "defaultValue" | "onClose" | "confirm" | "options" | "onShowChange" | "triggerNode">>, string];
declare type ActionSheet = typeof _ActionSheet;
interface ActionSheetWithApi extends ActionSheet {
    api: typeof actionSheetApi;
}
declare const ActionSheet: ActionSheetWithApi;
export default ActionSheet;
