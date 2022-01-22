import { useFn } from '@lxjx/hooks';
import React, { useMemo } from 'react';
import { isFunction } from '@lxjx/utils';
import clsx from 'clsx';
import { FieldProps, ListBind, ListProps, ListRenderProps, RForm, RFormConfig } from './types';
import { omitFieldProps, defaultFieldRenderChildren } from './common';

export function listFactory(form: RForm, Field: (props: FieldProps) => any, config: RFormConfig) {
  const defaultRender = config.listCustomer || defaultFieldRenderChildren;

  function List(props: ListProps) {
    const { children, ...passProps } = props;
    const omitProps = omitFieldProps(props);

    const vList = useMemo(
      () =>
        form.createList({
          ...omitProps,
          validator: isFunction(omitProps.validator) ? [] : omitProps.validator,
        }),
      [],
    );

    const add: ListRenderProps['add'] = useFn(val => {
      vList.add({
        fillValue: val,
      });
    });

    // 复用Field的逻辑
    return (
      <Field
        {...passProps}
        field={vList}
        className={clsx('m78-form_list', props.className)}
        customer={rProps => {
          /** 生成项渲染数据源 */
          const list = vList.list.map((item, index) => {
            const bind: ListBind = {
              instance: vList,
              index,
              key: item.key,
            };

            return {
              key: item.key,
              bind,
            };
          });

          const render = props.customer || defaultRender;

          return render(
            rProps,
            children({
              list,
              add,
              remove: vList.remove,
              move: vList.move,
              swap: vList.swap,
            }),
          );
        }}
      >
        <></>
      </Field>
    );
  }

  return List;
}
