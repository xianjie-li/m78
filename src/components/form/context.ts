import { createContext } from 'react';
import { FormInstance } from 'rc-field-form';

interface FormInsideContext {
  /** 表单实例 */
  form: FormInstance;
  /** 为Item分配valueChange事件, 因为表单更新走不到Field的外层 */
  onChangeTriggers: { [key: string]: (changeValue: any) => void };
}

const context = createContext<FormInsideContext>({
  form: (undefined as unknown) as FormInstance,
  onChangeTriggers: {},
});

context.displayName = 'Fr-form-context';

export default context;
