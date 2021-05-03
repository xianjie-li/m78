import React from 'react';
import { FormProvider, List as FormList } from 'rc-field-form';
import { ListViewTitle as FormTitle } from 'm78/list-view';
import { FormProps } from './type';
import FormItem from './item';
import { FormActions } from './layout';
declare const BaseForm: React.FC<FormProps>;
declare type Form = typeof BaseForm;
interface FormWithExtra extends Form {
    FormProvider: typeof FormProvider;
    Item: typeof FormItem;
    List: typeof FormList;
    Title: typeof FormTitle;
    Actions: typeof FormActions;
}
declare const Form: FormWithExtra;
export { FormProvider, FormItem, FormTitle, FormActions };
export default Form;
