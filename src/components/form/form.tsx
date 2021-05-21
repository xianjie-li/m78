import React, { useEffect, useMemo, useRef, useState } from 'react';
import RForm, { useForm, FormProvider, List as FormList } from 'rc-field-form';
import Schema from 'async-validator';
import {
  createRandString,
  isFunction,
  getScrollParent,
  checkElementVisible,
  triggerHighlight,
} from '@lxjx/utils';
import { useFn, useScroll } from '@lxjx/hooks';
import { ValidateErrorEntity } from 'rc-field-form/es/interface';
import cls from 'clsx';
import { createMessagesTemplate } from '@lxjx/validate-tools';

import { ListViewTitle as FormTitle } from 'm78/list-view';
import { FormProps } from './type';
import { getNameString } from './utils';
import FormContext from './context';
import FormItem from './item';
import { FormLayout, FormActions } from './layout';

const msgTpl = createMessagesTemplate({ hasName: false /* nameKey: 'label' */ });

// @ts-ignore
Schema.warning = () => {};

const BaseForm: React.FC<FormProps> = props => {
  const {
    children,
    style,
    className,
    layout,
    column,
    disabled = false,
    form: _form,
    onValuesChange,
    hideRequiredMark = false,
    rules,
    noStyle,
    instanceRef,
    border,
    size,
    itemStyle,
    fullWidth,
    ...otherProps
  } = props;
  /** 该表单的唯一id */
  const id = useMemo(() => createRandString(), []);

  // 标记表单元素所在节点
  const flagEl = useRef<HTMLSpanElement>(null!);

  const [form] = useForm(_form);

  // 首个可滚动父级
  const [scrollParent, setScrollParent] = useState<HTMLElement | undefined>();

  const { scrollToElement } = useScroll({
    el: scrollParent,
    offsetX: -(window.innerWidth * 0.3),
    offsetY: -(window.innerHeight * 0.3),
  });

  const [contextValue] = useState(() => ({
    form,
    onChangeTriggers: {},
    disabled,
    hideRequiredMark,
    id,
    rules,
  }));

  /* TODO: 节点变更时重新进行获取 */
  useEffect(() => {
    const el = getScrollParent(flagEl.current);

    if (el) {
      setScrollParent(el);
    }
  }, []);

  // 由于存在valid属性，Field可能并未被渲染，所以需要在值更新时手动对比dependencies决定是否要更新组件
  const changeHandle = useFn((...arg: [any, any]) => {
    onValuesChange?.(...arg);
    for (const [, trigger] of Object.entries(contextValue.onChangeTriggers)) {
      isFunction(trigger) && trigger(...arg);
    }
  });

  // 提交验证错误时高亮第一个未通过元素
  const finishFailedHandle = useFn((arg: ValidateErrorEntity) => {
    const { errorFields, outOfDate } = arg;
    props.onFinishFailed?.(arg);

    if (outOfDate) return;

    const firstName = errorFields?.[0]?.name;

    if (!firstName) return;

    const el = document.getElementById(`m78-FORM-ITEM-${id}-${getNameString(firstName)}`);

    if (!el) return;

    /* TODO: 调整类型 */
    triggerHighlight(el, { useOutline: false } as any);

    const { visible } = checkElementVisible(el, {
      wrapEl: scrollParent,
      fullVisible: true,
      offset: 0,
    });

    if (!visible) {
      scrollToElement(el);
    }
  });

  function renderWrap(node: React.ReactNode) {
    const _fullWidth = fullWidth && '__full-width';
    const _requiredMark = contextValue.hideRequiredMark && '__hide-required-mark';

    if (noStyle) {
      return (
        <div style={style} className={cls(className, 'm78-form', _fullWidth, _requiredMark)}>
          {node}
        </div>
      );
    }

    return (
      <FormLayout
        style={style}
        className={cls(className, _fullWidth, _requiredMark)}
        border={border}
        layout={layout}
        column={column}
        size={size}
        itemStyle={itemStyle}
      >
        {node}
      </FormLayout>
    );
  }

  return (
    <FormContext.Provider value={{ ...contextValue, rules, disabled, hideRequiredMark }}>
      {renderWrap(
        <>
          {/* <Button icon className="m78-form_setting" title="表单设置"> */}
          {/* <SettingOutlined /> */}
          {/* </Button> */}
          <RForm<{ name: string }>
            ref={instanceRef}
            validateMessages={msgTpl}
            {...otherProps}
            onValuesChange={changeHandle}
            form={form}
            onFinishFailed={finishFailedHandle}
          >
            {children}
          </RForm>
          <span ref={flagEl} />
        </>,
      )}
    </FormContext.Provider>
  );
};

type Form = typeof BaseForm;

interface FormWithExtra extends Form {
  FormProvider: typeof FormProvider;
  Item: typeof FormItem;
  List: typeof FormList;
  Title: typeof FormTitle;
  Actions: typeof FormActions;
}

const Form: FormWithExtra = Object.assign(BaseForm, {
  FormProvider,
  Item: FormItem,
  List: FormList,
  Title: FormTitle,
  Actions: FormActions,
});

export { FormProvider, FormItem, FormTitle, FormActions };
export default Form;
