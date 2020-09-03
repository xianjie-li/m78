import React, { useMemo } from 'react';

import 'm78/base';
import ShowFromMouse from 'm78/show-from-mouse';
import Button, { ButtonProps } from 'm78/button';
import { Transition } from '@lxjx/react-transition-spring';
import { config } from 'react-spring';
import { CloseOutlined, statusIcons } from 'm78/icon';
import Spin from 'm78/spin';
import { dumpFn } from 'm78/util';
import { useSameState } from '@lxjx/hooks';

import createRenderApi, { ReactRenderApiProps } from '@lxjx/react-render-api';

import cls from 'classnames';
import { ComponentBaseProps } from '../types/types';

export interface DialogProps extends ReactRenderApiProps, ComponentBaseProps {
  /** 启用响应式按钮，按钮会根据底部的宽度平分剩余宽度 */
  flexBtn?: boolean;
  /** 内容区域的最大宽度, 默认为360 */
  maxWidth?: number | string;
  /** 自定义顶部内容，会覆盖title的配置 */
  header?: React.ReactNode;
  /** '提示' | 标题文本 */
  title?: string;
  /** 内容区域 */
  children?: React.ReactNode;
  /** 通过配置设置按钮组 */
  btns?: (Pick<ButtonProps, 'color' | 'children' | 'onClick' | 'disabled' | 'icon' | 'link'> & {
    text: string;
  })[];
  /** 自定义底部内容，与其他底部相关配置的优先级为 footer > btns > confirm、close */
  footer?: React.ReactNode;
  /** 默认的确认按钮被点击时 */
  onConfirm?(): void;
  /** false | '取消' | 是否显示取消按钮，传入string时，为按钮文本 */
  close?: boolean | string;
  /** '确认' | 是否显示确认按钮，传入string时，为按钮文本 */
  confirm?: boolean | string;
  /** true | 是否显示遮罩 */
  mask?: boolean;
  /** true | 是否允许点击mask进行关闭 */
  maskClosable?: boolean;
  /** true | 是否显示关闭图标 */
  closeIcon?: boolean;
  /** 设置弹层为loading状态，阻止操作(在loading结束前会阻止mask点击关闭以及防止弹层点击) */
  loading?: boolean;
  /** 使用自定义内容完全替换默认渲染内容，会覆盖掉footer、header、title区域并使相关的配置失效 */
  content?: React.ReactNode;
  /** 设置Dialog的状态 */
  status?: 'success' | 'error' | 'warning';
  /** 内容区域class */
  contentClassName?: string;
  /** 头部区域class */
  headerClassName?: string;
  /** 脚部区域class */
  footerClassName?: string;
}

const zIndex = 1800;

const _Dialog: React.FC<DialogProps> = ({
  show,
  onRemove = dumpFn,
  onClose = dumpFn,
  flexBtn,
  maxWidth = 360,
  footer,
  header,
  title = '提示',
  mask = true,
  maskClosable = true,
  onConfirm = dumpFn,
  close = false,
  confirm = '确认',
  closeIcon = true,
  loading = false,
  btns = [],
  children,
  status,
  contentClassName,
  footerClassName,
  headerClassName,
  className,
  style,
  content,
  namespace,
}) => {
  const [cIndex, instances] = useSameState('fr_dialog_metas', !!show, {
    mask,
  });
  const nowZIndex = cIndex === -1 ? zIndex : cIndex + zIndex;

  // 当前实例之前所有实例组成的数组
  const beforeInstance = instances.slice(0, cIndex);
  // 在该实例之前是否有任意一个实例包含mask
  const beforeHasMask = beforeInstance.some(item => item.meta.mask);

  const dpr = useMemo(() => window.devicePixelRatio || 1, []);

  function renderDefaultFooter() {
    return (
      <>
        {close && (
          <Button onClick={() => onClose()}>{typeof close === 'string' ? close : '取消'}</Button>
        )}
        {confirm && (
          <Button color="primary" onClick={() => onConfirm()}>
            {typeof confirm === 'string' ? confirm : '确认'}
          </Button>
        )}
      </>
    );
  }

  function renderBtns() {
    if (btns.length === 0) return null;
    return btns.map(({ text, ...btnProps }, key) => (
      <Button key={key} {...btnProps}>
        {text}
      </Button>
    ));
  }

  function renderDefault() {
    return (
      <>
        <div className={cls('m78-dialog_title', headerClassName)}>
          {header || <span>{title}</span>}
        </div>
        <div className={cls('m78-dialog_cont', contentClassName)}>{children}</div>
        <div className={cls('m78-dialog_footer', footerClassName, { __full: flexBtn })}>
          {footer || renderBtns() || renderDefaultFooter()}
        </div>
      </>
    );
  }

  const StatusIcon = statusIcons[status!];

  return (
    <ShowFromMouse
      namespace={namespace}
      mask={mask}
      visible={!beforeHasMask}
      maskClosable={loading ? false : maskClosable}
      style={{ zIndex: nowZIndex, top: (cIndex * 20) / dpr, left: (cIndex * 20) / dpr }}
      contClassName={cls('m78-dialog', className)}
      className="m78-dialog_wrap"
      contStyle={{ ...style, maxWidth, padding: content ? 0 : '' }}
      show={show}
      onRemove={onRemove}
      onClose={onClose}
    >
      {status && (
        <div className="m78-dialog_status-warp">
          <Transition
            className="m78-dialog_status"
            alpha={false}
            toggle={show}
            type="slideLeft"
            config={config.slow}
          >
            <StatusIcon />
          </Transition>
        </div>
      )}
      {closeIcon && (
        <Button icon className="m78-dialog_close-icon" onClick={() => onClose()} size="small">
          <CloseOutlined />
        </Button>
      )}
      <Spin full show={loading} text="请稍后" />
      {content || renderDefault()}
    </ShowFromMouse>
  );
};

const api = createRenderApi<DialogProps>(_Dialog, {
  namespace: 'MODAL',
});

type Dialog = typeof _Dialog;

interface DialogWithApi extends Dialog {
  api: typeof api;
}

const Dialog: DialogWithApi = Object.assign(_Dialog, {
  api,
});

export default Dialog;
