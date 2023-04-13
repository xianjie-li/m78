import React, { useState } from "react";

import { Button } from "../button/index.js";
import { IconClose } from "@m78/icons/icon-close.js";
import { Spin } from "../spin/index.js";
import { useFormState } from "@m78/hooks";

import cls from "clsx";
import { isFunction, isString, omit } from "@m78/utils";
import {
  OverlayDragHandle,
  omitApiProps,
  Overlay,
  OverlayApiOmitKeys,
  OverlayInstance,
} from "../overlay/index.js";
import createRenderApi from "@m78/render-api";
import { DialogCloseHandle, DialogProps, DialogQuicker } from "./types.js";
import { Status, statusIconMap } from "../common/index.js";
import { COMMON_NS, DIALOG_NS, Translation } from "../i18n/index.js";

const defaultProps: Partial<DialogProps> = {
  width: 350,
  cancel: false,
  confirm: true,
  closeIcon: true,
  loading: false,
  namespace: "DIALOG",
  mask: true,
};

const _DialogBase = (props: DialogProps) => {
  const {
    width,
    title,
    cancel,
    confirm,
    closeIcon,
    loading,
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
    draggable,
    ...other
  } = props;

  // 和loading共同管理加载状态
  const [innerLoading, setInnerLoading] = useState(false);

  /** 代理defaultOpen/open/onChange, 实现对应接口 */
  const [open, setOpen] = useFormState<boolean>(props, false, {
    defaultValueKey: "defaultOpen",
    triggerKey: "onChange",
    valueKey: "open",
  });

  const closeHandle: DialogCloseHandle = async (isConfirm = false) => {
    if (!onClose) {
      setOpen(false);
      return;
    }

    const r = onClose(isConfirm);

    if (r === false) {
      return;
    }

    // 如果是promise like, 添加loading状态, 如果resolve false则关闭
    if (r instanceof Object && "then" in r && "catch" in r) {
      try {
        setInnerLoading(true);

        const ret = await r;

        if (ret === false) {
          return;
        }

        setOpen(false);
      } finally {
        setInnerLoading(false);
      }
      return;
    }

    setOpen(false);
  };

  function renderDefaultFooter() {
    return (
      <>
        {cancel && (
          <Button onClick={() => closeHandle()}>
            {isString(cancel) ? (
              cancel
            ) : (
              <Translation ns={[COMMON_NS]}>{(t) => t("cancel")}</Translation>
            )}
          </Button>
        )}
        {confirm && (
          <Button color="primary" onClick={() => closeHandle(true)}>
            {isString(confirm) ? (
              confirm
            ) : (
              <Translation ns={[COMMON_NS]}>{(t) => t("confirm")}</Translation>
            )}
          </Button>
        )}
      </>
    );
  }

  function renderDefault() {
    const cont = isFunction(content) ? content(closeHandle) : content;
    const _footer = isFunction(footer) ? footer(closeHandle) : footer;
    const _header = isFunction(header) ? header(closeHandle) : header;
    const statusIcon = statusIconMap[status!];

    return (
      <>
        {draggable && (
          <OverlayDragHandle>
            {(bind) => (
              <span {...bind()} className="m78-dialog_drag-handle"></span>
            )}
          </OverlayDragHandle>
        )}
        <div
          {...headerProps}
          className={cls("m78-dialog_title", headerProps?.className)}
        >
          {_header || (
            <span>
              {statusIcon && <span className="mr-4 vm">{statusIcon}</span>}
              <span className="vm">
                {title || (
                  <Translation ns={[DIALOG_NS]}>
                    {(t) => t("default title")}
                  </Translation>
                )}
              </span>
            </span>
          )}
        </div>
        <div
          {...contentProps}
          className={cls("m78-dialog_cont", contentProps?.className)}
        >
          {cont}
        </div>
        <div
          {...footerProps}
          className={cls("m78-dialog_footer", footerProps?.className, {
            __full: flexBtn,
          })}
        >
          {_footer || renderDefaultFooter()}
        </div>
      </>
    );
  }

  function render() {
    return (
      <>
        {closeIcon && (
          <Button
            icon
            className="m78-dialog_close-icon"
            onClick={() => closeHandle()}
            size="small"
          >
            <IconClose />
          </Button>
        )}
        <Spin full open={innerLoading || loading} text="请稍候" />
        {renderDefault()}
      </>
    );
  }

  return (
    <Overlay
      {...other}
      className={cls("m78 m78-init m78-dialog m78-scroll-bar", className)}
      style={{ width, ...style }}
      clickAwayClosable={loading ? false : clickAwayClosable}
      open={open}
      onChange={(nOpen) => {
        nOpen ? setOpen(nOpen) : closeHandle();
      }}
      content={render()}
    />
  );
};

_DialogBase.defaultProps = defaultProps;
_DialogBase.displayName = "Dialog";

/** 创建全局api */
const api = createRenderApi<
  Omit<DialogProps, OverlayApiOmitKeys>,
  OverlayInstance
>({
  component: _DialogBase,
  defaultState: {
    mountOnEnter: true,
    unmountOnExit: true, // api用法默认卸载
  },
  omitState: (state) => omit(state, omitApiProps as any),
});

/** 生成便捷提示api */
const dialogQuickerBuilder = (
  status?: DialogProps["status"]
): DialogQuicker => {
  return (content, title, cancel) => {
    return new Promise((resolve, reject) => {
      api.render({
        status,
        content,
        title,
        cancel,
        onClose(isConfirm) {
          isConfirm ? resolve() : reject();
        },
      });
    });
  };
};

const _Dialog = Object.assign(_DialogBase, api, {
  quicker: dialogQuickerBuilder(),
  info: dialogQuickerBuilder(Status.info),
  error: dialogQuickerBuilder(Status.error),
  success: dialogQuickerBuilder(Status.success),
  warning: dialogQuickerBuilder(Status.warning),
});

export { _Dialog };
