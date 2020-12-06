/// <reference types="react" />
import 'm78/base';
import { ButtonPropsWithHTMLButton, ButtonPropsWithHTMLLink } from './type';
declare function Button(btnProps: ButtonPropsWithHTMLLink): JSX.Element;
declare function Button(btnProps: ButtonPropsWithHTMLButton): JSX.Element;
export default Button;
