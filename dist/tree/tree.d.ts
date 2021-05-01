import React from 'react';
import { TreePropsMultipleChoice, TreePropsSingleChoice } from './types';
export declare const defaultProps: {
    valueGetter: (item: import("./types").OptionsItem) => {} | null | undefined;
    labelGetter: (item: import("./types").OptionsItem) => string | number | boolean | {} | React.ReactElement<any, string | ((props: any) => React.ReactElement<any, any> | null) | (new (props: any) => React.Component<any, any, any>)> | React.ReactNodeArray | React.ReactPortal;
    indicatorLine: boolean;
    checkStrictly: boolean;
};
/**
 * TODO: 拖拽
 * 拖动开始时，关闭开启状态
 * 停止在一个可展开节点上时，延迟一定时间后展开该节点
 * 放置时根据拖动位置调整左侧缩进
 * 拖放到元素上时，将其合并到元素末尾
 * */
declare function Tree(props: TreePropsSingleChoice): JSX.Element;
declare namespace Tree {
    var defaultProps: {
        valueGetter: (item: import("./types").OptionsItem) => {} | null | undefined;
        labelGetter: (item: import("./types").OptionsItem) => string | number | boolean | {} | React.ReactElement<any, string | ((props: any) => React.ReactElement<any, any> | null) | (new (props: any) => React.Component<any, any, any>)> | React.ReactNodeArray | React.ReactPortal;
        indicatorLine: boolean;
        checkStrictly: boolean;
    };
}
declare function Tree(props: TreePropsMultipleChoice): JSX.Element;
declare namespace Tree {
    var defaultProps: {
        valueGetter: (item: import("./types").OptionsItem) => {} | null | undefined;
        labelGetter: (item: import("./types").OptionsItem) => string | number | boolean | {} | React.ReactElement<any, string | ((props: any) => React.ReactElement<any, any> | null) | (new (props: any) => React.Component<any, any, any>)> | React.ReactNodeArray | React.ReactPortal;
        indicatorLine: boolean;
        checkStrictly: boolean;
    };
}
export default Tree;
