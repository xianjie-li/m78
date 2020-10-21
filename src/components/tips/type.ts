import React from 'react';
import { ButtonProps } from 'm78/button';
import { ComponentBaseProps } from '../types/types';

/*
 * tips()
 * const { tips, ref } = useTips({ target: el | ref });
 *
 * push(msg) 推入一条消息, 如果当前没有消息，执行next()
 *
 * next() 关闭当前消息, 然后从列表取出第一条消息显示，并设置倒计时，计时结束后
 * 拉取下一条消息进行显示, 直到队列为空
 *
 * 如果没有消息，关闭当前消息
 *
 * clear() 移除所有消息
 * */

export interface TipsProps {}

export interface TipsItem {
  /** 表示消息的唯一id，由组件内部生成 */
  id?: string;
  /** 消息内容 */
  message?: React.ReactNode;
  /** 1500 | 显示时间 */
  duration?: number;
  /** 显示关闭按钮, 如果有下一条消息，显示文本为`下一条` */
  closeable?: boolean;
  /** 'card' | 显示类型, 默认显示为状态栏样式 */
  type?: 'card' | 'bar';
  /** 宽度 */
  width?: string | number;
  /** 一组操作 */
  actions?: {
    /** 文本 */
    text?: React.ReactNode;
    /** 颜色 */
    color?: ButtonProps['color'];
  }[];
  /** 操作区域内容, 覆盖actions */
  actionsNode?: React.ReactNode;
  /** 关闭当前正在显示的消息并显示此消息 */
  forceShow?: boolean;
}
