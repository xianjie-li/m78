import { TileProps } from "../layout/index.js";
import { SizeUnion, StatusUnion } from "../common/index.js";

export enum LayStyle {
  /** 分割线 */
  splitLine = "splitLine",
  /** 边框模式 */
  border = "border",
  /** 背景色模式 */
  background = "background",
  /** 无分割样式 */
  none = "none",
}

export type LayStyleKeys = keyof typeof LayStyle;

export type LayStyleUnion = LayStyle | LayStyleKeys;

export interface LayProps extends TileProps {
  /** 显示右侧箭头 */
  arrow?: boolean;
  /** 禁用（视觉禁用） */
  disabled?: boolean;
  /** 调整布局紧凑程度、字号等 */
  size?: SizeUnion;
  /** 项的分隔样式 */
  itemStyle?: LayStyleUnion;
  /** true | 交互效果 */
  effect?: boolean;
  /** 标记为选中 */
  active?: boolean;
  /** 是否高亮当前项 */
  highlight?: boolean;
  /** 状态 */
  status?: StatusUnion;
}
