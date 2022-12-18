import React, { useMemo } from "react";
import {
  MASK_NAMESPACE,
  Size,
  Status,
  statusIconMap,
} from "../common/index.js";
import { IconClose } from "@m78/icons/icon-close.js";
import { Spin } from "../spin/index.js";
import { isArray, isFunction, pick } from "@m78/utils";
import createRenderApi from "@m78/render-api";
import { animated, config, useSpring } from "react-spring";
import { Button } from "../button/index.js";
import { useOverlaysMask } from "../overlay/index.js";
import { Transition } from "../transition/index.js";
import { Portal } from "../portal/index.js";
import { useMeasure } from "@m78/hooks";
import {
  _Share,
  LoadingOption,
  NotifyPosition,
  NotifyProps,
  NotifyState,
} from "./types.js";
import {
  _notifyQuickerBuilder,
  _initTransition,
  _useFixPad,
  _useInteractive,
  _useToggleController,
} from "./common.js";

const keys = Object.keys(NotifyPosition);

/**
 * 容器, 分类不同方向的notify并在对应方向渲染
 * */
export function _NotifyWrap({ children = [] }: { children: JSX.Element[] }) {
  const lists = useMemo(() => {
    const map: { [key in NotifyPosition]: JSX.Element[] } = {} as any;

    children.forEach((item) => {
      const props: NotifyProps = item.props;
      const pos = props.position || NotifyPosition.center;

      if (!isArray(map[pos])) {
        map[pos] = [];
      }

      map[pos].push(item);
    });

    return map;
  }, [children]);

  return keys.map(
    (key) =>
      lists[key as NotifyPosition]?.length && (
        <div key={key} className={`m78-notify_container m78-notify_${key}`}>
          {lists[key as NotifyPosition]}
        </div>
      )
  );
}

/**
 * 实现组件
 * */
export function notify(props: NotifyProps) {
  const {
    status,
    content,
    open,
    cancel,
    loading = false,
    duration = 1200,
    position = NotifyPosition.center,
    customer,
  } = props;

  // 此区间内视为有效duration
  const hasDuration = duration < 1000000;

  const [bound, ref] = useMeasure<HTMLDivElement>();

  const [{ process, ...styles }, api] = useSpring(() => ({
    ..._initTransition,
    config: config.stiff,
  }));

  const share: _Share = {
    hasDuration,
    duration,
    position,
    open,
    api,
    props,
    bound,
  };

  /**
   * 显示/隐藏相关行为控制
   * */
  const dOpen = _useToggleController(share);

  /**
   * 根据是否开启了关闭按钮动态设置偏移, 防止其遮挡文字
   * */
  const [fixPad, fixPadIcon] = _useFixPad(share);

  /**
   * 所有启用了mask的overlay
   * */
  const overlaysMask = useOverlaysMask({
    enable: dOpen && props.mask,
  });

  /**
   * 处理props.interactive
   * */
  const interactive = _useInteractive(share);

  function render() {
    if (isFunction(customer)) {
      return (
        <div ref={ref} className="m78-notify_custom">
          {customer(props)}
        </div>
      );
    }

    const statusIcon = statusIconMap[status!];

    return (
      <div ref={ref} className="m78-notify_item-main m78-notify_normal">
        <Spin open={loading} full inline size={Size.small} />

        {statusIcon && (
          <div className="m78-notify_normal_leading">{statusIcon}</div>
        )}

        <div className="m78-notify_normal_cont">
          {props.title && (
            <div className="m78-notify_normal_title" style={fixPad.title}>
              {props.title}
            </div>
          )}
          {content && <div style={fixPad.cont}>{content}</div>}
          {props.actions && (
            <div className="m78-notify_normal_actions">
              {props.actions(props)}
            </div>
          )}
        </div>

        {hasDuration && (
          <animated.div
            style={{
              width: process ? process.to((x) => `${x.toFixed(2)}%`) : 0,
            }}
            className="m78-notify_process"
          />
        )}

        {cancel && (
          <Button
            icon
            size={Size.small}
            className="m78-notify_close-btn"
            style={fixPadIcon}
            onClick={() => props.onChange(false)}
          >
            <IconClose style={{ fontSize: 12 }} />
          </Button>
        )}
      </div>
    );
  }

  return (
    <>
      <Portal namespace={MASK_NAMESPACE}>
        <Transition
          open={dOpen && overlaysMask.isFirst}
          type="fade"
          className="m78 m78-mask"
          mountOnEnter
          unmountOnExit
        />
      </Portal>
      <animated.div
        style={styles}
        className="m78-notify_item"
        onMouseEnter={interactive.start}
        onMouseLeave={interactive.stop}
        onTouchStart={interactive.start}
        onTouchEnd={interactive.stop}
      >
        {render()}
      </animated.div>
    </>
  );
}

/** 创建api */
export const _notify = createRenderApi<NotifyState>({
  component: notify,
  wrap: _NotifyWrap,
  namespace: "m78-notify",
});

/** 简单的loading实现 */
export function _loading(content: React.ReactNode, opt: LoadingOption = {}) {
  const o = pick(opt, ["position", "mask", "minDuration"]) as any;
  return _notify.render({
    minDuration: 800,
    mask: true,
    ...o,
    duration: Infinity,
    customer: () => <Spin text={content} />,
  });
}

/** 快捷通知 */
const _notifyQuicker = _notifyQuickerBuilder();
const _notifyInfo = _notifyQuickerBuilder(Status.info);
const _notifySuccess = _notifyQuickerBuilder(Status.success);
const _notifyError = _notifyQuickerBuilder(Status.error);
const _notifyWarning = _notifyQuickerBuilder(Status.warning);

export const _quickers = {
  quicker: _notifyQuicker,
  info: _notifyInfo,
  error: _notifyError,
  success: _notifySuccess,
  warning: _notifyWarning,
};
