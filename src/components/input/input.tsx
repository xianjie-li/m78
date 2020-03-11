import React, { useEffect, useRef } from 'react';

import Icon from '@lxjx/flicker/lib/icon';
import config from '@lxjx/flicker/lib/config';
import { dumpFn } from '@lxjx/flicker/lib/util';

import cls from 'classnames';

import { InputProps } from './type';
import { useSetState } from '@lxjx/hooks';

const Input: React.FC<InputProps> = ({
  /* 内部prop */
  size,
  /* 处理input自带的特殊属性 */
  className,
  style,
  disabled,
  readOnly,
  onFocus = dumpFn,
  onBlur = dumpFn,
  onKeyDown = dumpFn,
  onPressEnter = dumpFn,
  ...props
}) => {
  /* 各种态，active和hover通过css处理 */
  const [status, setStatus] = useSetState({
    focus: false,
    disabled: false,
    readonly: false,
    loading: false,
    blockLoading: false,
  });

  /* input的ref */
  const input = useRef<HTMLInputElement>(null!);

  /* 同步disabled到内部 TODO: 编写useDerivedStateFromProps来代替这种模式，通过深度对比 */
  useEffect(() => {
    if (disabled !== status.disabled || readOnly !== status.readonly) {
      setStatus({ disabled, readonly: readOnly });
    }
    // eslint-disable-next-line
  }, [disabled, readOnly]);

  function focusHandle() {
    if (status.disabled || status.readonly) return;
    onFocus();
    setStatus({ focus: true });
  }

  function blurHandle() {
    onBlur();
    setStatus({ focus: false });
  }

  function keyDownHandle(e: React.KeyboardEvent<HTMLInputElement>) {
    onKeyDown(e);
    if (e.keyCode === 13) {
      input.current.blur();
      onPressEnter(e);
    }
  }

  return (
    <span
      className={cls(
        'fr-input_wrap',
        className,
        {
          __focus: status.focus,
          __disabled: status.disabled,
          __readonly: status.readonly,
        },
      )}
      style={style}
    >
      <span className="fr-input_prefix">￥</span>
      <input
        {...props}
        ref={input}
        className="fr-input"
        type="text"
        onFocus={focusHandle}
        onBlur={blurHandle}
        onKeyDown={keyDownHandle}
        disabled={status.disabled}
        readOnly={status.readonly}
      />
      <span className="fr-input_suffix">RMB</span>
    </span>
  );
};

export default Input;
