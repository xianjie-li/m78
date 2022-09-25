import React, { useMemo } from 'react';
import { CloseOutlined, ErrorIcon, SuccessIcon, WarningIcon } from 'm78/icon';
import { MASK_NAMESPACE, Size, Status } from 'm78/common';
import { Spin } from 'm78/spin';
import { isArray, isFunction, pick } from '@lxjx/utils';
import createRenderApi from '@m78/render-api';
import { useSpring, animated, config } from 'react-spring';
import { If } from 'm78/fork';
import { Button } from 'm78/button';
import { useOverlaysMask } from 'm78/overlay';
import { Transition } from 'm78/transition';
import { Portal } from 'm78/portal';
import { useMeasure } from '@lxjx/hooks';
import { _Share, LoadingOption, NotifyPosition, NotifyProps, NotifyState } from './type';
import { initTransition, useFixPad, useInteractive, useToggleController } from './common';

const keys = Object.keys(NotifyPosition);

/**
 * 容器, 分类不同方向的notify并在对应方向渲染
 * */
export function NotifyWrap({ children = [] }: { children: JSX.Element[] }) {
  const lists = useMemo(() => {
    const map: { [key in NotifyPosition]: JSX.Element[] } = {} as any;

    children.forEach(item => {
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
    key =>
      lists[key as NotifyPosition]?.length && (
        <div key={key} className={`m78-notify_container m78-notify_${key}`}>
          {lists[key as NotifyPosition]}
        </div>
      ),
  );
}

/**
 * 实现组件
 * */
export function Notify(props: NotifyProps) {
  const {
    status,
    content,
    show,
    cancel,
    loading = false,
    duration = 1200,
    position = NotifyPosition.center,
  } = props;

  // 此区间内视为有效duration
  const hasDuration = duration < 1000000;

  const [bound, ref] = useMeasure<HTMLDivElement>();

  const [{ process, ...styles }, api] = useSpring(() => ({
    ...initTransition,
    config: config.stiff,
  }));

  const share: _Share = {
    hasDuration,
    duration,
    position,
    show,
    api,
    props,
    bound,
  };

  /**
   * 显示/隐藏相关行为控制
   * */
  const dShow = useToggleController(share);

  /**
   * 根据是否开启了关闭按钮动态设置偏移, 防止其遮挡文字
   * */
  const [fixPad, fixPadIcon] = useFixPad(share);

  /**
   * 所有启用了mask的overlay
   * */
  const overlaysMask = useOverlaysMask({
    enable: dShow && props.mask,
  });

  /**
   * 处理props.interactive
   * */
  const interactive = useInteractive(share);

  function render() {
    if (isFunction(content)) {
      return (
        <div ref={ref} className="m78-notify_custom">
          {content()}
        </div>
      );
    }

    return (
      <div ref={ref} className="m78-notify_item-main m78-notify_normal">
        <Spin show={loading} full inline size={Size.small} text="" />

        <If when={status}>
          <div className="m78-notify_normal_leading">
            {status === Status.success && <SuccessIcon />}
            {status === Status.error && <ErrorIcon />}
            {status === Status.warning && <WarningIcon />}
          </div>
        </If>

        <div className="m78-notify_normal_cont">
          {props.title && (
            <div className="m78-notify_normal_title" style={fixPad.title}>
              {props.title}
            </div>
          )}
          {props.content && <div style={fixPad.cont}>{props.content}</div>}
          {props.actions && <div className="m78-notify_normal_actions">{props.actions(props)}</div>}
        </div>

        <If when={hasDuration}>
          {() => (
            <animated.div
              style={{ width: process ? process.to(x => `${x.toFixed(2)}%`) : 0 }}
              className="m78-notify_process"
            />
          )}
        </If>

        <If when={cancel}>
          <Button
            icon
            size="mini"
            className="m78-notify_close-btn"
            style={fixPadIcon}
            onClick={() => props.onChange(false)}
          >
            <CloseOutlined className="m78-close-icon" style={{ fontSize: 12 }} />
          </Button>
        </If>
      </div>
    );
  }

  return (
    <>
      <Portal namespace={MASK_NAMESPACE}>
        <Transition
          show={dShow && overlaysMask.isFirst}
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
  component: Notify,
  wrap: NotifyWrap,
  namespace: 'm78-notify',
});

/** 简单的loading实现 */
export function _loading(opt: LoadingOption = {}) {
  const o = pick(opt, ['position', 'mask', 'minDuration', 'content']) as any;
  return _notify.render({
    minDuration: 700,
    ...o,
    duration: Infinity,
    content: () => <Spin text={opt.content} />,
  });
}
