import React, { useEffect, useRef, useState } from 'react';

import Icon from '@lxjx/flicker/lib/icon';
import Spin from '@lxjx/flicker/lib/spin';
import { If } from '@lxjx/flicker/lib/fork';
import config from '@lxjx/flicker/lib/config';
import { dumpFn } from '@lxjx/flicker/lib/util';

import cls from 'classnames';

import { InputProps } from './type';
import { useFormState, useDerivedStateFromProps } from '@lxjx/hooks';

const Input: React.FC<InputProps> = (_props) => {
  const {
    /* 内部prop */
    size,
    /* 处理input自带的特殊属性 */
    className,
    style,
    disabled: _disabled = false,
    readOnly: _readOnly = false,
    loading: _loading = false,
    blockLoading: _blockLoading = false,
    type: _type = 'text',
    allowClear = true,
    onFocus = dumpFn,
    onBlur = dumpFn,
    onKeyDown = dumpFn,
    onPressEnter = dumpFn,
    value: _value,
    defaultValue: _defaultValue,
    onChange: _onChange,
    prefix,
    suffix,
    ...props
  } = _props;

  dumpFn(_value, _defaultValue, _onChange);
  const [value, setValue] = useFormState(_props, '');

  /* 各种态，active和hover通过css处理, 部分状态需要由内部接管方便在用户之外进行一些状态操作 */
  const [focus, setFocus] = useState(false);
  const [disabled, setDisabled] = useDerivedStateFromProps(_disabled);
  const [readonly, setReadonly] = useDerivedStateFromProps(_readOnly);
  const [loading, setReadonly] = useDerivedStateFromProps(_loading);
  const [blockLoading, setReadonly] = useDerivedStateFromProps(_blockLoading);

  /* 其他 */
  const [type, setType] = useDerivedStateFromProps(_type);

  /* input的ref */
  const input = useRef<HTMLInputElement>(null!);

  function focusHandle() {
    if (disabled || readonly) return;
    onFocus();
    setFocus(true);
  }

  function blurHandle() {
    onBlur();
    setFocus(false);
  }

  function keyDownHandle(e: React.KeyboardEvent<HTMLInputElement>) {
    onKeyDown(e);
    if (e.keyCode === 13) {
      input.current.blur();
      onPressEnter(e);
    }
  }

  /* 密码 开关 */
  function passwordTypeChange() {
    setType(prev => (prev === 'password' ? 'text' : 'password'));
  }

  /* 处理input的change */
  function changeHandle({ target }: React.ChangeEvent<HTMLInputElement>) {
    setValue(target.value);
  }

  /* 清空输入框 */
  function clearHandle() {
    setValue('');
    input.current.focus();
  }

  const isDisabled = disabled || blockLoading;

  const hasClearBtn = allowClear && value && !isDisabled && !readonly;

  return (
    <span
      className={cls(
        'fr-input_wrap',
        className,
        {
          __focus: focus,
          __disabled: isDisabled,
          __readonly: readonly,
        },
      )}
      style={style}
    >
      <If when={prefix}><span className="fr-input_prefix">{prefix}</span></If>
      <input
        {...props}
        ref={input}
        className="fr-input"
        type={type}
        onFocus={focusHandle}
        onBlur={blurHandle}
        onKeyDown={keyDownHandle}
        disabled={isDisabled}
        readOnly={readonly}
        value={value}
        onChange={changeHandle}
      />
      <Spin className="fr-input_loading" size="small" text="" show={loading || blockLoading} full={blockLoading} />
      <If when={hasClearBtn}>
        <Icon onClick={clearHandle} className="fr-input_icon" type="error" />
      </If>
      <If when={_type === 'password'}>
        <Icon onClick={passwordTypeChange} className="fr-input_icon" type={type === 'password' ? 'eyeClose' : 'eye'} />
      </If>
      <If when={suffix}><span className="fr-input_suffix">{suffix}</span></If>
    </span>
  );
};

export default Input;
