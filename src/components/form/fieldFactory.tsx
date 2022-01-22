import { useFn, useSelf, useUpdate } from '@lxjx/hooks';
import React, { useMemo, useRef } from 'react';
import { ensureArray, isFunction, stringifyNamePath, triggerHighlight } from '@lxjx/utils';
import { requiredValidatorKey } from '@m78/verify';
import { FieldProps, FieldRenderProps, RForm, RFormConfig } from './types';
import {
  defaultFieldProps,
  defaultFieldRenderChildren,
  omitFieldProps,
  useFieldStatus,
} from './common';

export function fieldFactory(form: RForm, config: RFormConfig) {
  const defaultRender = config.fieldCustomer || defaultFieldRenderChildren;

  function Field(props: FieldProps) {
    const other = omitFieldProps(props);
    const pBind = props.bind;

    const name = useMemo(() => {
      if (!pBind) return props.name;
      return pBind.instance.withName(pBind.index, props.name);
    }, [props.name]);

    // 获取或创建field实例
    const field = useMemo(() => {
      // 如果传入了field, 则不创建直接使用传入的field
      if (props.field) return props.field;

      // 如果该name的字段已存在list中则直接返回
      if (pBind) {
        const cur = pBind.instance.list.find(item => item.key === pBind.key);
        if (cur) {
          const existField = cur.list.find(item => item.key === stringifyNamePath(name));
          if (existField) return existField;
        }
      }

      const f = form.createField({
        ...other,
        name,
        separate: !!pBind,
        validator: isFunction(other.validator) ? [] : other.validator,
      });

      if (pBind) {
        pBind.instance.add({
          fields: [f],
          key: pBind.key,
        });
      }

      return f;
    }, []);

    const innerRef = useRef<any>();

    const update = useUpdate();

    const self = useSelf({
      /** 标记是否需要进行更新操作 */
      updateCount: 0,
      /** 提交验证失败后定位到表单的计时器 */
      triggerHighlightTimer: null as any,
    });

    const statusPub = {
      changeFlag: self.updateCount,
      form,
      field,
    };

    // 处理动态validator
    useMemo(() => {
      if (!isFunction(props.validator)) return;
      field.validator = props.validator(form, field);

      if (field.touched) {
        // 验证器变更且字段已touch, 执行一次验证操作
        field.verify();
      }
    }, [self.updateCount]);

    const required = useMemo(() => {
      if (props.hideRequiredMark) return false;
      return ensureArray(field.validator).some(v => {
        return v?.key === requiredValidatorKey;
      });
    }, [props.validator, self.updateCount]);

    const deps = useMemo(() => [name, ...props.deps!], props.deps);

    const hidden = useFieldStatus(props.hidden, false, statusPub);

    const valid = useFieldStatus(props.valid, true, statusPub);

    const disabled = useFieldStatus(props.disabled, false, statusPub);

    field.valid = valid && !disabled;

    form.changeEvent.useEvent(changes => {
      // 相关field更新后更新组件
      if (form.listIncludeNames(deps, changes)) {
        self.updateCount += 1;
        update();

        // 当前值实际变更时才触发的动作
        if (form.listIncludeNames([name], changes)) {
          props.onChange?.(field.value);
          field.verify();
        }
      }
    });

    form.updateEvent.useEvent(changes => {
      if (form.listIncludeNames(deps, changes)) {
        self.updateCount += 1;
        update();
      }
    });

    form.failEvent.useEvent((fields, isSubmit) => {
      if (!isSubmit) return;

      if (!innerRef.current) return;
      const first = fields[0];

      if (first === field) {
        clearTimeout(self.triggerHighlightTimer);
        self.triggerHighlightTimer = setTimeout(() => {
          triggerHighlight(innerRef.current);

          const inp: HTMLElement | null = innerRef.current.querySelector('input,select,textarea');

          if (inp && isFunction(inp.focus)) inp.focus();
        });
      }
    });

    const change = useFn(v => {
      v = props.getValueFromEvent!(v);
      if (isFunction(props.formatter)) v = props.formatter(v);

      field.value = v;
    });

    const bind = {
      [props.changeKey!]: change,
      [props.valueKey!]: isFunction(props.parser) ? props.parser(field.value) : field.value,
      disabled,
    };

    const childProps: FieldRenderProps = {
      bind,
      field,
      fieldProps: props,
      hidden,
      required,
      innerRef,
    };

    if (!valid) return null;

    const child = React.cloneElement(props.children, bind);

    return isFunction(props.customer)
      ? props.customer(childProps, child)
      : defaultRender(childProps, child);
  }

  Field.defaultProps = {
    ...defaultFieldProps,
    bubbleTips: config.bubbleTips || defaultFieldProps.bubbleTips,
    hideRequiredMark: config.hideRequiredMark || defaultFieldProps.hideRequiredMark,
    layout: config.layout || defaultFieldProps.layout,
    maxWidth: config.maxWidth || defaultFieldProps.maxWidth,
  };

  return Field;
}
