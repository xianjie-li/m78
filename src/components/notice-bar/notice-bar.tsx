import React from 'react';
import { useMeasure, useUpdateEffect } from 'react-use';
import { useSpring, animated, config } from 'react-spring';
import { useFormState, formStateMap } from '@lxjx/hooks';

import Icon from '@lxjx/flicker/lib/icon';
import { If } from '@lxjx/flicker/lib/fork';
import Button from '@lxjx/flicker/lib/button';

import cls from 'classnames';

export interface NoticeBarProps {
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
  status?: 'success' | 'info' | 'warn' | 'error';
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
  ...props
}) => {
  const [ref, { height }] = useMeasure();
  const [show, setShow] = useFormState(formStateMap(props, { value: 'show', trigger: 'onClose' }), true);

  const [spStyle, set] = useSpring(() => ({ height: 'auto', config: { ...config.stiff, clamp: true } }));

  useUpdateEffect(() => {
    set({ height: show ? height + 36 : 0 }); // 24 = padding 8px * 2 + border 1px * 2 + 12px 下边距(填白)
    // eslint-disable-next-line
  }, [show, height]);

  return (
    <animated.div style={spStyle} className={cls('fr-notice-bar', status && `__${status}`, { __fixed: fixedTop })}>
      <div ref={ref} className="fr-notice-bar_wrap">
        <If when={status}>{() => (
          <div className="fr-notice-bar_left">
            <Icon type={status!} />
          </div>
        )}
        </If>
        <div className="fr-notice-bar_cont">
          <div className="fr-notice-bar_title ellipsis">{message}</div>
          <If when={desc}><div className="fr-notice-bar_desc">{desc}</div></If>
        </div>
        <div className="fr-notice-bar_right">
          {right}
          <If when={closable && !right}>
            <Button
              className="fr-notice-bar_close"
              icon
              size="mini"
              onClick={() => {
                setShow(false);
              }}
            >
              <Icon type="close" />
            </Button>
          </If>
        </div>
      </div>
    </animated.div>
  );
};

export default NoticeBar;
