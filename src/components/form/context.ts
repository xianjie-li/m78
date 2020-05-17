import { createContext } from 'react';
import { FormInstance } from 'rc-field-form';

interface FormInsideContext {
  /** 表单实例 */
  form: FormInstance;
  /** 为Item分配valueChange事件, 因为表单更新走不到Field的外层 */
  onChangeTriggers: { [key: string]: (changeValue: any) => void };
  /** 表单是否禁用 */
  disabled: boolean;
  /** 隐藏所有必选标记 */
  hideRequiredMark: boolean;
  /** 表示该表单的唯一id */
  id: string;
}

const context = createContext<FormInsideContext>({
  form: (undefined as unknown) as FormInstance,
  onChangeTriggers: {},
  disabled: false,
  hideRequiredMark: false,
  id: '',
});

context.displayName = 'Fr-form-context';

export default context;
