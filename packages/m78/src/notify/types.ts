import React from "react";
import { StatusUnion } from "../common/index.js";
import { RenderApiComponentProps } from "@m78/render-api";
import { SpringRef } from "react-spring";
import { UseMeasureBound } from "@m78/hooks";

/** notify的可用显示方向 */
export enum NotifyPosition {
  top = "top",
  bottom = "bottom",
  center = "center",
  leftTop = "leftTop",
  leftBottom = "leftBottom",
  rightTop = "rightTop",
  rightBottom = "rightBottom",
}

export type NotifyPositionKeys = keyof typeof NotifyPosition;

export type NotifyPositionUnion = NotifyPosition | NotifyPositionKeys;

export interface NotifyState {
  /** 显示的内容 */
  content?: React.ReactNode;
  /** 'info' | 状态 */
  status?: StatusUnion;
  /** 标题 */
  title?: React.ReactNode;
  /** 'center' | 显示的位置 */
  position?: NotifyPositionUnion;
  /** 1000 | 持续时间，如果不需要自动关闭，传Infinity */
  duration?: number;
  /** 渲染操作栏, 可通过props.onChange(false)来主动关闭, props.onUpdate(newState)来更新状态 */
  actions?: (props: NotifyProps) => React.ReactNode;
  /** 显示关闭按钮 */
  cancel?: boolean;
  /** 是否启用遮罩层, 通过loading()触发时默认为true  */
  mask?: boolean;
  /** 触摸或光标移动到上方时是否暂停notify动画计时, tips和notify类型默认为true */
  interactive?: boolean;
  /** 设置为加载状态 */
  loading?: boolean;
  /** 800 | 最小持续时间, 主要用于实现loading时防止loading过快消失造成不良体验, 用于loading()时, 此项默认值为800 */
  minDuration?: number;
  /** 完全自定义内容区域, 此项会覆盖掉大部分其他的ui配置, 如loading/cancel等, 渲染函数内可通过props.onChange(false)来主动关闭, props.onUpdate(newState)来更新状态 */
  customer?: (props: NotifyProps) => React.ReactNode;
}

export interface NotifyProps
  extends NotifyState,
    Required<RenderApiComponentProps<NotifyState>> {}

/** 快捷通知 */
export interface NotifyQuicker {
  (content: NotifyState["content"], position?: NotifyState["position"]): void;
}

/** loading配置 */
export interface LoadingOption
  extends Pick<NotifyState, "position" | "mask" | "minDuration"> {}

export interface _Share {
  hasDuration: boolean;
  duration: number;
  position: NotifyPositionUnion;
  open: boolean;
  api: SpringRef<{
    process: number;
    height: number;
    opacity: number;
    transform: string;
  }>;
  props: NotifyProps;
  bound: UseMeasureBound;
}
