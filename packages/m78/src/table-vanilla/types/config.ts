import { tableDefaultTexts } from "../common.js";
import { AnyObject } from "@m78/utils";
import { TablePlugin } from "../plugin.js";

import {
  TableCellConfig,
  TableCellWithDom,
  TableColumnConfig,
  TableColumnLeafConfigFormatted,
  TableRowConfig,
} from "./items.js";
import { TableSelectConfig } from "../plugins/select.js";
import { TableKey, TableRenderCtx } from "./base-type.js";
import { TableEmptyConfig } from "../plugins/empty.js";
import { TableDragSortConfig } from "../plugins/drag-sort.js";
import { TableInteractiveCoreConfig } from "../plugins/interactive-core.js";
import { TableFormConfig } from "../plugins/form.js";
import { TableIsConfig } from "../plugins/is.js";

/**
 * 对外暴露的变更配置, 用于持久化记录变更的表格配置
 *
 * 不同配置有不同的重置级别, 大部分只需要index, sortColumns这类的则需要full, sortColumns 在index阶段过滤
 * */
export interface TablePersistenceConfig {
  /** 排序后的列, 未包含的列会移动至末尾, 分组表头不能进行排序 */
  sortColumns?: TableKey[];
  /** 隐藏的列 */
  hideColumns?: TableKey[];
  /** 变更的列 */
  columns?: {
    [key: string]: Omit<TableColumnLeafConfigFormatted, "key" | "originalKey">;
  };
  /** 变更的行 */
  rows?: TableConfig["rows"];
  /** 变更的单元格 */
  cells?: TableConfig["cells"];
  /** 定制后的默认行高 */
  rowHeight?: TableConfig["rowHeight"];
  /** 定制后的默认列宽 */
  columnWidth?: TableConfig["columnWidth"];
  /** 条纹背景 */
  stripe?: TableConfig["stripe"];
  /** 列边框 */
  border?: TableConfig["border"];
}

/** 基础配置 */
export interface TableBaseConfig {
  /** 用于挂载表格的div节点 */
  el: HTMLDivElement;
  /** 数据主键, 用于标识数据的唯一性, 对应的值类型必须为字符串或数字 */
  primaryKey: string;
  /** 数据源 */
  data: AnyObject[];
  /** 列配置 */
  columns: TableColumnConfig[];
  /** 行配置, 用于特别指定某些行的配置 */
  rows?: {
    [key: string]: TableRowConfig;
  };
  /** 单元格配置, 用于特别指定某些单元格的配置, key格式为`${rowKey}##${columnKey}` */
  cells?: {
    [key: string]: TableCellConfig;
  };
  /** 表格高度, 不传时使用挂载节点的高度 */
  height?: number | string;
  /** 表格宽度, 不传时使用挂载节点的宽度 */
  width?: number | string;
  /** true | 当数据总高度/宽度不足容器尺寸时, 压缩容器尺寸使其与数据占用尺寸一致 */
  autoSize?: boolean;
  /** 36 | 默认行高 */
  rowHeight?: number;
  /** 100 | 默认列宽 */
  columnWidth?: number;
  /** true | 相邻行显示不同的背景色 */
  stripe?: boolean;
  /** true | 显示单元格列边框 */
  border?: boolean;

  /**
   * 自定义单元格渲染, 主要有两种用途:
   * - 自定义节点样式或属性: 比如cell.dom.style.color = "red"
   * - 自定义子级: 完全定制cell.dom的内部节点, 同时设置ctx.disableDefaultRender为true来阻止默认的文本渲染
   *
   * 插件和配置都会注入render, 所以渲染回调额外接收了ctx作为上下文对象, 用于控制渲染行为.
   * ctx.isFirstRender 表示是否初次渲染, 由于render频率是很高的, 所以很多情况我们只需要在第一次render时插入节点, 后续只需要在已有节点上更新即可
   * ctx.disableDefaultRender 表示是否阻止默认的文本渲染, 通常用于自定义子级时使用
   * ctx.disableLaterRender 设置为true, 将会阻止后续插件/配置的render调用
   *
   * 可以通过cell.state.xx来保存一些针对当前单元格的渲染状态
   * */
  render?: (cell: TableCellWithDom, ctx: TableRenderCtx) => void;

  /** 持久化配置, 用于还原之前用户手动变更过的表格配置 */
  persistenceConfig?: TablePersistenceConfig;

  /** 定制提示/反馈文本 */
  texts?: Partial<typeof tableDefaultTexts>;

  /** 插件 */
  plugins?: Array<typeof TablePlugin | TablePlugin>;
}

/** 会在内部实现间使用的配置 */
export interface TableInternalConfig {
  /** 用于挂载放置dom层节点的容器, 仅在需要自定义滚动容器时使用 */
  viewEl?: HTMLDivElement;
  /** domEl的子级, 用于放置实际的dom内容, 仅在需要自定义滚动容器时使用 */
  viewContentEl?: HTMLDivElement;
  /** 传入定制的createEvent, 内部事件将使用此工厂函数创建 */
  eventCreator?: any;
}

/** 表格配置 */
export interface TableConfig
  extends TableBaseConfig,
    TableSelectConfig,
    TableEmptyConfig,
    TableDragSortConfig,
    TableInteractiveCoreConfig,
    TableInternalConfig,
    TableFormConfig,
    TableIsConfig {}
