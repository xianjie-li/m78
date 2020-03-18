import React, {
  useState, useEffect,
} from 'react';

import {
  animated, config, useSpring,
} from 'react-spring';

import Portal from '@lxjx/fr/lib/portal';
import Icon from '@lxjx/fr/lib/icon';
import Spin from '@lxjx/fr/lib/spin';
import { If, Toggle } from '@lxjx/fr/lib/fork';
import { useMeasure } from 'react-use';
import { Transition } from '@lxjx/react-transition-spring';

import cls from 'classnames';

import { MessageProps } from './type';

function MessageWrap({ children }: any) {
  return (
    <div className="fr-message">
      <div className="fr-message_cont">
        {children}
      </div>
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
}) => {
  const [{ life, ...springProp }, set] = useSpring(() => ({
    opacity: 0, height: 0, transform: 'scale3d(0, 0, 0)', life: 100, config: { ...config.wobbly },
  }));
  const [maskShow, setMaskShow] = useState(mask);
  const [bind, { height }] = useMeasure();
  /* 元素显示&隐藏 */
  useEffect(() => {
    if (!show) {
      close();
      return;
    }

    if (show && height) {
      set({
        // @ts-ignore
        to: async (next) => {
          await next({
            // height + 内外边距
            opacity: 1, height: height + (hasCancel ? 60 : 32), life: 100, transform: 'scale3d(1, 1 ,1)',
          });
          await next({
            opacity: 1, life: 0, config: { duration }, // 减去初始动画的持续时间
          });
          close();
        },
      });
    }
    // eslint-disable-next-line
   }, [show, height]);

  function close() {
    set({
      // @ts-ignore
      to: async (next) => {
        setMaskShow(false);
        await next({
          opacity: 0, height: 0, config: config.stiff,
        });
      },
      onRest() {
        onRemove && onRemove();
      },
    });
  }

  return (
    <animated.div style={springProp} className="fr-message_item">
      <Portal>
        <Transition className="fr-mask" toggle={maskShow} type="fade" mountOnEnter unmountOnExit />
      </Portal>
      <div ref={bind} className={cls('fr-message_item-cont', { __loading: loading, __notification: hasCancel })}>
        <If when={hasCancel}>
          {() => (
            <Icon onClick={onClose} className="fr-message_close" size={20} type="close" />
          )}
        </If>
        <Toggle when={type && !loading}>
          <div>
            <Icon.SvgIcon type={type || 'success'} />
          </div>
        </Toggle>
        <If when={loading}>
          <div className="fr-message_loading">
            <Spin inline show text={content} />
          </div>
        </If>
        <If when={!loading}>
          <span>{content}</span>
        </If>
        <If when={!loading && duration < 1000000}>
          {() => (
            <animated.div style={{ width: life ? life.interpolate((x) => `${x.toFixed(2)}%`) : 0 }} className="fr-message_process" />
          )}
        </If>
      </div>
    </animated.div>
  );
};

export {
  MessageWrap,
};
export default Message;
