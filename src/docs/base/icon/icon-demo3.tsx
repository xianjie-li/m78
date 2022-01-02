import React from 'react';
import {
  EmptyIcon,
  SuccessIcon,
  WarningIcon,
  ErrorIcon,
  NotAuthIcon,
  NotFoundIcon,
  ServerErrorIcon,
  WindmillIcon,
  WaitingIcon,
} from 'm78/icon';

import { message } from 'm78/message';

const IconDemo2 = () => {
  function copyToClipboard(text: string) {
    if (!('clipboard' in navigator)) {
      message.tips({
        type: 'error',
        content: `sorry! 你的浏览器不支持navigator.clipboard API`,
      });
      return;
    }

    navigator.clipboard.writeText(text).then(() => {
      message.tips({
        type: 'success',
        content: `复制成功: <${text} />`,
      });
    });
  }

  return (
    <div className="doc-wrap">
      <span className="d-icon-view-item __svg" onClick={() => copyToClipboard('SuccessIcon')}>
        <SuccessIcon />
        <div className="d-icon-view-item_text ellipsis">SuccessIcon</div>
      </span>
      <span className="d-icon-view-item __svg" onClick={() => copyToClipboard('ErrorIcon')}>
        <ErrorIcon />
        <div className="d-icon-view-item_text ellipsis">ErrorIcon</div>
      </span>
      <span className="d-icon-view-item __svg" onClick={() => copyToClipboard('WarningIcon')}>
        <WarningIcon />
        <div className="d-icon-view-item_text ellipsis">WarningIcon</div>
      </span>
      <span className="d-icon-view-item __svg" onClick={() => copyToClipboard('WaitingIcon')}>
        <WaitingIcon />
        <div className="d-icon-view-item_text ellipsis">WaitingIcon</div>
      </span>
      <span className="d-icon-view-item __svg" onClick={() => copyToClipboard('EmptyIcon')}>
        <EmptyIcon />
        <div className="d-icon-view-item_text ellipsis">EmptyIcon</div>
      </span>
      <span className="d-icon-view-item __svg" onClick={() => copyToClipboard('NotAuthIcon')}>
        <NotAuthIcon />
        <div className="d-icon-view-item_text ellipsis">NotAuthIcon</div>
      </span>
      <span className="d-icon-view-item __svg" onClick={() => copyToClipboard('NotFoundIcon')}>
        <NotFoundIcon />
        <div className="d-icon-view-item_text ellipsis">NotFoundIcon</div>
      </span>
      <span className="d-icon-view-item __svg" onClick={() => copyToClipboard('ServerErrorIcon')}>
        <ServerErrorIcon />
        <div className="d-icon-view-item_text ellipsis">ServerErrorIcon</div>
      </span>
      <span className="d-icon-view-item __svg" onClick={() => copyToClipboard('WindmillIcon')}>
        <WindmillIcon />
        <div className="d-icon-view-item_text ellipsis">WindmillIcon</div>
      </span>
    </div>
  );
};

export default IconDemo2;
