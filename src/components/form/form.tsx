import React, { useEffect, useMemo, useRef, useState } from 'react';
import RForm, { useForm, FormProvider, List as FormList } from 'rc-field-form';
import List, { Title, SubTitle, Footer } from '@lxjx/fr/lib/list';
import Schema from 'async-validator';
import { createRandString, isFunction } from '@lxjx/utils';
import { useFn, useScroll } from '@lxjx/hooks';
import { ValidateErrorEntity } from 'rc-field-form/es/interface';
import { checkElementVisible, dumpFn, getFirstScrollParent } from '@lxjx/fr/lib/util';
import cls from 'classnames';
import { createMessagesTemplate } from '@lxjx/async-filed-cn-template';

import { FormProps } from './type';
import { getNameString } from './utils';
import FormContext from './context';
import Item from './item';

const msgTpl = createMessagesTemplate({ hasName: false /* nameKey: 'label' */ });

// @ts-ignore
Schema.warning = () => {};

const BaseForm: React.FC<FormProps> = props => {
  const {
    children,
    style,
    className,
    notBorder,
    layout,
    column,
    fullWidth,
    disabled = false,
    form: _form,
    onValuesChange,
    hideRequiredMark = false,
    rules,
    ...otherProps
  } = props;
  /** 该表单的唯一id */
  const id = useMemo(() => createRandString(2), []);

  const flagEl = useRef<HTMLSpanElement>(null!);

  const [form] = useForm(_form);

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

  useEffect(() => {
    const el = getFirstScrollParent(flagEl.current);

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

  const finishFailedHandle = useFn((arg: ValidateErrorEntity) => {
    const { errorFields, outOfDate } = arg;
    props.onFinishFailed?.(arg);

    if (outOfDate) return;

    const firstName = errorFields?.[0]?.name;

    if (!firstName) return;

    const el = document.getElementById(`FR-FORM-ITEM-${id}-${getNameString(firstName)}`);

    if (!el) return;

    const visible = checkElementVisible(el, {
      wrapEl: scrollParent || undefined,
      fullVisible: true,
    });

    /* TODO: 高亮组件完成后可以添加一个高亮效果 */
    !visible && scrollToElement(el);
  });

  return (
    <FormContext.Provider value={{ ...contextValue, rules, disabled, hideRequiredMark }}>
      <List
        form
        style={style}
        className={cls(
          className,
          'fr-form',
          contextValue.hideRequiredMark && '__hide-required-mark',
        )}
        notBorder={notBorder}
        layout={layout}
        column={column}
        fullWidth={fullWidth}
        disabled={disabled}
      >
        {/* <Button icon className="fr-form_setting" title="表单设置"> */}
        {/*  <SettingOutlined /> */}
        {/* </Button> */}
        <RForm
          validateMessages={msgTpl}
          {...otherProps}
          onValuesChange={changeHandle}
          form={form}
          onFinishFailed={finishFailedHandle}
        >
          {children}
        </RForm>
        <span ref={flagEl} />
      </List>
    </FormContext.Provider>
  );
};

type Form = typeof BaseForm;

interface FormWithExtra extends Form {
  FormProvider: typeof FormProvider;
  Item: typeof Item;
  List: typeof FormList;
  Title: typeof Title;
  SubTitle: typeof SubTitle;
  Footer: typeof Footer;
}

const Form: FormWithExtra = Object.assign(BaseForm, {
  FormProvider,
  Item,
  List: FormList,
  Title,
  SubTitle,
  Footer,
});

export { FormProvider, Item, List, Title, SubTitle, Footer };
export default Form;
