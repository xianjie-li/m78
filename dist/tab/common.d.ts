import { TabItemElement } from './type';
/** 格式化子项，确保其格式为Tab[], 如果每一个TabItem子项都不含内容时，hasContent为false */
export declare function formatChild(children?: TabItemElement | TabItemElement[]): {
    child: TabItemElement[];
    hasContent: boolean;
    values: (string | number)[];
};
/** 从一组ReactElement<TabItemProps>中拿到props组成的数组 */
export declare function getChildProps(children: TabItemElement[]): import("./type").TabItemProps[];
/** 根据当前value和values获取索引, 无匹配时默认为0 */
export declare function getIndexByVal(val: any, vals: Array<string | number>): number;
