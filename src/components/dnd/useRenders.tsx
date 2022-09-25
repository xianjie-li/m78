import { useDurationToggle } from 'm78/hooks';
import React from 'react';
import { Portal } from 'm78/portal';
import { Share } from './types';

export function useRenders(share: Share) {
  const { props, status, self } = share;
  const { dragFeedback } = props;

  /** 自定义dragFeedBack时，延迟到动画结束再将其卸载 */
  const dragging = useDurationToggle(status.dragging, dragFeedback ? 300 : 0);

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
