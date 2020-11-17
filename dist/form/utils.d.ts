import { NamePath } from 'rc-field-form/es/interface';
import { FormItemProps, FormProps } from './type';
/** 从错误字符数组中取第一位 */
export declare function getFirstError(errors?: string[]): string | undefined;
/** 根据错误字符和是否验证中获取status */
export declare function getStatus(error?: string, loading?: boolean): any;
export declare function getFlatRules(props: FormItemProps, fullRules?: FormProps['rules']): readonly [import("rc-field-form/es/interface").Rule[], boolean];
/** 将NamePath转换为字符串 */
export declare function getNameString(name?: NamePath): string | number | undefined;
