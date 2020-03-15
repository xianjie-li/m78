import React, { useEffect, useMemo, useRef, useState } from 'react';

import Icon from '@lxjx/flicker/lib/icon';
import Spin from '@lxjx/flicker/lib/spin';
import Button from '@lxjx/flicker/lib/button';
import { If } from '@lxjx/flicker/lib/fork';
import { dumpFn } from '@lxjx/flicker/lib/util';
import { isNumber, formatString, validateFormatString } from '@lxjx/utils';

import cls from 'classnames';

import { InputProps } from './type';
import { useFormState, useDerivedStateFromProps } from '@lxjx/hooks';
import { TransitionBase } from '@lxjx/react-transition-spring';

/* 内置format */
type BuildInPatterns = {
  [key in NonNullable<InputProps['format']>]: {
    pattern: string;
    delimiter?: string;
    lastRepeat?: boolean;
    repeat?: boolean;
  };
};

const buildInPattern: BuildInPatterns = {
  phone: {
    delimiter: ' ',
    pattern: '3,4',
    lastRepeat: true,
  },
  idCard: {
    delimiter: ' ',
    pattern: '3,3,4',
    lastRepeat: true,
  },
  money: {
    delimiter: '\'',
    pattern: '5,3',
    lastRepeat: true,
  },
  bankCard: {
    delimiter: ' ',
    pattern: '3,4',
    lastRepeat: true,
  },
};

/* money format需要单独处理小数点 */
function formatMoney(moneyStr = '', delimiter = '\'') {
  const dotIndex = moneyStr.indexOf('.');

  if (dotIndex === -1) return moneyStr;

  const first = moneyStr.slice(0, dotIndex - 1);
  // 移除小数点前一位以及以后所有的delimiter
  const last = moneyStr.slice(dotIndex - 1).replace(new RegExp(delimiter, 'g'), '');

  return first + last;
}

/* 处理 type=number */
function parserNumber(value = '') {
  value = value.replace(/[^(0-9|.)]/g, '');
  // 去首位点
  if (value[0] === '.') {
    value = value.slice(1);
  }
  // 去1个以上的点
  const matchDot = value.match(/(\.)/g);
  if (matchDot && matchDot.length > 1) {
    const firstDotInd = value.indexOf('.');
    const firstStr = value.slice(0, firstDotInd + 1);
    const lastStr = value.slice(firstDotInd + 1).replace('.', '');
    value = firstStr + lastStr;
  }
  return value;
}

/* 处理 type=integer */
function parserInteger(value = '') {
  return value.replace(/[\D]/g, '');
}

/* 处理 type=general */
function parserGeneral(value = '') {
  return value.replace(/[\W]/g, '');
}

/* 处理 maxLength */
function parserLength(value = '', maxLength: number) {
  return value.slice(0, maxLength);
}

