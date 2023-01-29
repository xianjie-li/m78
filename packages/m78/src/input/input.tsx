import { _InputContext, InputProps, InputType } from "./types.js";
import {
  useDerivedStateFromProps,
  useFn,
  useFormState,
  useSelf,
  useUpdate,
} from "@m78/hooks";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  dumpFn,
  ensureArray,
  isFunction,
  isString,
  keypressAndClick,
  TupleNumber,
} from "@m78/utils";
import clsx from "clsx";
import { IconSearch } from "@m78/icons/icon-search.js";
import { IconClear } from "@m78/icons/icon-clear.js";
import { IconVisibility } from "@m78/icons/icon-visibility.js";
import { IconVisibilityOff } from "@m78/icons/icon-visibility-off.js";
import { Spin } from "../spin/index.js";
import { Divider } from "../layout/index.js";
import { _useTextAreaCalc } from "./use-text-area-calc.js";
import { _integer, _number, _numberRange, _positive } from "./interceptor.js";

import { _useStepper } from "./use-stepper.js";
import { i18n, INPUT_NS } from "../i18n/index.js";

export function _Input(_props: InputProps) {
  const {
    /* 处理特殊属性 */
    className,
    style,
    disabled = false,
    loading = false,
    blockLoading = false,
    type: _type = InputType.text,
    /* 组件props */
    size,
    clear = true,
    onFocus = dumpFn,
    onBlur = dumpFn,
    onKeyDown = dumpFn,
    onPressEnter = dumpFn,
    onSearch = dumpFn,
    status,
    border,
    maxLength,
    search = false,
    prefix,
    suffix,
    textArea = false,
    autoSize = true,
    charCount = false,
    innerInputRef,
    innerWrapRef,
    onClear,
    interceptor,
    readonly,
    value: _value,
    defaultValue: _defaultValue,
    onChange: _onChange,
    min,
    max,
    stepper,
    ...props
  } = _props;

  // just fix eslint
  dumpFn(_value, _defaultValue, _onChange, min, max);

  const _inputRef = useRef<HTMLInputElement>(null!);

  const inputRef = innerInputRef || _inputRef;

  const [value, setValue] = useFormState(_props, "");

  const [focus, setFocus] = useState(false);

  const update = useUpdate();

  /** 内部type */
  const [type, setType] = useDerivedStateFromProps(_type);

  const isDisabled = disabled || blockLoading;

  const isNumberType =
    type === InputType.number ||
    type === InputType.integer ||
    type === InputType.positiveInteger;

  const self = useSelf({
    /** 是否正在进行合成输入, InputEvent.isComposing较onCompositionStart等事件兼容性差了不少, 用后者作为代替 */
    isComposing: false,
    /** 若此项存在值, 在下一次值变更时将光标选区设置到此位置 */
    cursor: null as TupleNumber | null,
    /** 记录前一个光标位置 */
    prevCursor: null as TupleNumber | null,
  });

  const ctx: _InputContext = {
    textArea,
    autoSize,
    inputRef,
    value,
    manualChange,
    isDisabled,
    props: _props,
  };

  /** 格式化interceptor, 根据props添加内置拦截器 */
  const interceptorList = useMemo(() => {
    const iter = ensureArray(interceptor);

    if (isNumberType) {
      iter.unshift(_numberRange);

      // 数值类型输入推入预设的几个拦截器
      if (_type === InputType.number) {
        iter.unshift(_number);
      } else if (_type === InputType.integer) {
        iter.unshift(_number, _integer);
      } else if (_type === InputType.positiveInteger) {
        iter.unshift(_number, _integer, _positive);
      }
    }

    return iter;
  }, [interceptor, _type]);

  const [textAreaHeight, calcTextHeight] = _useTextAreaCalc(ctx);

  const stepperNode = _useStepper(ctx);

  // 如果存在self.cursor, 使用其对关闭位置进行修正
  useEffect(() => {
    if (self.cursor && isFunction(inputRef.current.setSelectionRange)) {
      inputRef.current.setSelectionRange(...self.cursor);
      self.cursor = null;
    }
  });

  /** 值变更时触发, 如果返回false, 表示更新被阻止, 需要确保组件内部的值变更可以通过manualChange来进行 */
  const change = useFn((e?: React.ChangeEvent<HTMLInputElement>) => {
    const el = inputRef.current;
    let val = el.value;

    // 合成事件时直接进行更新
    if (self.isComposing && !isNumberType) {
      setValue(val);
      return;
    }

    // 如果光标api无效, 后面也不会进行写入, 所以可以直接给0
    let cursor: TupleNumber = [el.selectionStart || 0, el.selectionEnd || 0];
    let cursorIsChange = false;

    // 拦截器执行
    for (const interceptor of interceptorList) {
      const res = interceptor({
        cursor,
        prevCursor: self.prevCursor!,
        str: val,
        event: e,
        props: _props,
      });

      if (isString(res)) {
        val = res;
        continue;
      }

      // 阻止更新时, 光标保持原样
      if (res === false) {
        self.cursor = self.prevCursor;
        update();
        return false;
      }

      const [v, cur] = res;

      val = v;
      cursor = cur;
      cursorIsChange = true;
    }

    if (cursorIsChange) {
      self.cursor = cursor;
    }

    calcTextHeight(val);

    setValue(val);

    // 存在字符处理后和前一个value相同的情况, 需要手动更新来触发光标修复等行为
    if (interceptorList.length && val === value) {
      update();
    }
  });

  /** 手动设置值并通过change()触发更新 */
  function manualChange(val: string) {
    inputRef.current.value = val;
    return change();
  }

  function focusHandle(e: React.FocusEvent<HTMLInputElement, Element>) {
    if (disabled) return;
    onFocus(e);
    setFocus(true);
  }

  function blurHandle(e: React.FocusEvent<HTMLInputElement, Element>) {
    // 数字类型时, 失焦时强制转换为有效数字(处理输入一半特殊数值, 如 `123.`), 其他情况在拦截器中已处理
    if (isNumberType && value) {
      if (value.endsWith(".")) {
        manualChange(value.slice(0, -1));
      }
    }
    onBlur(e);
    setFocus(false);
  }

  function keyDownHandle(e: React.KeyboardEvent<HTMLInputElement>) {
    // 记录变更前的关闭位置
    self.prevCursor = [
      inputRef.current.selectionStart || 0,
      inputRef.current.selectionEnd || 0,
    ];

    onKeyDown(e);
    if (e.code === "Enter") {
      searchHandle();
      onPressEnter(e);
    }
  }

  /* 密码开/关 */
  function passwordTypeChange() {
    setType((prev) => (prev === "password" ? "text" : "password"));
  }

  /* 触发搜索 */
  function searchHandle() {
    onSearch(inputRef.current.value);
  }

  /* 清空输入框 */
  function clearHandle() {
    const res = manualChange("");

    // 更新被阻止时不通知
    if (res !== false) {
      onClear?.();
      inputRef.current.focus();

      setTimeout(() => {
        // 清空后、触发搜索，并且在autoSize启用时时更新高度
        searchHandle();
      });
    }
  }

  /** 根据tType设置input实际应该使用的type */
  function getRealType() {
    if (isNumberType) {
      // https://github.com/facebook/react/issues/16554#issuecomment-657075924
      // 使用number类型时, 输入是无效数字不会触发onChange, 而我们需要在移动设备上弹出数字键盘, 所以使用tel
      return "tel";
    }

    if (type === InputType.password) return InputType.password;

    return "text";
  }

  function getStyle(): React.CSSProperties {
    return textArea
      ? {
          height: textAreaHeight,
          overflow: autoSize ? "hidden" : "auto",
          resize: autoSize ? "none" : undefined,
        }
      : {};
  }

  /** 动态决定输入框的tag类型 */
  const TagType = (textArea ? "textarea" : "input") as "input";

  /** 时候显示清空按钮 */
  const hasClearBtn =
    clear && !!value && value.length > 3 && !isDisabled && !readonly;

  /** 输入框右侧区域 */
  function renderRight() {
    const nodes: React.ReactNode[] = [];

    if (hasClearBtn) {
      nodes.push(
        <IconClear
          onClick={clearHandle}
          className="m78-input_icon m78-input_icon-clear"
        />
      );
    }

    if (loading || blockLoading) {
      nodes.push(
        <span className="m78-input_icon">
          <Spin size="small" full={blockLoading} />
        </span>
      );
    }

    if (_type === "password" && !textArea) {
      nodes.push(
        type === "password" ? (
          <IconVisibility
            onClick={passwordTypeChange}
            className="m78-input_icon"
          />
        ) : (
          <IconVisibilityOff
            onClick={passwordTypeChange}
            className="m78-input_icon"
          />
        )
      );
    }

    if (suffix && !textArea) {
      nodes.push(<span className="m78-input_suffix">{suffix}</span>);
    }

    if ((textArea || charCount) && value) {
      nodes.push(
        <span className="m78-input_tip-text">
          {value.length}
          {maxLength
            ? `/${maxLength}`
            : i18n.t("word count", { ns: [INPUT_NS] })}
        </span>
      );
    }

    if (search && !textArea) {
      nodes.push(
        <IconSearch
          role="button"
          aria-label="search"
          tabIndex={0}
          className="m78-input_icon"
          {...keypressAndClick(searchHandle)}
        />
      );
    }

    if (stepper) {
      nodes.push(stepperNode);
    }

    if (nodes.length && !textArea) {
      nodes.unshift(<Divider vertical margin={4} />);
    }

    return React.createElement(React.Fragment, null, ...nodes);
  }

  return (
    <span
      className={clsx(
        "m78 m78-init m78-input",
        className,
        status && `__${status}`,
        size && `__${size}`,
        {
          "__no-border": !textArea && border,
          __focus: focus,
          __disabled: isDisabled,
          __textarea: textArea,
          __readonly: readonly,
          __stepper: stepper,
        }
      )}
      style={style}
      ref={innerWrapRef}
    >
      {prefix && !textArea && (
        <>
          <span className="m78-input_prefix">{prefix}</span>
          <Divider vertical margin={4} />
        </>
      )}
      <TagType
        {...props}
        type={getRealType()}
        readOnly={readonly}
        disabled={isDisabled}
        className="m78-input_inner"
        ref={inputRef}
        value={value}
        onChange={change}
        onFocus={focusHandle}
        onBlur={blurHandle}
        onKeyDown={keyDownHandle}
        onCompositionStart={() => (self.isComposing = true)}
        onCompositionEnd={(e) => {
          self.isComposing = false;
          // onCompositionEnd在onChange之后执行, 所以我们要手动触发通知合成事件结束
          // 两种事件非常相似, 并且用户基本上不需要再额外处理 Composition 事件, 这里使用折中方案强制同步其类型
          // 实际代码如有需要区分的场景, 使用e.nativeEvent.type
          change(e as unknown as React.ChangeEvent<HTMLInputElement>);
        }}
        style={getStyle()}
      />
      {renderRight()}
    </span>
  );
}

_Input.displayName = "Input";
