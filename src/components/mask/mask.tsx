import React from 'react';

import { useUpdateEffect, useToggle } from 'react-use';
import { useLockBodyScroll } from '@lxjx/hooks';
import { Transition } from '@lxjx/react-transition-spring';

import Portal from '@lxjx/fr/portal';

import cls from 'classnames';

import { ReactRenderApiProps } from '@lxjx/react-render-api';
import { ComponentBaseProps } from '../types/types';

/* TODO: 编写一个新的弹窗辅助组件，管理显隐状态、弹窗位置、弹窗动画等 */

export interface MaskProps extends ComponentBaseProps, ReactRenderApiProps {
  /** 是否显示mask */
  mask?: boolean;
  /** true | 对mask进行可见性隐藏, 仍然触发事件 */
  visible?: boolean;
  /** true | 是否允许点击mask进行关闭 */
  maskClosable?: boolean;
  /** 800 | 当传入onRemove时，会对其进行代理，当show为false在指定延迟内调用onRemove */
  onRemoveDelay?: number;
  /** 360 | 默认会在mask出现时锁定body的滚动条防止页面抖动，此延迟用于恢复滚动条的延迟时间(应该根据动画时间给出一个合理的时间) */
  unlockDelay?: number;
  /** true | 是否以portal模式挂载到body下指定元素下 */
  portal?: boolean;
  /** 黑色主题 */
  dark?: boolean;
}

/**
 *  与RenderApi配合使用, 为弹层类组件提供mask并且支持代理RenderApi的部分操作
 *  mask层和内容是分开渲染的，否则mask的fade动画会影响到内容
 *  mask不会处理内容的动画、显示隐藏等，需要自行实现
 *  透传组件的ReactRenderApiProps到mask，使其能够在合适时机处理api内部方法的调用
 *  */
const Mask: React.FC<MaskProps> = ({
  mask = true,
  visible = true,
  maskClosable = true,
  show = false,
  onClose,
  onRemove,
  onRemoveDelay = 800,
  unlockDelay = 360,
  portal = true,
  className,
  style,
  children,
  namespace,
  dark,
}) => {
  const [lock, toggleLock] = useToggle(show);
  useLockBodyScroll(lock);

  useUpdateEffect(
    function removeInstance() {
      if (!show && onRemove) {
        setTimeout(onRemove!, onRemoveDelay);
      }
      if (show) toggleLock(true);
      if (!show) {
        setTimeout(() => {
          toggleLock(false);
        }, unlockDelay);
      }
      // eslint-disable-next-line
    },
    [show],
  );

  function render() {
    return (
      <div className={cls('fr-mask_wrap', className)} style={style}>
        {mask && (
          <div className="fr-mask_inner" style={{ opacity: visible ? 1 : 0 }}>
            <Transition
              onClick={maskClosable ? onClose : undefined}
              toggle={show}
              type="fade"
              className={cls('fr-mask-node', dark ? 'fr-mask-b' : 'fr-mask')}
              mountOnEnter
              unmountOnExit
            />
          </div>
        )}
        {children}
      </div>
    );
  }

  return portal ? <Portal namespace={namespace}>{render()}</Portal> : render();
};

export default Mask;
