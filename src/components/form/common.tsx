import React, { useMemo } from 'react';
import { isBoolean, isFunction } from '@lxjx/utils';
import { FieldProps, FieldRenderProps, LayoutCustomer, ListProps, RForm } from './types';
import { DirectionEnum, FullSizeEnum } from 'm78/common';
import clsx from 'clsx';
import { InfoCircleOutlined } from 'm78/icon';
import { Overlay, OverlayDirectionEnum } from 'm78/overlay';
import { UseTriggerTypeEnum } from 'm78/hooks';
import { Spin } from 'm78/spin';
import { VFieldLike } from '@m78/vform';

export const defaultFieldProps: Partial<FieldProps> = {
  changeKey: 'onChange',
  valueKey: 'value',
  getValueFromEvent: (e: any) => e?.target?.value || e,
  deps: [],
  layout: DirectionEnum.vertical,
  labelFixPad: 10,
  maxWidth: 440,
};

/**
 * 帮助快速的实现field的valid, hidden, disabled属性
 * */
export function useFieldStatus(
  v: any,
  init: boolean,
  other: {
    changeFlag: number;
    form: RForm;
    field: VFieldLike;
  },
) {
  const { changeFlag, form, field } = other;

  const deps = useMemo(() => {
    if (isBoolean(v)) {
      return [v, changeFlag];
    }
    return [changeFlag];
  }, [v, changeFlag]);

  return useMemo(() => {
    if (v === undefined) return init;
    if (isFunction(v)) return v(form, field);
    return v;
  }, deps);
}

/** 渲染默认的filed和list结构 */
export const defaultFieldRenderChildren: LayoutCustomer = (
  { fieldProps: props, field, innerRef, hidden, required }: FieldRenderProps,
  child: React.ReactElement,
) => {
  const paddingTop = props.layout === DirectionEnum.horizontal ? props.labelFixPad : undefined;
  const hasLabel = props.label !== undefined;
  const bubbleTips = props.bubbleTips;

  function renderRequired() {
    if (!required) return;
    return (
      <span className="m78-form_required" title="必填">
        *
      </span>
    );
  }

  function renderBubbleError() {
    if (!bubbleTips) return null;

    return (
      <Overlay
        className="m78-form_bubble"
        show={!hidden && field.touched && !!field.error}
        content={
          <div className="m78-form_bubble-error">
            <div className="m78-form_tips color-red fs-12">{field.error}</div>
          </div>
        }
        childrenAsTarget
        direction={OverlayDirectionEnum.rightStart}
        triggerType={UseTriggerTypeEnum.active}
        lockScroll={false}
        springProps={{
          immediate: true,
        }}
        clickAwayClosable={false}
      >
        <span className="m78-form_tip-trigger" />
      </Overlay>
    );
  }

  function renderBubbleExtra() {
    if (!bubbleTips || !props.extra) return null;
    return (
      <Overlay
        triggerType={UseTriggerTypeEnum.active}
        content={props.extra}
        direction={OverlayDirectionEnum.top}
        childrenAsTarget
        lockScroll={false}
        className="m78-form_bubble-extra"
      >
        <span className="m78-form_info">
          <InfoCircleOutlined />
        </span>
      </Overlay>
    );
  }

  return (
    <div
      ref={innerRef}
      className={clsx(`m78-form_field`, `__${props.layout}`, props.className)}
      style={{ ...props.style, maxWidth: props.maxWidth, display: hidden ? 'none' : undefined }}
    >
      {hasLabel && (
        <div className="m78-form_label" style={{ paddingTop }}>
          <span className="m78-form_label-text">{props.label}</span>
          {renderRequired()}
        </div>
      )}
      <div className="m78-form_cont">
        <div className="m78-form_main">
          <div className="m78-form_leading">{props.leading}</div>
          <div className="m78-form_widget">{child}</div>
          <div className="m78-form_trailing">
            {renderBubbleExtra()}
            {props.trailing}
            {!hasLabel && renderRequired()}
          </div>
          {renderBubbleError()}
        </div>
        <div className="m78-form_extra fs-12">{!bubbleTips && props.extra}</div>
        <div className="m78-form_tips color-red fs-12">
          {!bubbleTips && field.touched && field.error}
        </div>
      </div>
      <Spin size={FullSizeEnum.small} show={field.validating} full text={null} />
    </div>
  );
};

/** 用于从FieldProps中剔除所有组件自定义配置, 防止错误透传到vform中 */
export const omitFieldProps = (props: FieldProps | ListProps) => {
  const {
    valid,
    hidden,
    disabled,
    deps,
    changeKey,
    valueKey,
    getValueFromEvent,
    formatter,
    parser,
    onChange,
    children,
    bind: parentBind,
    label,
    extra,
    layout,
    field,
    className,
    style,
    ...other
  } = props;
  return other;
};
