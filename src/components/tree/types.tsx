import { DataSourceItem } from 'm78/types/types';

/**
 * 定制内容
 * 多行样式
 * 可选中, 子节点关联选中、半选等、单选
 * 指示线样式
 *
 * 节点过滤
 * 动态加载节点
 * 内置多套展开图标样式, 可通过选项定制图标样式
 * 受控/非受控
 * 禁用/项禁用
 *
 * 手风琴
 * 拖拽
 * 自定义首尾内容
 * 默认展开几级/展开所有
 * 默认展开指定的树 string[]
 * 拖进宽度
 * 定制选项获取的值
 * 默认节点图标，权重小于data源配置的
 * 隐藏连接线
 * 展开方式、点击展开图标/点击任意非操作区
 *
 * 元信息: 子级(array)、父级、兄弟级(array)、层级、关键词、当前级的所有value组合
 * */

export interface OptionsItem extends Partial<DataSourceItem<string | number>> {
  disabled?: boolean;
  children?: OptionsItem[];
  /** 是否有子节点，传入此项时忽略children */
  isParent?: boolean;

  [key: string]: any;
}

export interface FlatMetas extends OptionsItem {
  /** 当前层级 */
  zIndex: number;
  /** 所有父级节点 */
  parents?: FlatMetas[];
  /** 所有兄弟节点 */
  siblings: FlatMetas[];
  /** 从第一级到当前级的value */
  values: (string | number)[];
  /** 从第一级到当前级的索引 */
  indexes: number[];
}
