import React from 'react';
import { ButtonProps } from 'm78/button';
import { AnyFunction } from '@lxjx/utils';

export interface UseQueueConfig<ItemOption> {
  /** 初始列表 */
  list?: (ItemOption & UseQueueItem)[];
  /** 默认项配置 */
  defaultItemOption?: Partial<ItemOption & UseQueueItem>;
}

export interface UseQueueItem {
  /** 如果传入，会在指定延迟ms后自动跳转到下一条 */
  duration?: number;
}

export interface UseQueueItemWithId extends UseQueueItem {
  /** 唯一id，由组件内部生成 */
  id: string;
}

export interface TipsProps {
  controller: any;
}

export interface TipsItem extends UseQueueItem {
  /** 消息内容 */
  message?: React.ReactNode;
  /** 显示关闭按钮, 如果有下一条消息，显示文本为`下一条` */
  nextable?: boolean;
  /** 是否可切换上一条 */
  prevable?: boolean;
  /** 'card' | 显示类型, 默认显示为状态栏样式 */
  type?: 'card' | 'bar';
  /** 最小宽度且文本不换行，默认是根据容器宽度拉伸。建议在`card`类型下使用 */
  fitWidth?: boolean;
  /** 宽度 */
  width?: string | number;
  /** 一组操作 */
  actions?: {
    /** 文本 */
    text: React.ReactNode;
    /** 颜色 */
    color?: ButtonProps['color'];
    /** 点击处理函数 */
    handler?: AnyFunction;
  }[];
  /** 操作区域内容, 覆盖actions */
  actionsNode?: React.ReactNode;
}
