import React from 'react';
import { ButtonPropsWithHTMLButton } from 'm78/button';
import { OverlayProps } from 'm78/overlay';

export interface DialogProps extends OverlayProps {
  /** 360 | 内容区域的宽度 */
  width?: number | string;
  /** '提示' | 标题文本 */
  title?: string;

  /**
   * 默认的关闭按钮/确认按钮/右上角关闭按钮点击, 或触发了clickAway时调用, 不同的返回类型会有不同的效果
   * - 返回false, 阻止默认的关闭行为
   * - 返回一个Promise, dialog进入加载状态, 如果promise resolve的值为false或抛出异常则阻止关闭
   * */
  onClose?(isConfirm?: boolean): any;

  /** false | '取消' | 是否显示取消按钮，传入string时，为按钮文本 */
  close?: boolean | string;
  /** '确认' | 是否显示确认按钮，传入string时，为按钮文本 */
  confirm?: boolean | string;
  /** true | 是否显示关闭图标 */
  closeIcon?: boolean;
  /** 设置弹层为loading状态，阻止操作(在loading结束前会阻止clickAwayClosable) */
  loading?: boolean;
  /** 设置Dialog的状态 */
  status?: 'success' | 'error' | 'warning';
  /** 启用响应式按钮，按钮会根据底部的宽度平分剩余宽度 */
  flexBtn?: boolean;

  /** 自定义顶部内容，会覆盖title的配置 */
  header?: React.ReactNode;
  /** 自定义底部内容，与其他底部相关配置的优先级为 footer > btns > confirm、close */
  footer?: React.ReactNode;
  /** 通过配置设置按钮组, 配置项与Button组件的props完全相同 */
  btnList?: ButtonPropsWithHTMLButton[];
  /** 自定义内容区域props */
  contentProps?: JSX.IntrinsicElements['div'];
  /** 自定义头部区域props */
  headerProps?: JSX.IntrinsicElements['div'];
  /** 自定义脚部区域props */
  footerProps?: JSX.IntrinsicElements['div'];
}
