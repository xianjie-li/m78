import { isArray, isEmpty } from '@lxjx/utils';
import { NamePath } from 'rc-field-form/es/interface';
import { FormItemProps } from './type';

/** 从错误字符数组中取第一位 */
export function getFirstError(errors?: string[]) {
  if (!errors) return undefined;
  if (!errors.length) return undefined;
  return errors[0];
}

/** 根据错误字符和是否验证中获取status */
export function getStatus(error?: string, loading?: boolean) {
  let status: any;

  if (!error) return undefined;

  if (error) {
    status = 'error';
  }

  if (loading) {
    status = 'loading';
  }

  return status;
}

export function getFlatRules(props: FormItemProps) {
  const {
    rules: _rules = [],
    enum: enums,
    required,
    len,
    max,
    message,
    min,
    pattern,
    transform,
    type,
    validator,
    whitespace,
  } = props;

  const rules = {
    enums,
    required,
    len,
    max,
    message,
    min,
    pattern,
    transform,
    type,
    whitespace,
  };

  const nextRule = [..._rules];

  for (const [key, val] of Object.entries(rules)) {
    if (val === undefined) {
      delete rules[key as keyof typeof rules];
    }
  }

  if (!isEmpty(rules)) {
    nextRule.unshift(rules);
  }

  // validator需要放到单独的rule中
  // 验证器永远在最后验证，因为可能会是异步验证器
  if (validator !== undefined) {
    nextRule.push({
      validator,
    });
  }

  const isRequired = nextRule.some((item: any) => item.required);

  return [nextRule, isRequired] as const;
}

/** 将NamePath转换为字符串 */
export function getNameString(name?: NamePath) {
  return isArray(name) ? name.join('-') : name;
}
