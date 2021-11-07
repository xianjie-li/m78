import React, { useEffect, useState } from 'react';

import 'm78/base';
import { ButtonPropsWithHTMLButton, Button } from 'm78/button';
import { Modal } from 'm78/modal';
import { Transition } from 'm78/transition';
import { config } from 'react-spring';
import { CloseOutlined, statusIcons } from 'm78/icon';
import { Spin } from 'm78/spin';
import { useFormState } from '@lxjx/hooks';

import cls from 'clsx';
import createRenderApi from '@lxjx/react-render-api';
import { Input, InputProps } from 'm78/input';
import { ModalBaseProps } from '../modal/types';

export interface DialogProps extends Omit<ModalBaseProps, 'children' | 'onClose'> {
  /** 内容区域的最大宽度, 默认为360 */
  maxWidth?: number | string;
  /** '提示' | 标题文本 */
  title?: string;
  /** 内容区域 */
  children?: React.ReactNode;
  /**
   * 默认的关闭按钮/确认按钮/右上角关闭按钮点击, 或触发了clickAway时
   * - 如果是通过确认按钮点击的，isConfirm为true
   * - prompt模式下，promptValue为用户输入的值
   * */
  onClose?(isConfirm?: boolean, promptValue?: string): void;
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
  /** true | 点击默认的确认按钮时，是否关闭弹窗 */
  confirmClose?: boolean;

  /** 自定义顶部内容，会覆盖title的配置 */
  header?: React.ReactNode;
  /** 自定义底部内容，与其他底部相关配置的优先级为 footer > btns > confirm、close */
  footer?: React.ReactNode;
  /** 通过配置设置按钮组 */
  btns?: (Pick<
    ButtonPropsWithHTMLButton,
    'color' | 'children' | 'onClick' | 'disabled' | 'icon'
  > & {
    text: string;
  })[];
  /** 内容区域class */
  contentClassName?: string;
  /** 头部区域class */
  headerClassName?: string;
  /** 脚部区域class */
  footerClassName?: string;

  /** 提示输入框模式, 通过onClose第二个参数接收值 */
  prompt?: boolean;
  /** 提示输入框的默认内容 */
  promptDefaultValue?: string;
  /** 透传给prompt输入框的props，与Input组件一致 */
  promptInputProps?: InputProps;
}

export interface DialogApi
  extends Omit<
    DialogProps,
    | 'children'
    | 'defaultShow'
    | 'show'
    | 'triggerNode'
    | 'mountOnEnter'
    | 'unmountOnExit'
    | 'onRemove'
    | 'onRemoveDelay'
  > {
  content: ModalBaseProps['children'];
}

const DialogBase: React.FC<DialogProps> = props => {
  const {
    flexBtn,
    maxWidth = 360,
    footer,
    header,
    title = '提示',
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
    clickAwayClosable,
    confirmClose = true,
    prompt,
    promptInputProps,
    promptDefaultValue = '',
    ...other
  } = props;

  /** 代理defaultShow/show/onChange, 实现对应接口 */
  const [show, setShow] = useFormState<boolean>(props, false, {
    defaultValueKey: 'defaultShow',
    triggerKey: 'onChange',
    valueKey: 'show',
  });

  /** prompt当前输入的值 */
  const [pmtVal, setPmtVal] = useState('');

  /** 在开启和关闭时还原prompt初始值 */
  useEffect(() => {
    if (show) {
      setPmtVal(promptDefaultValue);
    } else {
      setPmtVal('');
    }
  }, [show]);

  function onClose(isConfirm = false) {
    setShow(false);
    props.onClose?.(isConfirm, prompt ? pmtVal : undefined);
  }

  function renderDefaultFooter() {
    return (
      <>
        {close && (
          <Button onClick={() => onClose()}>{typeof close === 'string' ? close : '取消'}</Button>
        )}
        {confirm && (
          <Button
            color="primary"
            onClick={() => {
              confirmClose && onClose(true);
            }}
          >
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
        <div className={cls('m78-dialog_cont', contentClassName)}>
          {children}
          {prompt && (
            <div className="mt-8">
              <Input
                placeholder="请输入内容"
                autoFocus
                {...promptInputProps}
                value={pmtVal}
                onChange={setPmtVal}
                onPressEnter={() => onClose(true)}
              />
            </div>
          )}
        </div>
        <div className={cls('m78-dialog_footer', footerClassName, { __full: flexBtn })}>
          {footer || renderBtns() || renderDefaultFooter()}
        </div>
      </>
    );
  }

  const StatusIcon = statusIcons[status!];

  return (
    <Modal
      {...other}
      onClose={props.onClose as () => void}
      className={cls('m78-dialog m78-scroll-bar', className, prompt && '__prompt')}
      style={{ ...style, maxWidth }}
      clickAwayClosable={loading ? false : clickAwayClosable}
      show={show}
      onChange={nShow => setShow(nShow)}
    >
      {status && (
        <div className="m78-dialog_status-warp">
          <Transition
            className="m78-dialog_status"
            alpha={false}
            show={show}
            type="slideLeft"
            springProps={{
              config: config.slow,
            }}
          >
            <StatusIcon />
          </Transition>
        </div>
      )}
      {closeIcon && (
        <Button icon className="m78-dialog_close-icon" onClick={() => onClose()} size="small">
          <CloseOutlined className="m78-close-icon" />
        </Button>
      )}
      <Spin full show={loading} text="请稍后" />
      {renderDefault()}
    </Modal>
  );
};

const api = createRenderApi<DialogApi>(DialogBase, {
  namespace: 'DIALOG',
});

const baseApi: typeof api = ({ content, ...other }) => {
  return api({
    ...other,
    children: content,
    triggerNode: null,
  } as any);
};

type Dialog = typeof DialogBase;

interface DialogWithApi extends Dialog {
  api: typeof api;
}

const Dialog: DialogWithApi = Object.assign(DialogBase, {
  api: baseApi,
});

export default Dialog;
