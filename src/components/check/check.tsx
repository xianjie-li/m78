import React, { useState } from 'react';

import { If } from '@lxjx/fr/lib/fork';

import { formStateMap, useFormState } from '@lxjx/hooks';

import cls from 'classnames';

import { CheckProps } from './type';

type BuiltIn = {
  [key in NonNullable<CheckProps['type']>]?: React.ReactElement;
};

const builtIn: BuiltIn = {
  radio: (
    <span className="fr-check_base fr-effect __md">
      <span className="fr-check_base-main">
        <span className="fr-check_base-inner" />
      </span>
    </span>
  ),
};

const Check: React.FC<CheckProps> = _props => {
  const { type = 'radio', disabled, label, autoFocus, value = '' } = _props;

  const [checked, setChecked] = useFormState<boolean, string>(
    formStateMap(_props, { value: 'checked', trigger: 'onChange', defaultValue: 'defaultChecked' }),
    false,
  );

  const [focus, setFocus] = useState(false);

  const renderEl = builtIn[type];

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
  };

  return (
    /* eslint-disable-next-line jsx-a11y/label-has-associated-control,jsx-a11y/label-has-for */
    <label className={cls('fr-check', statusCls)} onKeyPress={mouseUpHandel} onClick={blurHandle}>
      <input
        value={value}
        onFocus={focusHandle}
        onBlur={blurHandle}
        checked={checked}
        onChange={onChange}
        className="fr-check_hidden-check"
        type="checkbox"
        disabled={disabled}
        /* eslint-disable-next-line jsx-a11y/no-autofocus */
        autoFocus={autoFocus}
      />
      {renderEl &&
        React.cloneElement(renderEl, { className: cls(renderEl.props.className, statusCls) })}
      <If when={label}>
        <span>选项1</span>
      </If>
    </label>
  );
};

export default Check;
