import React from 'react';

import Drawer from 'm78/drawer';
import Button from 'm78/button';
import { If } from 'm78/fork';

import { useFormState } from '@lxjx/hooks';

import cls from 'classnames';

import { ActionSheetProps, ActionSheetItem } from './type';

const ActionSheet: React.FC<ActionSheetProps> = props => {
  const {
    show,
    onClose,
    onRemove,
    options,
    title,
    isConfirm = true,
    onConfirm,
    children,
    confirmText = '确认',
    namespace,
  } = props;
  const [state, setState] = useFormState<ActionSheetItem | undefined>(props, undefined);

  function close() {
    onClose && onClose();
  }

  function renderItems() {
    return options.map(v => (
      <div
        key={v.id}
        onClick={() => {
          if (v.disabled) return;
          !isConfirm && close();
          if (state && v.id === state.id) return;
          setState(v);
        }}
        className={cls('m78-action-sheet_item m78-effect m78-hb-t __md', {
          __active: v.highlight,
          __confirm: isConfirm,
          __disabled: v.disabled,
        })}
      >
        <div className={cls(isConfirm && 'tl')}>
          <div>{v.name}</div>
          <If when={v.desc}>
            <div className="m78-action-sheet_desc">{v.desc}</div>
          </If>
        </div>
        <If when={isConfirm}>
          <span className="m78-action-sheet_check">
            {/* TODO: 完成Checkbox组件后替换 */}
            <input
              type="checkbox"
              checked={!!(state && state.id === v.id)}
              onChange={() => false}
              disabled={v.disabled}
            />
          </span>
        </If>
      </div>
    ));
  }

  return (
    <Drawer
      namespace={namespace}
      className="m78-action-sheet_wrap"
      show={show}
      onRemove={onRemove}
      onClose={close}
      style={{ boxShadow: 'none' }}
    >
      <div className={cls('m78-action-sheet', { __custom: !!children })}>
        <div className="m78-action-sheet_item m78-effect __md __title __disabled">
          <If when={isConfirm}>
            <Button className="m78-action-sheet_confirm" onClick={onClose} link color="red">
              取消
            </Button>
          </If>
          <div>{title}</div>
          <If when={isConfirm}>
            <Button
              onClick={() => {
                close();
                onConfirm && onConfirm(state);
              }}
              className="m78-action-sheet_confirm"
              color="blue"
            >
              {confirmText}
            </Button>
          </If>
        </div>
        <div className="m78-action-sheet_item-cont">{children || renderItems()}</div>
        <If when={!isConfirm}>
          <div
            className="m78-action-sheet_item m78-effect m78-hb-t __md __cancel"
            onClick={onClose}
          >
            取消
          </div>
        </If>
      </div>
    </Drawer>
  );
};

export default ActionSheet;
