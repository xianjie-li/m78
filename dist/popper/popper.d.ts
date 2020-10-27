/// <reference types="react" />
import { PopperProps } from './types';
export declare const defaultProps: {
    offset: number;
    direction: "top";
    type: "tooltip";
    trigger: readonly ["hover"];
    mountOnEnter: boolean;
    unmountOnExit: boolean;
    disabled: boolean;
};
declare const Popper: {
    (_props: PopperProps): JSX.Element;
    defaultProps: {
        offset: number;
        direction: "top";
        type: "tooltip";
        trigger: readonly ["hover"];
        mountOnEnter: boolean;
        unmountOnExit: boolean;
        disabled: boolean;
    };
};
export default Popper;
