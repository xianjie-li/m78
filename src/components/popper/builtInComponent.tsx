import React from 'react';
import { WarningIcon } from '@lxjx/fr/icon';
import Button from '@lxjx/fr/button';
import { useFn } from '@lxjx/hooks';
import { PopperPropsCustom } from './types';

function Tooltip(props: PopperPropsCustom) {
  const { content } = props;

  return <div className="fr-popper_content fr-popper_tooltip">{content}</div>;
}

function Popper(props: PopperPropsCustom) {
  const { content, title } = props;

  return (
    <div className="fr-popper_content fr-popper_popper">
      {title && <div className="fr-popper_popper-title">{title}</div>}
      <div className="fr-popper_popper-content">{content}</div>
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
    <div className="fr-popper_content fr-popper_confirm">
      <span className="fr-popper_confirm-icon">{icon || <WarningIcon />}</span>
      <span>{content}</span>
      <div className="fr-popper_confirm-btns">
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
