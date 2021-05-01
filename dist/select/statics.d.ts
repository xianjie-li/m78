import { PopperPropsCustom } from 'm78/popper';
import { ListChildComponentProps } from 'react-window';
import { RenderItemData, SelectCustomTag, SelectOptionItem, SelectProps } from './type';
/** 自定义popper样式 */
export declare function CustomPopper(props: PopperPropsCustom): JSX.Element;
/** 根据SelectOptionItem取value */
export declare function getValue(item: SelectOptionItem, key: string): any;
/** 根据SelectOptionItem取label */
export declare function getLabel(item: SelectOptionItem, key: string, vKey: string): any;
/** 根据传入的key过滤出用于展示的选项列表 */
export declare function filterOptionsHandler(key: string, options: SelectOptionItem[], checked: any[], hideSelected: boolean, isChecked: (val: any) => void, valueKey: string): SelectOptionItem[];
/** 处理传入的FormLike参数 */
export declare function getUseCheckConf(props: SelectProps<any>): any;
interface Item extends ListChildComponentProps {
    data: RenderItemData;
}
/** 渲染选项, 用于实现虚拟滚动 */
export declare function RenderItem({ index, style, data }: Item): JSX.Element | null;
/** 根据选中标签选项获取字符 */
export declare function showMultipleString(list: SelectOptionItem[], multipleMaxShowLength: number, key: string, vKey: string): string;
export declare const buildInTagRender: SelectCustomTag;
/** 合并两组SelectOptionItem，并去除掉value重复的选项 */
export declare function mergeOptions(source1: SelectOptionItem[], source2: SelectOptionItem[], valueKey?: string): any[];
export {};
