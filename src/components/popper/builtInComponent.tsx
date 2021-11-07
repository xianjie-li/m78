import React from 'react';
import { WarningIcon } from 'm78/icon';
import { Button } from 'm78/button';
import { useFn } from '@lxjx/hooks';
import { PopperPropsCustom } from './types';

function Tooltip(props: PopperPropsCustom) {
  const { content } = props;

  return <div className="m78-popper_content m78-popper_tooltip">{content}</div>;
}

function Popper(props: PopperPropsCustom) {
  const { content, title } = props;

  return (
    <div className="m78-popper_content m78-popper_popper">
      {title && <div className="m78-popper_popper-title">{title}</div>}
      <div className="m78-popper_popper-content">{content}</div>
    </div>
  );
}

function Confirm(props: PopperPropsCustom) {
  const {
    content,
    confirmText = '确认',
    cancelText = '取消',
    setShow,
    onConfirm,
    disabled,
    icon,
  } = props;
  const closeHandle = useFn(() => {
    setShow(false);
  });

  const confirmHandle = useFn(() => {
    onConfirm?.();
    setShow(false);
  });

  return (
    <div className="m78-popper_content m78-popper_confirm">
      <span className="m78-popper_confirm-icon">{icon || <WarningIcon />}</span>
      <span>{content}</span>
      <div className="m78-popper_confirm-btns">
        <Button size="small" onClick={closeHandle}>
          {cancelText}
        </Button>
        <Button disabled={disabled} size="small" color="primary" onClick={confirmHandle}>
          {confirmText}
        </Button>
      </div>
    </div>
  );
}

export const buildInComponent = {
  tooltip: Tooltip,
  popper: Popper,
  confirm: Confirm,
};
