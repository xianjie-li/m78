import { useDelayToggle } from '@lxjx/hooks';
import React from 'react';
import { Portal } from 'm78/portal';
import { Share } from './types';

export function useRenders(share: Share) {
  const { props, status, self } = share;
  const { dragFeedback } = props;

  /** 自定义dragFeedBack时，延迟到动画结束再将其卸载 */
  const dragging = useDelayToggle(status.dragging, 300, {
    leading: false,
    trailing: true,
    disabled: !dragFeedback,
  });

  /** 渲染用户自定义的dragFeedBack */
  function renderDragFeedback() {
    if (dragging && React.isValidElement(dragFeedback)) {
      return (
        <Portal namespace="DND">
          {React.cloneElement(dragFeedback, {
            ref: (node: HTMLElement | null) => (self.dragFeedbackEl = node),
          })}
        </Portal>
      );
    }
    return null;
  }

  return {
    renderDragFeedback,
  };
}
