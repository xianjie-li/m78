import React from 'react';

import { useUpdateEffect, useLockBodyScroll } from 'react-use';
import { Transition } from '@lxjx/react-transition-spring';

import Portal from '@lxjx/flicker/lib/portal';

import cls from 'classnames';

import { ReactRenderApiProps } from '@lxjx/react-render-api';
import { ComponentBaseProps } from '@/components/types/types';

export interface MaskProps extends ComponentBaseProps, ReactRenderApiProps {
  /** 是否显示mask */
  mask?: boolean;
  /** 是否允许点击mask进行关闭 */
  maskClosable?: boolean;
  /** 当传入onRemove时，会对其进行代理，当show为false在指定延迟内调用onRemove */
  onRemoveDelay?: number;
  /** 是否以portal模式挂载到body下指定元素下 */
  portal?: boolean;
  /** 传递给Portal */
  namespace?: string;
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
  maskClosable = true,
  show = false,
  onClose,
  onRemove,
  onRemoveDelay = 800,
  portal = true,
  className,
  style,
  children,
  namespace,
  dark,
}) => {
  useLockBodyScroll(show);

  useUpdateEffect(function removeInstance() {
    if (!show && onRemove) {
      setTimeout(onRemove!, onRemoveDelay);
    }
    // eslint-disable-next-line
  }, [show]);

  function render() {
    return (
      <div className="fr-mask-wrap">
        {mask && (
          <Transition
            onClick={maskClosable ? onClose : undefined}
            toggle={show}
            type="fade"
            className={cls(dark ? 'fr-mask-b' : 'fr-mask', className)}
            style={style}
            mountOnEnter
            unmountOnExit
          />
        )}
        {children}
      </div>
    );
  }

  return (
    portal
      ? (
        <Portal namespace={namespace}>
          {render()}
        </Portal>
      )
      : render()
  );
};

export default Mask;
