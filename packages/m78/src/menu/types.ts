import {
  DataSourceItem,
  DataSourceItemCustom,
  ValueType,
} from "../common/index.js";
import { LayProps } from "../lay/index.js";
import { DomTarget, SelectManager, SetState } from "@m78/hooks";
import { OverlayProps } from "../overlay/index.js";
import React from "react";
import { EmptyFunction, TupleNumber } from "@m78/utils";
import { TriggerProps, TriggerType } from "../trigger/index.js";

/** 应从Overlay中移除的props */
export const omitMenuOverlayProps = [
  "xy",
  "alignment",
  "target",
  "childrenAsTarget",
  "content",
  "children",
  "triggerNodeRef",
  "open",
  "defaultOpen",
  "autoFocus",
] as const;

/** 应从Overlay中移除的props */
export type MenuOmitOverlayKeys = typeof omitMenuOverlayProps[number];

export type MenuOmitOverlayProps = Omit<OverlayProps, MenuOmitOverlayKeys>;

export interface MenuOption
  extends DataSourceItem<MenuOption>,
    Omit<LayProps, "children" | "title" | "size" | "onClick" | "innerRef"> {
  /** 完全自定义项的渲染内容, 节点需要声明唯一key */
  customer?: React.ReactNode | ((close: EmptyFunction) => React.ReactElement);
}

export interface MenuProps extends MenuOmitOverlayProps, DataSourceItemCustom {
  /** 菜单选项, 所有选项必须有一个唯一的value */
  options: MenuOption[];
  /** 子级, 需遵循useTrigger子级规则 */
  children: TriggerProps["children"];
  /** 点击选中某项后触发 */
  onConfirm?: (val: ValueType, option: MenuOption) => void;
  /**
   * 子菜单的触发方式, 默认为active(鼠标悬浮), 设备为移动设备时, 会自动切换为click
   * */
  subMenuTriggerType?: TriggerType.active | TriggerType.click;
}

/** 用于快速获取树中各项直接关系的结构 */
export interface _FlatOption extends MenuOption {
  parent?: MenuOption;
  child?: MenuOption;
  next?: MenuOption;
  prev?: MenuOption;
  /** 所有兄弟节点(包含本身) */
  siblings: MenuOption[];
  /** 选项值 */
  value: ValueType;
  /** 原始选项 */
  option: MenuOption;
}

export interface _FlatMap {
  [key: string]: _FlatOption;
}

export interface _MenuContext {
  openChangeHandle: (
    open: boolean,
    val: ValueType,
    sibling?: MenuOption[],
    skipSetActive?: any
  ) => void;
  props: MenuProps;
  hasSelected: boolean;
  openSelect: SelectManager<ValueType>;
  self: {
    /** 所有overlay容器dom, 用于clickAway处理 */
    menuTargets: { [p: string]: DomTarget | null };
    /** menuTargets的list形式, 用于保持引用并传递给useClickAway */
    targets: DomTarget[];
    /** 光标最后交互的项, 用于键盘操作时控制回退的开始位置 */
    lastActive: ValueType | null;
    /** 用于快速查找树节点和其相关节点 */
    flatMap: _FlatMap;
  };
  state: {
    /** 用于contextMenu, 显示位置 */
    xy: TupleNumber | undefined;
    /** 当前高亮的项, 用于键盘操作 */
    current: MenuOption | null;
    /** subMenuTriggerType */
    subMenuTriggerType: TriggerType;
  };
  setState: SetState<_MenuContext["state"]>;
  close: () => void;
}
