import React, { useMemo } from 'react';

import '@lxjx/flicker/lib/base';
import ShowFromMouse from '@lxjx/flicker/lib/show-from-mouse';
import Button, { ButtonProps } from '@lxjx/flicker/lib/button';
import { Transition } from '@lxjx/react-transition-spring';
import { config } from 'react-spring';
import Icon from '@lxjx/flicker/lib/icon';
import Spin from '@lxjx/flicker/lib/spin';
import { dumpFn } from '@lxjx/flicker/lib/util';
import { useZIndex } from '@lxjx/flicker/lib/hooks';

import createRenderApi, {
  ReactRenderApiProps,
} from '@lxjx/react-render-api';

import cls from 'classnames';
import { ComponentBaseProps } from '../types/types';


export interface ModalProps extends ReactRenderApiProps, ComponentBaseProps {
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
  btns?: (Pick<ButtonProps, 'color' | 'children' | 'onClick' | 'disabled' | 'icon' | 'link'> & { text: string })[];
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
  /** 设置modal的状态 */
  status?: 'success' | 'error' | 'warning';
  /** 内容区域class */
  contentClassName?: string;
  /** 头部区域class */
  headerClassName?: string;
  /** 脚部区域class */
  footerClassName?: string;
}

const _Modal: React.FC<ModalProps> = ({
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
  const [zIndex, diff] = useZIndex('modal_zIndex', 1800, !!show);
  const dpr = useMemo(() => window.devicePixelRatio || 1, []);

  function renderDefaultFooter() {
    return (
      <>
        {close && <Button onClick={() => onClose()}>{typeof close === 'string' ? close : '取消'}</Button>}
        {confirm && <Button color="primary" onClick={() => onConfirm()}>{typeof confirm === 'string' ? confirm : '确认'}</Button>}
      </>
    );
  }

  function renderBtns() {
    if (btns.length === 0) return null;
    return btns.map(({ text, ...btnProps }, key) => (
      <Button key={key} {...btnProps}>{text}</Button>
    ));
  }

  function renderDefault() {
    return (
      <>
        <div className={cls('fr-modal_title', headerClassName)}>
          {header || (
            <span>{title}</span>
          )}
        </div>
        <div className={cls('fr-modal_cont', contentClassName)}>{children}</div>
        <div className={cls('fr-modal_footer', footerClassName, { __full: flexBtn })}>
          {footer || renderBtns() || renderDefaultFooter()}
        </div>
      </>
    );
  }

  return (
    <ShowFromMouse
      namespace={namespace}
      mask={mask}
      maskClosable={loading ? false : maskClosable}
      style={{ zIndex, top: diff * 20 / dpr, left: diff * 20 / dpr }}
      contClassName={cls('fr-modal', className)}
      className="fr-modal_wrap"
      contStyle={{ ...style, maxWidth, padding: content ? 0 : '' }}
      show={show}
      onRemove={onRemove}
      onClose={onClose}
    >
      {status && (
        <div className="fr-modal_status-warp">
          <Transition className="fr-modal_status" alpha={false} toggle={show} type="slideLeft" config={config.slow}>
            <Icon.SvgIcon type={status!} />
          </Transition>
        </div>
      )}
      {closeIcon && (
        <Button icon className="fr-modal_close-icon" onClick={() => onClose()} size="small">
          <Icon type="close" />
        </Button>
      )}
      <Spin full show={loading} text="请稍后" />
      {content || renderDefault()}
    </ShowFromMouse>
  );
};

const api = createRenderApi<ModalProps>(_Modal, {
  namespace: 'MODAL',
});

type Modal = typeof _Modal;

interface ModalWithApi extends Modal {
  api: typeof api;
}

const Modal: ModalWithApi = Object.assign(_Modal, {
  api,
});

export default Modal;