const Input: React.FC<InputProps> = (_props) => {
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
    search = false,
    onSearch = dumpFn,
    onFocus = dumpFn,
    onBlur = dumpFn,
    onKeyDown = dumpFn,
    onPressEnter = dumpFn,
    value: _value,
    defaultValue: _defaultValue,
    onChange: _onChange,
    prefix,
    suffix,
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
    ...props
  } = _props;

  dumpFn(_value, _defaultValue, _onChange);

  // format配置不允许改变
  const formatArg = useMemo(() => {
    // 有预设优先用预设
    if (format && buildInPattern[format]) {
      const { pattern, ...conf } = buildInPattern[format];
      return [pattern, conf] as const;
    }

    if (!formatPattern) return false;
    if (!validateFormatString.test(formatPattern)) return false;
    return [formatPattern, { delimiter: formatDelimiter, repeat: formatRepeat, lastRepeat: formatLastRepeat }] as const;
    // eslint-disable-next-line
  }, []);
  const memoFormat = useMemo(() => format, []);

  const [value, setValue] = useFormState(_props, '');

  /* 各种态，active和hover通过css处理, 部分状态需要由内部接管方便在用户之外进行一些状态操作 */
  const [focus, setFocus] = useState(false);
  const [disabled, setDisabled] = useDerivedStateFromProps(_disabled);
  const [readonly, setReadonly] = useDerivedStateFromProps(_readOnly);
  const [loading, setLoading] = useDerivedStateFromProps(_loading);
  const [blockLoading, setBlockLoading] = useDerivedStateFromProps(_blockLoading);

  /* 其他 */
  const [type, setType] = useDerivedStateFromProps(_type);

  useEffect(() => {
    if (memoFormat === 'money') {
      setType('number');
    }
    // eslint-disable-next-line
  }, [memoFormat]);

  /* input的ref */
  const input = useRef<HTMLInputElement>(null!);

  // eslint-disable-next-line
  let inputValue = useMemo(() => (formatArg ? formatString(value, ...formatArg) : value), [value]);

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
    // // @ts-ignore
    // const inputType = nativeEvent.inputType;
    // // @ts-ignore
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
    if (typeof saveSelectInd === 'number' && target.setSelectionRange && (formatArg || typeof _parser === 'function')) {
      setTimeout(() => {
        const diff = target.value.length - oldValueLength;
        target.setSelectionRange(saveSelectInd + diff, saveSelectInd + diff);
      });
    }
  }

  /* 清空输入框 */
  function clearHandle() {
    setValue('');
    setTimeout(() => {
      searchHandle();
    });
    input.current.focus();
  }

  /* 触发搜索 */
  function searchHandle() {
    onSearch(input.current.value);
  }

  function parser(val: string) {
    // 在启用了format时，需要在设置值之前移除掉所有的delimiter
    let newValue = formatArg ? val.replace(new RegExp(formatArg?.[1]?.delimiter!, 'g'), '') : val;

    if (type === 'number') {
      newValue = parserNumber(newValue);
    }

    if (type === 'integer') {
      newValue = parserInteger(newValue);
    }

    if (type === 'general') {
      newValue = parserGeneral(newValue);
    }

    if (isNumber(maxLength)) {
      newValue = parserLength(newValue, maxLength);
    }

    return _parser ? _parser(newValue) : newValue;
  }

  function formatter(val: string) {
    return _formatter ? _formatter(val) : val;
  }

  const isDisabled = disabled || blockLoading;

  const hasClearBtn = allowClear && value && value.length > 4 && !isDisabled && !readonly;

  // 对money类型特殊处理
  if (formatArg && memoFormat === 'money') {
    inputValue = formatMoney(inputValue);
  }

  return (
    <span
      className={cls(
        'fr-input_wrap',
        notBorder && '__not-border',
        underline && '__underline',
        className,
        status && `__${status}`,
        size && `__${size}`,
        {
          __focus: focus,
          __disabled: isDisabled,
          __readonly: readonly,
          __matter: format === 'money',
        },
      )}
      style={style}
    >
      <If when={prefix}><span className="fr-input_prefix">{prefix}</span></If>
      <input
        {...props}
        ref={input}
        className="fr-input"
        type={(type === 'number' || type === 'integer') ? 'tel' : type} /* 数字输入时，使用tel类型，number类型会导致format异常 */
        onFocus={focusHandle}
        onBlur={blurHandle}
        onKeyDown={keyDownHandle}
        disabled={isDisabled}
        readOnly={readonly}
        value={formatter(inputValue)}
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
      <TransitionBase
        style={{ position: 'relative' }}
        toggle={search && !!value}
        mountOnEnter
        appear={false}
        from={{ width: 0, left: 6 }}
        to={{ width: 28, left: 0 }}
      >
        <Button className="fr-input_search-icon" icon win size="small" onClick={searchHandle}>
          <Icon type="search" />
        </Button>
      </TransitionBase>
    </span>
  );
};

export default Input;
