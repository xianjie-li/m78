import React, { useContext, useEffect, useMemo } from 'react';
import RForm, { Field, useForm } from 'rc-field-form';
import List from '@lxjx/fr/lib/list';

import Schema from 'async-validator';
import cls from 'classnames';
import { createRandString, isArray, isFunction } from '@lxjx/utils';
import { useFn } from '@lxjx/hooks';
import _has from 'lodash/has';
import { useUpdate } from 'react-use';
import { FormProps, FormItemProps } from './type';
import { getFirstError, getStatus } from './utils';
import FormContext from './context';

// @ts-ignore
Schema.warning = () => {};

const Form: React.FC<FormProps> = props => {
  const {
    children,
    style,
    className,
    notBorder,
    layout,
    column,
    fullWidth,
    disabled,
    form: _form,
    onValuesChange,
    ...otherProps
  } = props;

  const [form] = useForm(_form);

  const contextValue = useMemo(
    () => ({
      form,
      onChangeTriggers: {},
    }),
    [],
  );

  // 由于存在valid属性，Field可能并未被渲染，所以需要在值更新时手动对比dependencies决定是否要更新组件
  const changeHandle = useFn((...arg: [any, any]) => {
    onValuesChange?.(...arg);
    for (const [, trigger] of Object.entries(contextValue.onChangeTriggers)) {
      isFunction(trigger) && trigger(...arg);
    }
  });

  return (
    <FormContext.Provider value={contextValue}>
      <List
        form
        style={style}
        className={className}
        notBorder={notBorder}
        layout={layout}
        column={column}
        fullWidth={fullWidth}
        disabled={disabled}
      >
        <RForm {...otherProps} onValuesChange={changeHandle} form={form}>
          {children}
        </RForm>
      </List>
    </FormContext.Provider>
  );
};

const Item: React.FC<FormItemProps> = props => {
  /** 该字段的唯一id */
  const id = useMemo(() => createRandString(2), []);
  /** 根据传入的name生成字符串 */
  const nameString = isArray(props.name) ? props.name.join('-') : props.name;

  const { form, onChangeTriggers } = useContext(FormContext);

  const {
    children,
    name = nameString,
    style,
    className,
    label,
    extra,
    desc,
    required,
    disabled,
    noStyle,
    visible: _visible = true,
    valid: _valid = true,
    dependencies,
    ...otherProps
  } = props;

  const update = useUpdate();

  // 由于存在valid属性，Field可能并未被渲染，所以需要在值更新时手动对比dependencies决定是否要更新组件
  useEffect(() => {
    onChangeTriggers[id] = (changeValue: any) => {
      if (dependencies && dependencies.length && changeValue) {
        const isDepsChange = dependencies.some(item => {
          if (isArray(item)) {
            return _has(changeValue, item);
          }
          return item in changeValue;
        });

        isDepsChange && update();
      }
    };

    return () => {
      delete onChangeTriggers[id];
    };
  }, []);

  const valid = isFunction(_valid) ? _valid(name!, form) : _valid;

  if (!valid) {
    return null;
  }

  const visible = isFunction(_visible) ? _visible(name!, form) : _visible;

  const _style = { display: visible ? undefined : 'none', ...style };

  if (!name || !React.isValidElement(children)) {
    return (
      <List.Item
        desc={desc}
        extra={extra}
        title={label}
        disabled={disabled}
        required={required}
        style={_style}
        className={className}
      >
        {children}
      </List.Item>
    );
  }

  return (
    <Field name={name} {...otherProps} messageVariables={{ label: label || '' }}>
      {(control, { errors, validating }) => {
        const errorString = getFirstError(errors);

        const status = getStatus(errorString, validating);

        const cloneEl = React.cloneElement<any>(children, {
          name,
          disabled,
          loading: children.type === 'input' ? undefined : validating,
          status,
          ...control,
        });

        return noStyle ? (
          <div className={cls('fr-form_item', className)} style={_style}>
            <div>{cloneEl}</div>
            {errorString && <div className="fr-form_item-extra">{errorString}</div>}
          </div>
        ) : (
          <List.Item
            desc={desc}
            extra={extra}
            title={label}
            disabled={disabled}
            required={required}
            style={_style}
            className={className}
            footLeft={errorString}
            status={status}
          >
            {cloneEl}
          </List.Item>
        );
      }}
    </Field>
  );
};

export { Item };
export default Form;
