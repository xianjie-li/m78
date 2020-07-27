import React, { useContext, useEffect, useMemo } from 'react';
import { AnyObject, createRandString, isArray, isFunction } from '@lxjx/utils';
import { useUpdate } from 'react-use';
import _has from 'lodash/has';
import List from '@lxjx/fr/list';
import { FormInstance } from 'rc-field-form/es/interface';
import { Field } from 'rc-field-form';
import cls from 'classnames';
import FormContext from './context';
import { getFirstError, getFlatRules, getNameString, getStatus } from './utils';
import { FormItemCustomMeta, FormItemProps } from './type';

const Item: React.FC<FormItemProps> = props => {
  /** 该字段的唯一id */
  const id = useMemo(() => createRandString(2), []);
  /** 根据传入的name生成字符串 */
  const nameString = getNameString(props.name);

  const {
    form,
    onChangeTriggers,
    disabled: contextDisabled,
    id: formId,
    rules: fullRules,
  } = useContext(FormContext);

  const selector = nameString ? `FR-FORM-ITEM-${formId}-${nameString}` : undefined;

  const {
    children,
    name = nameString,
    style,
    className,
    label,
    extra,
    desc,
    disabled,
    noStyle,
    visible: _visible = true,
    valid: _valid = true,
    dependencies,
    required,
    ...otherProps
  } = props;

  const [rules, isRequired] = getFlatRules(props, fullRules);

  const update = useUpdate();

  const valid = isFunction(_valid) ? _valid(name!, form) : _valid;

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

  if (!valid) {
    return null;
  }

  const visible = isFunction(_visible) ? _visible(name!, form) : _visible;

  const _style = { display: visible ? undefined : 'none', ...style };

  const isDisabled = disabled || contextDisabled;

  const title = label || nameString;

  // 无name时仅作为布局组件使用
  if (!name) {
    return (
      <List.Item
        desc={desc}
        extra={extra}
        title={title}
        disabled={isDisabled}
        required={isRequired}
        style={_style}
        className={className}
      >
        {children}
      </List.Item>
    );
  }

  /** 根据render prop参数渲染children */
  function renderChildren(control: AnyObject, meta: FormItemCustomMeta, _form: FormInstance) {
    if (isFunction(children)) {
      return children(control, meta, _form);
    }

    if (!React.isValidElement(children)) {
      return children;
    }

    return React.cloneElement<any>(children, {
      name: nameString,
      disabled: meta.disabled,
      status: meta.status,
      loading: children.type === 'input' ? undefined : meta.validating,
      ...control,
    });
  }

  return (
    <Field
      validateFirst
      name={name}
      {...otherProps}
      dependencies={dependencies}
      rules={rules}
      messageVariables={{ label: label || '' }}
    >
      {(control, meta, _form) => {
        const { errors, validating } = meta;
        const errorString = getFirstError(errors);

        const status = getStatus(errorString, validating);

        const customMeta = {
          ...meta,
          disabled: isDisabled,
          required: isRequired,
          status,
          errorString,
        };

        const child = renderChildren(control, customMeta, _form);

        if (noStyle) {
          return (
            <div id={selector} className={cls('fr-form_item', className)} style={_style}>
              <div>{child}</div>
              {isRequired && (
                <span className="fr-list_require fr-form_item-mark" title="必填项">
                  *
                </span>
              )}
              {errorString && <div className="fr-form_item-extra">{errorString}</div>}
            </div>
          );
        }

        return (
          <List.Item
            id={selector}
            desc={desc}
            extra={extra}
            title={title}
            disabled={isDisabled}
            required={isRequired}
            style={_style}
            className={className}
            footLeft={errorString}
            status={status}
          >
            {child}
          </List.Item>
        );
      }}
    </Field>
  );
};

export default Item;
