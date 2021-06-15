import { AnyObject } from '@lxjx/utils';

export type TableColumnFixedKeys = 'left' | 'right';

export enum TableColumnFixedEnum {
  left = 'left',
  right = 'right',
}

export interface TableColumn {
  /** 列名 */
  label: string;
  /**
   * 该列对应的数据字段
   * - 传入字符数组时可以嵌套获取值, 如:
   *    - ['user', 'name'] => user.name
   *    - ['things', '1', 'name'] => things['1'].name
   * */
  field?: string | string[];
  /** 列的固定宽度, 不传时列宽取决于其内容的宽度 */
  width?: string | number;
  /**
   * 列的最大宽度, 此配置会覆盖width配置
   * - 具体表现为，内容宽度未超过maxWidth时根据内容决定列宽，内容宽度超过列宽时取maxWidth
   * - 通常此配置能实现比width更好的显示效果
   * */
  maxWidth?: string | number;
  /** 固定列到左侧或右侧, 如果声明了fixed的列在常规列中间，它会根据固定方向移动到表格两侧渲染 */
  fixed?: TableColumnFixedKeys | TableColumnFixedEnum;
}

/** 内部使用的扩展TableColumn */
export interface _TableColumnInside extends TableColumn {
  /** 是否为左侧固定列的最后一个 */
  fixedLeftLast?: boolean;
  /** 是否为右侧固定列的第一个 */
  fixedRightFirst?: boolean;
}

export type TableColumns = TableColumn[];

export interface TableProps {
  dataSource: AnyObject[];
  columns: TableColumns;
  /**
   * key/id | 表示dataSource中一条记录的唯一值
   * - 如果是key | id 以外的键(如uid)，需要特别指定
   * - 在启用了选择等功能时，primaryKey对应的值会作为选中项的value
   * */
  primaryKey?: string;
}
