import React from 'react';
import { SvgIcon } from '@lxjx/fr/lib/icon';
import Button from '@lxjx/fr/lib/button';
import { useFn } from '@lxjx/hooks';
import Picture from '@lxjx/fr/lib/picture';
import { PopperProps } from './types';

interface PopperPropsCustom extends PopperProps {
  setShow(patch: boolean | ((prevState: boolean) => boolean)): void;
  show: boolean;
}

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
      <span className="fr-popper_confirm-icon">{icon || <SvgIcon type="warning" size={28} />}</span>
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

/* 左下角页码 标题 内容 操作栏 大图 */
function Study(props: PopperPropsCustom) {
  const { content, title } = props;

  return (
    <div className="fr-popper_content fr-popper_study">
      {/* <Picture */}
      {/*  className="fr-popper_study-img" */}
      {/*  src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1589196591205&di=a99f4fc1cdd41b809eb3b920a6b9554c&imgtype=0&src=http%3A%2F%2Fa4.att.hudong.com%2F13%2F49%2F19300534771702136100499509713.jpg" */}
      {/* /> */}
      {title && <div className="fr-popper_study-title">{title}</div>}
      <div className="fr-popper_study-content">{content}</div>
    </div>
  );
}

export const buildInComponent = {
  tooltip: Tooltip,
  popper: Popper,
  confirm: Confirm,
  study: Study,
};
