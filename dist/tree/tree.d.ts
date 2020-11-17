import React from 'react';
import { TreePropsMultipleChoice, TreePropsSingleChoice } from './types';
export declare const defaultProps: {
    valueGetter: (item: import("./types").OptionsItem) => string | number;
    labelGetter: (item: import("./types").OptionsItem) => string | number | boolean | {} | React.ReactElement<any, string | ((props: any) => React.ReactElement<any, string | any | (new (props: any) => React.Component<any, any, any>)> | null) | (new (props: any) => React.Component<any, any, any>)> | React.ReactNodeArray | React.ReactPortal;
    indicatorLine: boolean;
    checkStrictly: boolean;
};
declare function Tree(props: TreePropsSingleChoice): JSX.Element;
declare namespace Tree {
    var defaultProps: {
        valueGetter: (item: import("./types").OptionsItem) => string | number;
        labelGetter: (item: import("./types").OptionsItem) => string | number | boolean | {} | React.ReactElement<any, string | ((props: any) => React.ReactElement<any, string | any | (new (props: any) => React.Component<any, any, any>)> | null) | (new (props: any) => React.Component<any, any, any>)> | React.ReactNodeArray | React.ReactPortal;
        indicatorLine: boolean;
        checkStrictly: boolean;
    };
}
declare function Tree(props: TreePropsMultipleChoice): JSX.Element;
declare namespace Tree {
    var defaultProps: {
        valueGetter: (item: import("./types").OptionsItem) => string | number;
        labelGetter: (item: import("./types").OptionsItem) => string | number | boolean | {} | React.ReactElement<any, string | ((props: any) => React.ReactElement<any, string | any | (new (props: any) => React.Component<any, any, any>)> | null) | (new (props: any) => React.Component<any, any, any>)> | React.ReactNodeArray | React.ReactPortal;
        indicatorLine: boolean;
        checkStrictly: boolean;
    };
}
export default Tree;
