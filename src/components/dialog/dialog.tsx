import React, { useState } from 'react';

import 'm78/init';
import { Button } from 'm78/button';
import { Transition } from 'm78/transition';
import { config } from 'react-spring';
import { CloseOutlined, statusIcons } from 'm78/icon';
import { Spin } from 'm78/spin';
import { useFormState } from '@lxjx/hooks';

import cls from 'clsx';
import { isString, omit } from '@lxjx/utils';
import { omitApiProps, Overlay, OverlayApiOmitKeys, OverlayInstance } from 'm78/overlay';
import createRenderApi from '@m78/render-api';
import { DialogProps } from './types';

const defaultProps: Partial<DialogProps> = {
  width: 360,
  title: '提示',
  close: false,
  confirm: '确认',
  closeIcon: true,
  loading: false,
  btnList: [],
  namespace: 'DIALOG',
  mask: true,
};

const DialogBase = (props: DialogProps) => {
  const {
    width,
    title,
    close,
    confirm,
    closeIcon,
    loading,
    btnList,
    flexBtn,
    footer,
    header,
    content,
    status,
    contentProps,
    footerProps,
    headerProps,
    className,
    style,
    clickAwayClosable,
    onClose,
    ...other
  } = props;

  // 和loading共同管理加载状态
  const [innerLoading, setInnerLoading] = useState(false);

  /** 代理defaultShow/show/onChange, 实现对应接口 */
  const [show, setShow] = useFormState<boolean>(props, false, {
    defaultValueKey: 'defaultShow',
    triggerKey: 'onChange',
    valueKey: 'show',
  });

  async function closeHandle(isConfirm = false) {
    if (!onClose) {
      setShow(false);
      return;
    }

    const r = onClose(isConfirm);

    if (r === false) {
      return;
    }

    // 如果是promise like, 添加loading状态, 如果resolve false则关闭
    if (r instanceof Object && 'then' in r && 'catch' in r) {
      try {
        setInnerLoading(true);

        const ret = await r;

        if (ret === false) {
          return;
        }

        setShow(false);
      } finally {
        setInnerLoading(false);
      }
      return;
    }

    setShow(false);
  }

  function renderDefaultFooter() {
    return (
      <>
        {close && <Button onClick={() => closeHandle()}>{isString(close) ? close : '取消'}</Button>}
        {confirm && (
          <Button color="primary" onClick={() => closeHandle(true)}>
            {isString(confirm) ? confirm : '确认'}
          </Button>
        )}
      </>
    );
  }

  function renderBtns() {
    if (btnList!.length === 0) return null;
    return btnList!.map((btnProps, key) => <Button key={key} {...btnProps} />);
  }

  function renderDefault() {
    return (
      <>
        <div {...headerProps} className={cls('m78-dialog_title', headerProps?.className)}>
          {header || <span>{title}</span>}
        </div>
        <div {...contentProps} className={cls('m78-dialog_cont', contentProps?.className)}>
          {content}
        </div>
        <div
          {...footerProps}
          className={cls('m78-dialog_footer', footerProps?.className, { __full: flexBtn })}
        >
          {footer || renderBtns() || renderDefaultFooter()}
        </div>
      </>
    );
  }

  const StatusIcon = statusIcons[status!];

  return (
    <Overlay
      {...other}
      className={cls('m78 m78-init m78-dialog m78-scroll-bar', className)}
      style={{ width, ...style }}
      clickAwayClosable={loading ? false : clickAwayClosable}
      show={show}
      onChange={nShow => {
        nShow ? setShow(nShow) : closeHandle();
      }}
      content={
        <>
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
            <Button
              icon
              className="m78-dialog_close-icon"
              onClick={() => closeHandle()}
              size="small"
            >
              <CloseOutlined className="m78-close-icon" />
            </Button>
          )}
          <Spin full show={innerLoading || loading} text="请稍候" />
          {renderDefault()}
        </>
      }
    />
  );
};

DialogBase.defaultProps = defaultProps;

const api = createRenderApi<Omit<DialogProps, OverlayApiOmitKeys>, OverlayInstance>({
  component: DialogBase,
  defaultState: {
    mountOnEnter: true,
    unmountOnExit: true,
  },
  omitState: state => omit(state, omitApiProps as any),
});

const _Dialog = Object.assign(DialogBase, api);

export { _Dialog };
