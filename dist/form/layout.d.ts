import React from 'react';
import { FormItemLayoutProps, FormLayoutProps } from './type';
export declare function FormLayout({ className, children, layout, itemStyle, style, ...ppp }: FormLayoutProps): JSX.Element;
export declare function FormItemLayout({ label, children, desc, errorNode, required, innerRef, className, ...ppp }: FormItemLayoutProps): JSX.Element;
export declare const FormActions: React.FC;
