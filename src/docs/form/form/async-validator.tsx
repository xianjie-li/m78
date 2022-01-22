import React from 'react';
import { isVerifyEmpty, useForm, AsyncValidator, required } from 'm78/form';
import { Input } from 'm78/input';
import { delay } from '@lxjx/utils';

const myAsyncValidator = (): AsyncValidator => async ({ value }) => {
  // 如果是组件认可的空值则不进行验证
  if (isVerifyEmpty(value)) return;

  // 这里应该是一个异步请求或其他异步操作
  await delay(800);

  if (value !== 'lxj') return '用户信息异常, 必须为 `lxj`';
};

const ValidatorDemo = () => {
  const Form = useForm();

  return (
    <div>
      <Form.Field name="name" label="姓名" validator={[required(), myAsyncValidator()]}>
        <Input placeholder="请输入姓名" />
      </Form.Field>
    </div>
  );
};

export default ValidatorDemo;
