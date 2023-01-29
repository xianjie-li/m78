import React from "react";
import { ensureArray, isFunction } from "@m78/utils";

import {
  IfProps,
  ToggleProps,
  SwitchProps,
  AsyncRenderProps,
} from "./types.js";
import { Button } from "../button/index.js";
import { Spin } from "../spin/index.js";
import { Result } from "../result/index.js";
import { Lay } from "../lay/index.js";
import { Size, Status, StatusIconError } from "../common/index.js";
import { IconDrafts } from "@m78/icons/icon-drafts.js";
import clsx from "clsx";
import { COMMON_NS, FORK_NS, Translation } from "../i18n/index.js";

const _AsyncRender: React.FC<AsyncRenderProps> = ({
  children,
  send,
  loading,
  error,
  timeout,
  hasData,
  forceRender,
  loadingFull,
  className,
  style,
  loadingText = "",
  emptyText = "",
  errorText = "",
  timeoutText = "",
  customLoading,
  customNotice,
  customEmpty,
}) => {
  const renderChild = () => (isFunction(children) ? children() : children);

  const errorNode = errorText || (
    <Translation ns={FORK_NS}>{(t) => t("error")}</Translation>
  );
  const timeoutNode = timeoutText || (
    <Translation ns={FORK_NS}>{(t) => t("timeout")}</Translation>
  );

  // 重试按钮
  const reloadBtn = send ? (
    <Button
      onClick={send}
      color="primary"
      text
      size="small"
      style={{ top: -1 /* 视觉居中 */ }}
    >
      <Translation ns={FORK_NS}>{(t) => t("reload")}</Translation>
    </Button>
  ) : null;

  const feedbackNode = renderForks();

  function renderForks() {
    if (loading) {
      return (
        customLoading || (
          <Spin
            text={
              loadingText || (
                <Translation ns={FORK_NS}>{(t) => t("loading")}</Translation>
              )
            }
            className="ptb-12"
            full={loadingFull}
          />
        )
      );
    }

    if (error || timeout) {
      const title = timeout ? timeoutNode : errorNode;
      const msg = error?.message || (typeof error === "string" ? error : "");

      return customNotice ? (
        customNotice(title, msg)
      ) : (
        <Lay
          status={Status.error}
          leading={<StatusIconError />}
          crossAlign="start"
          title={title}
          effect={false}
          desc={
            <div>
              {msg && <div className="color-error">{msg}</div>}
              <div style={{ padding: "8px 0 4px" }}>
                {/* 这里直接使用 t(cond ? a : b) 做国际化在线上环境会失效, why? */}
                {send ? (
                  <Translation ns={FORK_NS}>
                    {(t) => t("retry tip with button")}
                  </Translation>
                ) : (
                  <Translation ns={FORK_NS}>
                    {(t) => t("retry tip")}
                  </Translation>
                )}

                {reloadBtn}
              </div>
            </div>
          }
        />
      );
    }

    if (!hasData && !loading) {
      return (
        customEmpty || (
          <Result
            size={Size.small}
            icon={<IconDrafts className="color-disabled" />}
            desc={
              emptyText || (
                <Translation ns={COMMON_NS}>{(t) => t("empty")}</Translation>
              )
            }
            style={{ padding: 0 }}
            actions={reloadBtn}
          />
        )
      );
    }
  }

  function renderFeedback() {
    return (
      <div className={clsx("m78 m78-fork", className)} style={style}>
        {feedbackNode}
      </div>
    );
  }

  return (
    <>
      {(!feedbackNode || forceRender) && renderChild()}
      {feedbackNode && renderFeedback()}
    </>
  );
};

/* 根据条件渲染或卸载内部的组件 */
const _If: React.FC<IfProps> = ({ when, children }) => {
  when = !!when;
  const isFuncChild = isFunction(children);
  return when && (isFuncChild ? children() : children);
};

/**
 * 显示或隐藏内容
 *
 * 组件内部通过设置 display: 'none' 隐藏元素，如果子节点不是 ReactElement，会被包裹在一个 div 中
 *  */
const _Toggle = ({ when, children }: ToggleProps): React.ReactElement => {
  function hideChild() {
    const hideProps = { display: "none" };

    // 克隆并返回一个reactElement的隐藏版本(需要其支持style参数)
    const hideReactElement = (rEl: React.ReactElement, key?: any) =>
      React.cloneElement(rEl, {
        key,
        style: { ...rEl.props.style, ...hideProps },
      });

    if (React.isValidElement(children)) {
      return hideReactElement(children);
    }

    return <div style={hideProps}>{children}</div>;
  }

  return when ? children : (hideChild() as any);
};

/* 搭配If或Toggle使用, 只渲染内部的第一个when为true的If/Toggle, 所有项的when都未命中时,匹配第一个非If/Toggle的元素 */
const _Switch: React.FC<SwitchProps> = ({ children }) => {
  const arrChild: React.ReactElement[] = ensureArray(children);

  let lastNotWhen: React.ReactElement | null = null;

  for (const child of arrChild) {
    const isBuiltType = child.type === _If || child.type === _Toggle;

    if (!isBuiltType && lastNotWhen === null) {
      lastNotWhen = child;
      continue;
    }

    const open = !!child.props.when;

    if (open) {
      return child;
    }
  }

  return lastNotWhen;
};

_AsyncRender.displayName = "AsyncRender";
_If.displayName = "If";
_Toggle.displayName = "Toggle";
_Switch.displayName = "Switch";

export { _If, _Switch, _Toggle, _AsyncRender };
