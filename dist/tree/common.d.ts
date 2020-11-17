/// <reference types="react" />
import { isTruthyArray } from '@lxjx/utils';
import { FlatMetas, OptionsItem, ToolbarConf, TreeProps, TreePropsMultipleChoice, TreePropsSingleChoice } from './types';
export declare const defaultValueGetter: (item: OptionsItem) => string | number;
export declare const defaultLabelGetter: (item: OptionsItem) => string | number | boolean | {} | import("react").ReactElement<any, string | ((props: any) => import("react").ReactElement<any, string | any | (new (props: any) => import("react").Component<any, any, any>)> | null) | (new (props: any) => import("react").Component<any, any, any>)> | import("react").ReactNodeArray | import("react").ReactPortal;
/** 预设尺寸 */
export declare const sizeMap: {
    default: {
        h: number;
        identW: number;
    };
    small: {
        h: number;
        identW: number;
    };
    large: {
        h: number;
        identW: number;
    };
};
/**
 * 将OptionsItem[]的每一项转换为FlatMetas并平铺到数组返回, 同时返回一些实用信息
 * @param optionList - OptionsItem选项组，为空或不存在时返回空数组
 * @param conf
 * @param conf.valueGetter - 获取value的方法
 * @param conf.labelGetter - 获取label的方法
 * @param conf.skipSearchKeySplicing - 关闭关键词拼接，不需要时关闭以提升性能
 * @returns returns
 * @returns returns.list - 平铺的列表
 * @returns returns.expandableList - 所有可展开节点(不包括isLeaf)
 * @returns returns.expandableValues - 所有可展开节点的value(不包括isLeaf)
 * @returns returns.zList - 一个二维数组，第一级中的每一项都是对应索引层级的所有数据
 * @returns returns.zListValues - 一个二维数组，第一级中的每一项都是对应索引层级的所有数据的value
 * @returns returns.disabledValues - 所有禁用项的value
 * @returns returns.disables - 所有禁用项
 * */
export declare function flatTreeData(optionList: OptionsItem[], conf: {
    valueGetter: NonNullable<TreeProps['valueGetter']>;
    labelGetter: NonNullable<TreeProps['labelGetter']>;
    skipSearchKeySplicing?: boolean;
}): {
    list: FlatMetas[];
    expandableList: FlatMetas[];
    expandableValues: (string | number)[];
    zList: FlatMetas[][];
    zListValues: (string | number)[][];
    disabledValues: (string | number)[];
    disables: FlatMetas[];
};
export declare function isMultipleCheck(props: TreePropsSingleChoice | TreePropsMultipleChoice): props is TreePropsMultipleChoice;
export declare function isCheck(props: TreePropsSingleChoice | TreePropsMultipleChoice): props is TreePropsSingleChoice;
/** 单选时包装props以匹配useCheck */
export declare function useValCheckArgDispose(props: TreePropsSingleChoice | TreePropsMultipleChoice): TreePropsMultipleChoice;
/** 如果传入值为字符，根据关键词裁剪并高亮字符中的所有字符 */
export declare function highlightKeyword(label: any, keyword?: string): string;
/** 帮助函数，过滤节点列表中所有包含禁用子项的节点并返回所有可用节点的value数组 */
export declare function filterIncludeDisableChildNode(ls: FlatMetas[]): (string | number)[];
/** 根据传入配置获取toolbar实际配置，如果启用会返回各项的启用配置对象 */
export declare function getToolbarConf(toolbar?: TreeProps['toolbar']): ToolbarConf | undefined;
export { isTruthyArray };
