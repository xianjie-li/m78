import React from 'react';
import { GetBoundMetasDirectionKeys, GetPopperMetasBound } from './getPopperMetas';
import { ComponentBaseProps } from '../types/types';

export type PopperTriggerType = 'hover' | 'click' | 'focus';

/**
 * 挂子节点、挂兄弟节点(然后删除?)
 * 要求组件能够接受children并渲染且组件能够正常渲染出能接受相关事件的包裹元素
 * */
export interface PopperProps extends ComponentBaseProps {
  /** 直接指定 目标元素/包含目标元素的ref对象/一个表示位置的GetPopperMetasBound对象, 优先级大于children */
  target?: HTMLElement | GetPopperMetasBound | React.MutableRefObject<HTMLElement>;
  /** 气泡方向 */
  direction?: GetBoundMetasDirectionKeys;
  /**
   * 子元素, 作为气泡的定位对象使用, 子元素包含以下限制
   * 1. 只能包含一个直接子节点
   * 2. 该节点能够接受onMouseEnter、onMouseLeave、onFocus、onClick等事件
   * */
  children?: React.ReactElement;
  /** 包裹元素，作为气泡边界的标识，并会在滚动时对气泡进行更新, 默认情况下，边界为窗口，并在window触发滚动时更新气泡 */
  wrapEl?: HTMLElement | React.MutableRefObject<any>;
  /** 12 | 气泡的偏移位置 */
  offset?: number;
  /** 气泡内容 */
  content?: React.ReactNode;
  /** 气泡的触发方式 */
  trigger?: PopperTriggerType | PopperTriggerType[];
  /** 默认是否显示 */
  defaultShow?: boolean;
  /** 通过show/onChange手动控制显示、隐藏 */
  show?: boolean;
  /** 通过show/onChange手动控制显示、隐藏 */
  onChange?(show: boolean): void;
  /** true | 默认content会在气泡显示时才进行渲染，设置为false后会将content随组件一起预渲染 */
  mountOnEnter?: boolean;
  /** false | 在气泡隐藏会是否销毁content */
  unmountOnExit?: boolean;
  /** 禁用 */
  disabled?: boolean;
  /** tooltip | 气泡框类型 */
  type?: 'tooltip' | 'popper' | 'confirm' | 'study';
  /** 标题，type为popper时生效 */
  title?: React.ReactNode;
  /* ============ confirm特有配置 ============ */
  /** 确认 | 类型为confirm时，确认按钮的文字 */
  confirmText?: React.ReactNode;
  /** 取消 | 类型为confirm时，取消按钮的文字 */
  cancelText?: React.ReactNode;
  /** 点击确认的回调 */
  onConfirm?(): void;
  /** type为confirm时, 此选项用于设置图标类型 */
  icon?: React.ReactNode;
  /* ============ study特有配置 ============ */
  /** 代指该组操作学习的key，用于本地缓存标识, 需要使用study能力时，此项必传 */
  studyKey?: string;
  /** 指示用户进行操作学习的一组数据, 只在初始化时生效 (在studyKey变更时，会重载所有状态并重新获取此值) */
  studyData?: PopperStudyData[];
}

export interface PopperStudyData {
  selector?: string;
  title?: React.ReactNode;
  desc?: React.ReactNode;
  img?: string;
}
