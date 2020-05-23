import React, { useState, useEffect } from 'react';

import { animated, config, useSpring } from 'react-spring';

import Portal from '@lxjx/fr/lib/portal';
import { CloseOutlined, statusIcons } from '@lxjx/fr/lib/icon';
import Spin from '@lxjx/fr/lib/spin';
import { If, Toggle } from '@lxjx/fr/lib/fork';
import { useMeasure } from 'react-use';
import { Transition } from '@lxjx/react-transition-spring';

import cls from 'classnames';

import { useSelf } from '@lxjx/hooks';
import Button from '@lxjx/fr/lib/button';
import { MessageProps } from './type';

function MessageWrap({ children }: any) {
  return (
    <div className="fr-message">
      <div className="fr-message_cont">{children}</div>
    </div>
  );
}

const Message: React.FC<MessageProps> = ({
  content,
  duration = 600,
  mask = false,
  type,
  loading = false,
  hasCancel,
  show = true,
  onClose,
  onRemove,
  loadingDelay = 300,
}) => {
  const self = useSelf({
    showTimer: null as any,
    hideTimer: null as any,
    lastShowTime: 0,
  });

  const [{ life, ...springProp }, set] = useSpring(() => ({
    opacity: 0,
    height: 0,
    transform: 'scale3d(0, 0, 0)',
    life: 100,
    config: { ...config.stiff },
  }));

  const [maskShow, setMaskShow] = useState(mask);

  const [bind, { height }] = useMeasure();

  /* 元素显示&隐藏 */
  useEffect(() => {
    if (!show) {
      // 延迟时间未达到loadingDelay时间的话延迟关闭
      const diff = Date.now() - self.lastShowTime;

      // +300ms的动画补正时间
      self.hideTimer = setTimeout(close, loading && diff > 0 ? diff + loadingDelay + 300 : 0);

      return;
    }

    if (height && show) {
      self.showTimer = setTimeout(
        () => {
          self.lastShowTime = Date.now();
          set({
            // @ts-ignore
            to: async next => {
              await next({
                // height + 内外边距
                opacity: 1,
                height: height + (hasCancel ? 60 : 36),
                life: 100,
                transform: 'scale3d(1, 1 ,1)',
              });
              await next({
                opacity: 1,
                life: 0,
                config: { duration }, // 减去初始动画的持续时间
              });
              close();
            },
          });
        },
        loading ? loadingDelay : 0,
      );
    }

    return () => {
      self.showTimer && clearTimeout(self.showTimer);
      self.hideTimer && clearTimeout(self.hideTimer);
    };
    // eslint-disable-next-line
  }, [show, height]);

  function close() {
    set({
      // @ts-ignore
      to: async next => {
        setMaskShow(false);
        await next({
          opacity: 0,
          height: 0,
          config: config.stiff,
        });
      },
      onRest() {
        onRemove && onRemove();
      },
    });
  }

  const StatusIcon = statusIcons[type || 'success'];

  return (
    <animated.div style={springProp} className="fr-message_item">
      <Portal>
        <Transition className="fr-mask" toggle={maskShow} type="fade" mountOnEnter unmountOnExit />
      </Portal>
      <div
        ref={bind}
        className={cls('fr-message_item-cont', { __loading: loading, __notification: hasCancel })}
      >
        <If when={hasCancel}>
          {() => (
            <Button onClick={onClose} className="fr-message_close" icon size="small">
              <CloseOutlined />
            </Button>
          )}
        </If>
        <Toggle when={type && !loading}>
          <div className="fr-message_icon">
            <StatusIcon />
          </div>
        </Toggle>
        <If when={loading}>
          <div className="fr-message_loading">
            <Spin show loadingDelay={0} text={content} />
          </div>
        </If>
        <If when={!loading}>
          <span>{content}</span>
        </If>
        <If when={!loading && duration < 1000000}>
          {() => (
            <animated.div
              style={{ width: life ? life.interpolate(x => `${x.toFixed(2)}%`) : 0 }}
              className="fr-message_process"
            />
          )}
        </If>
      </div>
    </animated.div>
  );
};

export { MessageWrap };
export default Message;
