import React, { useState } from 'react';

import { If } from '@lxjx/fr/lib/fork';

import { formStateMap, useFormState } from '@lxjx/hooks';

import cls from 'classnames';

import { ChoiceProps } from './type';

const ChoiceBox: React.FC<ChoiceProps> = _props => {
  const { disabled, label, autoFocus } = _props;

  const [checked, setChecked] = useFormState<boolean, string>(
    formStateMap(_props, { value: 'checked', trigger: 'onChange', defaultValue: 'defaultChecked' }),
    false,
  );

  const [focus, setFocus] = useState(false);

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
    setChecked(check => !check);
  }

  return (
    /* eslint-disable-next-line jsx-a11y/label-has-associated-control,jsx-a11y/label-has-for */
    <label
      className={cls('fr-choice', {
        __focus: focus,
        __checked: checked,
        __disabled: disabled,
      })}
      onKeyPress={mouseUpHandel}
      onClick={blurHandle}
    >
      <input
        onFocus={focusHandle}
        onBlur={blurHandle}
        checked={checked}
        onChange={onChange}
        className="fr-choice_hidden-check"
        type="checkbox"
        disabled={disabled}
        /* eslint-disable-next-line jsx-a11y/no-autofocus */
        autoFocus={autoFocus}
      />
      <span className={cls('fr-choice_ctrl fr-effect __light __md', { __disabled: disabled })}>
        <span className="fr-choice_ctrl-main">
          <span className="fr-choice_ctrl-inner" />
        </span>
      </span>
      <If when={label}>
        <span>选项1</span>
      </If>
    </label>
  );
};

export default ChoiceBox;
