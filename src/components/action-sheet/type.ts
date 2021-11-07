import { FormLikeWithExtra } from '@lxjx/hooks';
import React from 'react';
import { DataSourceItem } from 'm78/types';

export interface ActionSheetItem extends DataSourceItem {
  /* 详情 */
  desc?: string;
  /* 高亮该项 */
  highlight?: boolean;
  /* 禁用该项 */
  disabled?: boolean;
}

export interface ActionSheetProps<Val> extends FormLikeWithExtra<Val, ActionSheetItem> {
  /** 操作项配置 */
  options: ActionSheetItem[];
  /** '请选择' | 标题 */
  title?: string;
  /** '确认' | 是否开启选择模式，选择后需要确认才会进行关闭 */
  confirm?: boolean | string;
  /** 默认的关闭按钮/确认按钮, 或触发了clickAway时，如果是通过确认按钮点击的切选中了值，item为选中的值 */
  onClose?(val: Val, item?: ActionSheetItem): void;
  /** 可选, 传入一个占位节点来作为的控制开关, 在非受控时会直接代理show的值，受控时通过onChange回传最新状态 */
  triggerNode?: React.ReactElement;
  /** 默认显示状态，与show同时使用时无效 */
  defaultShow?: boolean;
  /** 手动控制modal的显示/隐藏, 与onClose搭配作为受控模式使用 */
  show?: boolean;
  /** 显示状态改变时触发 */
  onShowChange?: (nShow: boolean) => void;
  /** ======== 继承属性 ======== */
  /** 以受控模式设置值 */
  // value?: Val;
  /** value发生改变 */
  // onChange?: (value: Val, item: ActionSheetItem) => void;
  /** 以非受控模式设置值 */
  // defaultValue?: Val;
}
