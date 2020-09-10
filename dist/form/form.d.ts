import React from 'react';
import { FormProvider, List as FormList } from 'rc-field-form';
import List, { Title, SubTitle, Footer } from 'm78/list';
import { FormProps } from './type';
import Item from './item';
declare const BaseForm: React.FC<FormProps>;
declare type Form = typeof BaseForm;
interface FormWithExtra extends Form {
    FormProvider: typeof FormProvider;
    Item: typeof Item;
    List: typeof FormList;
    Title: typeof Title;
    SubTitle: typeof SubTitle;
    Footer: typeof Footer;
}
declare const Form: FormWithExtra;
export { FormProvider, Item, List, Title, SubTitle, Footer };
export default Form;
