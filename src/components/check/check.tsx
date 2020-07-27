import React, { useState } from 'react';

import { If } from '@lxjx/fr/fork';

import { useFormState } from '@lxjx/hooks';

import cls from 'classnames';

import { CheckProps } from './type';

interface ShareMeta {
  focus: boolean;
  checked: boolean;
  disabled: boolean;
}

/**
 * 定制Check样式时会用到的接口
 * @param meta - 定制时会用到的一些组件内部状态
 * @param checkProps - Check组件接收到的prop
 * */
export interface CheckCustom {
  (meta: ShareMeta, checkProps: CheckProps<any>): React.ReactElement;
}

/** 内置样式 */
type BuiltIn = {
  [key in NonNullable<CheckProps<any>['type']>]?: CheckCustom;
};

/* 接收<ShareMeta>并生成适合的类名返回 */
function getCheckCls({ focus, checked, disabled }: ShareMeta) {
  return {
    __focus: focus,
    __checked: checked,
    __disabled: disabled,
  };
}

/** 内置样式实现 */
const builtIn: BuiltIn = {
  radio: meta => (
    <span className={cls('fr-check_base fr-effect __md', getCheckCls(meta))}>
      <span className="fr-check_base-main">
        <span className="fr-check_base-inner" />
      </span>
    </span>
  ),
  checkbox: (meta, { partial }) => (
    <span
      className={cls(
        'fr-check_base fr-effect __md',
        '__checkbox',
        partial && '__partial',
        getCheckCls(meta),
      )}
    >
      <span className="fr-check_base-main">
        <span className="fr-check_base-inner" />
      </span>
    </span>
  ),
  switch: (meta, { switchOff, switchOn }) => (
    <span className={cls('fr-check_switch', getCheckCls(meta))}>
      <span className={cls('fr-check_switch-inner fr-effect __md', meta.disabled && '__disabled')}>
        <span className="fr-check_switch-handle">
          <If when={switchOff && switchOn}>
            <span>{meta.checked ? switchOn : switchOff}</span>
          </If>
        </span>
      </span>
    </span>
  ),
};

const Check = <Val extends unknown = undefined>(_props: CheckProps<Val>) => {
  const {
    type = 'checkbox',
    disabled = false,
    label,
    beforeLabel,
    autoFocus,
    value,
    name,
    block = false,
    className,
    style,
    customer,
  } = _props;

  const [checked, setChecked] = useFormState<boolean, Val>(_props, false, {
    valueKey: 'checked',
    defaultValueKey: 'defaultChecked',
    triggerKey: 'onChange',
  });

  const [focus, setFocus] = useState(false);

  const renderCustom = customer || builtIn[type];

  function focusHandle() {
    setFocus(true);
  }

  function blurHandle() {
    setFocus(false);
  }

  function mouseUpHandel(e: React.KeyboardEvent<HTMLLabelElement>) {
    // 按下空格时设置focus样式
    if (e.keyCode === 0) {
      focusHandle();
    }
  }

  function onChange() {
    setChecked(check => !check, value);
  }

  const statusCls = {
    __focus: focus,
    __checked: checked,
    __disabled: disabled,
    __block: block,
    [`__${type}`]: true,
  };

  if (!renderCustom) {
    return null;
  }

  return (
    /* eslint-disable-next-line jsx-a11y/label-has-associated-control,jsx-a11y/label-has-for */
    <label
      className={cls('fr-check', statusCls, className)}
      style={style}
      onKeyPress={mouseUpHandel}
      onClick={blurHandle}
    >
      <If when={beforeLabel && !customer}>
        <span className="fr-check_label-before">{beforeLabel}</span>
      </If>
      <input
        value={String(value || '')}
        onFocus={focusHandle}
        onBlur={blurHandle}
        checked={checked}
        onChange={onChange}
        className="fr-check_hidden-check"
        type="checkbox"
        name={name}
        disabled={disabled}
        /* eslint-disable-next-line jsx-a11y/no-autofocus */
        autoFocus={autoFocus}
      />
      {renderCustom && renderCustom({ focus, checked, disabled }, _props)}
      <If when={label && !customer}>
        <span className="fr-check_label">{label}</span>
      </If>
    </label>
  );
};

export default Check;
