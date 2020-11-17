/// <reference types="react" />
import { FormInstance } from 'rc-field-form';
import { FormProps } from './type';
interface FormInsideContext {
    /** 表单实例 */
    form: FormInstance;
    /** 为Item分配valueChange事件, 因为表单更新走不到Field的外层 */
    onChangeTriggers: {
        [key: string]: (changeValue: any) => void;
    };
    /** 表单是否禁用 */
    disabled: boolean;
    /** 隐藏所有必选标记 */
    hideRequiredMark: boolean;
    /** 表示该表单的唯一id */
    id: string;
    /** 直接传入rules配置来进行表单验证 */
    rules?: FormProps[''];
}
declare const context: import("react").Context<FormInsideContext>;
export default context;
