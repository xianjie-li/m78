import { PopperPropsCustom } from './types';
declare function Tooltip(props: PopperPropsCustom): JSX.Element;
declare function Popper(props: PopperPropsCustom): JSX.Element;
declare function Confirm(props: PopperPropsCustom): JSX.Element;
export declare const buildInComponent: {
    tooltip: typeof Tooltip;
    popper: typeof Popper;
    confirm: typeof Confirm;
};
export {};
