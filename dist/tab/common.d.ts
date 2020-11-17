import { TabItemElement } from './type';
/** 格式化子项，确保其格式为Tab[] */
export declare function formatChild(children?: TabItemElement | TabItemElement[]): TabItemElement[];
/** 从一组ReactElement<TabItemProps>中拿到props组成的数组 */
export declare function getChildProps(children: TabItemElement[]): import("./type").TabItemProps[];
