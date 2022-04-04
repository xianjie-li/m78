import React, { useMemo } from 'react';
import { Overlay, OverlayDirection, OverlayProps } from 'm78/overlay';
import { Size, Z_INDEX_MESSAGE } from 'm78/common';
import clsx from 'clsx';
import { Button } from 'm78/button';
import { Row } from 'm78/layout';
import { WarningIcon } from 'm78/icon';
import { useFormState } from '@lxjx/hooks';
import { isBoolean, omit } from '@lxjx/utils';
import { UseTriggerType } from 'm78/hooks';
import { BubbleProps, BubbleType, omitBubbleOverlayProps } from './types';

const defaultProps: Partial<BubbleProps> = {
  type: BubbleType.tooltip,
  cancelText: '取消',
  confirmText: '确认',
  childrenAsTarget: true,
  zIndex: Z_INDEX_MESSAGE,
  namespace: 'BUBBLE',
  lockScroll: false,
  direction: OverlayDirection.top,
  arrow: true,
  autoFocus: false,
};

const _Bubble = (props: BubbleProps) => {
  const { title, type, onConfirm, cancelText, confirmText, icon, ...other } = props;

  const overlayProps = useMemo(() => {
    return omit<OverlayProps>(other, omitBubbleOverlayProps as any);
  }, [props]);

  // 在不同类型下使用不同的mountOnEnter/unmountOnExit默认值
  const [mount, unmount] = useMemo(() => {
    let m: boolean = true;
    let unm: boolean = false;
    // 提示和确认框使用时渲染, 不用时卸载
    if (type === BubbleType.tooltip || type === BubbleType.confirm) {
      m = true;
      unm = true;
    }

    if (isBoolean(props.mountOnEnter)) m = props.mountOnEnter;
    if (isBoolean(props.unmountOnExit)) unm = props.unmountOnExit;

    return [m, unm];
  }, [type, props.mountOnEnter, props.unmountOnExit]);

  // 在不同类型下使用不同的triggerType默认值
  const triggerType = useMemo(() => {
    let t: OverlayProps['triggerType'] =
      type === BubbleType.tooltip ? UseTriggerType.active : UseTriggerType.click;

    if (props.triggerType !== undefined) t = props.triggerType;

    return t;
  }, [type, props.triggerType]);

  const [show, setShow] = useFormState<boolean>(props, false, {
    defaultValueKey: 'defaultShow',
    triggerKey: 'onChange',
    valueKey: 'show',
  });

  function render() {
    if (type === BubbleType.tooltip) return props.content;

    if (type === BubbleType.confirm) {
      return (
        <div>
          <Row crossAlign="start">
            {icon || <WarningIcon className="fs-24 mr-8" />}
            {props.content}
          </Row>
          <Row className="m78-bubble_confirm-btn" mainAlign="end">
            <Button size={Size.small} onClick={() => setShow(false)}>
              {cancelText}
            </Button>
            <Button
              size={Size.small}
              color="primary"
              onClick={() => {
                onConfirm?.();
                setShow(false);
              }}
            >
              {confirmText}
            </Button>
          </Row>
        </div>
      );
    }

    return (
      <>
        {title && <div className="m78-bubble_title">{title}</div>}
        <div className="m78-bubble_cont">{props.content}</div>
      </>
    );
  }

  return (
    <Overlay
      {...overlayProps}
      triggerType={triggerType}
      className={clsx('m78-init m78-bubble', `__${type}`, props.className)}
      content={render()}
      show={show}
      onChange={setShow}
      mountOnEnter={mount}
      unmountOnExit={unmount}
    />
  );
};

_Bubble.defaultProps = defaultProps;

export { _Bubble };
