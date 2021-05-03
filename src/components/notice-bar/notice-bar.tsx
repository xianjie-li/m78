import React from 'react';
import { useMeasure, useUpdateEffect } from 'react-use';
import { useSpring, animated, config } from 'react-spring';
import { useFormState } from '@lxjx/hooks';

import { lineStatusIcons, CloseOutlined } from 'm78/icon';
import { If } from 'm78/fork';
import { Button } from 'm78/button';
import cls from 'clsx';
import { ComponentBaseProps, StatusKeys } from 'm78/types';

export interface NoticeBarProps extends ComponentBaseProps {
  /** 关闭回调 */
  onClose?(): void;
  /** true | 是否显示关闭按钮 */
  closable?: boolean;
  /** true | 是否显示, 与受控组件的value一样的行为，当传入后，将显示/隐藏状态交由用户处理 */
  show?: boolean;
  /** 提示信息 */
  message: React.ReactNode;
  /** 详细说明文本 */
  desc?: React.ReactNode;
  /** 状态 */
  status?: StatusKeys;
  /** 定位到元素最顶部 */
  fixedTop?: boolean;
  /** 替换右侧关闭图标的内容 */
  right?: React.ReactNode;
}

const NoticeBar: React.FC<NoticeBarProps> = ({
  closable = true,
  desc,
  message,
  status,
  fixedTop,
  right,
  className,
  style,
  ...props
}) => {
  const [ref, { height }] = useMeasure();
  const [show, setShow] = useFormState(props, true, {
    valueKey: 'show',
    triggerKey: 'onClose',
  });

  const [spStyle, set] = useSpring(() => ({
    height: 'auto' as number | string,
    config: { ...config.stiff, clamp: true },
  }));

  useUpdateEffect(() => {
    set({ height: show ? height + 36 : 0 }); // 24 = padding 8px * 2 + border 1px * 2 + 12px 下边距(填白)
    // eslint-disable-next-line
  }, [show, height]);

  const StatusIcon = lineStatusIcons[status!];

  return (
    <animated.div
      style={{ ...spStyle, ...style }}
      className={cls('m78-notice-bar', status && `__${status}`, { __fixed: fixedTop }, className)}
    >
      <div ref={ref} className="m78-notice-bar_wrap">
        <If when={status}>
          {() => (
            <div className="m78-notice-bar_left">
              <StatusIcon />
            </div>
          )}
        </If>
        <div className="m78-notice-bar_cont">
          <div className="m78-notice-bar_title ellipsis">{message}</div>
          <If when={desc}>
            <div className="m78-notice-bar_desc">{desc}</div>
          </If>
        </div>
        <div className="m78-notice-bar_right">
          {right}
          <If when={closable && !right}>
            <Button
              className="m78-notice-bar_close"
              icon
              size="mini"
              onClick={() => {
                setShow(false);
              }}
            >
              <CloseOutlined className="m78-close-icon" />
            </Button>
          </If>
        </div>
      </div>
    </animated.div>
  );
};

export default NoticeBar;
