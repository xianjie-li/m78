import React, { useEffect, useMemo, useRef, useState, useImperativeHandle } from 'react';

import {
  CloseCircleOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  SearchOutlined,
} from '@lxjx/fr/lib/icon';
import Spin from '@lxjx/fr/lib/spin';
import Button from '@lxjx/fr/lib/button';
import { If } from '@lxjx/fr/lib/fork';
import { dumpFn } from '@lxjx/fr/lib/util';
import { isNumber, formatString, validateFormatString } from '@lxjx/utils';

import cls from 'classnames';

import { useFormState, useDerivedStateFromProps } from '@lxjx/hooks';
import { TransitionBase } from '@lxjx/react-transition-spring';
import { InputProps } from './type';

import {
  buildInPattern,
  formatMoney,
  parserNumber,
  parserInteger,
  parserGeneral,
  parserLength,
  parserThan,
} from './utils';

interface InputRef {
  el: HTMLInputElement;
}

const Input: React.FC<InputProps> = React.forwardRef<InputRef, InputProps>((_props, ref) => {
  const {
    /* 处理特殊属性 */
    className,
    style,
    disabled: _disabled = false,
    readOnly: _readOnly = false,
    loading: _loading = false,
    blockLoading: _blockLoading = false,
    type: _type = 'text',
    /* 组件props */
    size,
    allowClear = true,
    onFocus = dumpFn,
    onBlur = dumpFn,
    onKeyDown = dumpFn,
    onPressEnter = dumpFn,
    value: _value,
    defaultValue: _defaultValue,
    onChange: _onChange,
    status,
    notBorder,
    underline,
    format,
    formatPattern,
    formatDelimiter = ' ',
    formatRepeat = false,
    formatLastRepeat = false,
    formatter: _formatter,
    parser: _parser,
    maxLength,
    min,
    max,
    search = false,
    onSearch = dumpFn,
    prefix,
    suffix,
    prefixBtn,
    suffixBtn,
    textArea,
    autoSize = true,
    charCount = false,
    ...props
  } = _props;

  // eslint
  dumpFn(_value, _defaultValue, _onChange);

  // format相关配置, 不允许改变
  const formatArg = useMemo(() => {
    // 有预设优先用预设
    if (format && buildInPattern[format]) {
      const { pattern, ...conf } = buildInPattern[format];
      return [pattern, conf] as const;
    }

    if (!formatPattern) return false;
    if (!validateFormatString.test(formatPattern)) return false;
    return [
      formatPattern,
      { delimiter: formatDelimiter, repeat: formatRepeat, lastRepeat: formatLastRepeat },
    ] as const;
    // eslint-disable-next-line
  }, []);

  // 对format类型进行缓存
  // eslint-disable-next-line
  const memoFormat = useMemo(() => format, []);

  const [value, setValue] = useFormState(_props, '');

  // textarea的高度 用于设置了autoSize时动态调整高度
  const [textAreaHeight, setTextAreaHeight] = useState('');

  /* 各种态，active和hover通过css处理, 部分状态需要由内部接管方便在用户之外进行一些状态操作 */
  const [focus, setFocus] = useState(false);
  const [disabled] = useDerivedStateFromProps(_disabled);
  const [readonly] = useDerivedStateFromProps(_readOnly);
  const [loading] = useDerivedStateFromProps(_loading);
  const [blockLoading] = useDerivedStateFromProps(_blockLoading);

  /* 其他 */
  const [type, setType] = useDerivedStateFromProps(_type);

  // 对一些配置进行type的类型优化
  useEffect(() => {
    if (memoFormat === 'money') {
      setType('number');
    }
    // eslint-disable-next-line
  }, [memoFormat]);

  useEffect(() => {
    if (type !== 'number' && type !== 'integer' && (isNumber(min) || isNumber(max))) {
      setType('number');
    }
    // eslint-disable-next-line
  }, [min, max]);

  /* 指向input的ref */
  const input = useRef<HTMLInputElement>(null!);

  /* 对外暴露input ref */
  useImperativeHandle(ref, () => ({
    el: input.current,
  }));

  /* 启用了formatArg时，对其格式化，否则返回原value */
  // eslint-disable-next-line
  let inputValue = useMemo(() => (formatArg ? formatString(value, ...formatArg) : value), [value]);

  /* 实现textarea autoSize */
  const cloneText = useRef<any>();

  useEffect(() => {
    if (textArea && autoSize) {
      cloneText.current = input.current.cloneNode();
      cloneText.current.style.position = 'absolute';
      cloneText.current.style.visibility = 'hidden';

      const parent = input.current.parentNode;

      if (parent) {
        parent.appendChild(cloneText.current);
      }
    }
    // eslint-disable-next-line
  }, []);

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
      // input.current.blur();
      searchHandle();
      onPressEnter(e);
    }
  }

  /* 密码 开关 */
  function passwordTypeChange() {
    setType(prev => (prev === 'password' ? 'text' : 'password'));
  }

  /* 处理input的change */
  function changeHandle({ target }: React.ChangeEvent<HTMLInputElement>) {
    /* TODO: parser会打断输入法 */
    // const inputType = nativeEvent.inputType;
    // const isComposing = nativeEvent.isComposing;
    // console.log(inputType, isComposing, nativeEvent);
    // // 对兼容inputType/isComposing API的浏览器进行混合输入处理，防止输入法操作被打断
    // if (inputType === 'insertCompositionText' && isComposing) {
    //   return;
    // }

    // 设置formatArg后，改变value长度会导致光标移动到输入框末尾，手动将其还原
    const saveSelectInd = target.selectionStart;
    const oldValueLength = target.value.length;

    setValue(parser(target.value));

    // 浏览器支持且存在formatArg配置或传入parser时，还原光标位置
    if (
      typeof saveSelectInd === 'number' &&
      target.setSelectionRange &&
      (formatArg || typeof _parser === 'function')
    ) {
      setTimeout(() => {
        const diff = target.value.length - oldValueLength; // 基于新值计算差异长度，还原位置需要减去此差值
        target.setSelectionRange(saveSelectInd + diff, saveSelectInd + diff);
      });
    }

    calcTextHeight();
  }

  /* 清空输入框 */
  function clearHandle() {
    setValue('');
    setTimeout(() => {
      // 清空后、触发搜索，并且在autoSize启用时时更新高度
      searchHandle();
      calcTextHeight();
    });
    input.current.focus();
  }

  /* 触发搜索 */
  function searchHandle() {
    onSearch(input.current.value);
  }

  function calcTextHeight() {
    if (!textArea || !autoSize || !cloneText.current) return;
    const el = input.current;
    cloneText.current.value = isNumber(maxLength) ? parserLength(el.value, maxLength) : el.value;
    setTextAreaHeight(`${cloneText.current.scrollHeight}px`);
  }

  /* 提交value前的预处理函数 */
  function parser(val: string) {
    // 在启用了format时，需要在设置值之前移除掉所有的delimiter
    let newValue = formatArg ? val.replace(new RegExp(formatArg?.[1]?.delimiter!, 'g'), '') : val;

    if (type === 'number') {
      newValue = parserNumber(newValue);
    }

    if (type === 'integer') {
      newValue = parserInteger(newValue);
    }

    if (_type === 'general') {
      newValue = parserGeneral(newValue);
    }

    if (isNumber(maxLength)) {
      newValue = parserLength(newValue, maxLength);
    }

    if (isNumber(min)) {
      newValue = parserThan(newValue, min);
    }

    if (isNumber(max)) {
      newValue = parserThan(newValue, max, false);
    }

    return _parser ? _parser(newValue) : newValue;
  }

  /* value传入input前进行格式化(在传入了解析parser时才不会影响最终的value结果) */
  function formatter(val: string) {
    return _formatter ? _formatter(val) : val;
  }

  /** 根据type设置input应该使用的type */
  function getRealType(tType: string) {
    if (tType === 'number' || tType === 'integer') {
      return 'tel';
    }

    return tType;
  }

  const isDisabled = disabled || blockLoading;

  const hasClearBtn = allowClear && value && value.length > 3 && !isDisabled && !readonly;

  // 对money类型特殊处理
  if (formatArg && memoFormat === 'money') {
    inputValue = formatMoney(inputValue);
  }

  return (
    <span
      className={cls('fr-input_wrap', className, status && `__${status}`, size && `__${size}`, {
        '__not-border': !textArea && notBorder,
        __underline: !textArea && underline,
        __focus: focus,
        __disabled: isDisabled,
        __readonly: readonly,
        __matter: format === 'money',
        __textarea: textArea,
      })}
      style={style}
    >
      <If when={prefixBtn && !textArea}>
        {() => React.cloneElement(prefixBtn!, { className: 'fr-input_prefix-btn' })}
      </If>
      <If when={prefix && !textArea}>
        <span className="fr-input_prefix">{prefix}</span>
      </If>
      {React.createElement(textArea ? 'textarea' : 'input', {
        ...props,
        ref: input,
        className: 'fr-input',
        type: getRealType(type) /* 数字输入时，使用tel类型，number类型会导致format异常 */,
        onFocus: focusHandle,
        onBlur: blurHandle,
        onKeyDown: keyDownHandle,
        disabled: isDisabled,
        readOnly: readonly,
        value: formatter(inputValue),
        onChange: changeHandle,
        style: textArea
          ? {
              height: textAreaHeight,
              overflow: autoSize ? 'hidden' : 'auto',
              resize: autoSize ? 'none' : undefined,
            }
          : {},
      })}
      <Spin
        className="fr-input_loading"
        size="small"
        text=""
        show={loading || blockLoading}
        full={blockLoading}
      />
      <If when={hasClearBtn}>
        <CloseCircleOutlined onClick={clearHandle} className="fr-input_icon fr-input_icon-clear" />
      </If>
      <If when={_type === 'password' && !textArea}>
        {type === 'password' ? (
          <EyeOutlined onClick={passwordTypeChange} className="fr-input_icon" />
        ) : (
          <EyeInvisibleOutlined onClick={passwordTypeChange} className="fr-input_icon" />
        )}
      </If>
      <If when={suffix && !textArea}>
        <span className="fr-input_suffix">{suffix}</span>
      </If>
      <If when={textArea || charCount}>
        <span className="fr-input_tip-text">
          {value.length}
          {maxLength ? `/${maxLength}` : '字'}
        </span>
      </If>
      <TransitionBase
        style={{ position: 'relative' }}
        toggle={search && !!value && !textArea}
        mountOnEnter
        appear={false}
        from={{ width: 0, left: 6 }}
        to={{ width: 28, left: 0 }}
      >
        <Button className="fr-input_search-icon" icon win size="small" onClick={searchHandle}>
          <SearchOutlined />
        </Button>
      </TransitionBase>
      <If when={suffixBtn && !textArea}>
        {() => React.cloneElement(suffixBtn!, { className: 'fr-input_suffix-btn' })}
      </If>
    </span>
  );
});

export default Input;
