import React from 'react';
import { isVerifyEmpty, useForm, Validator, required } from 'm78/form';
import { Input } from 'm78/input';

const myString = (opt: { max?: number; min?: number; length?: number }): Validator => ({
  value,
}) => {
  // 如果是组件认可的空值则不进行验证
  if (isVerifyEmpty(value)) return;

  if (typeof value !== 'string') return '必须是字符串';
  if (opt.min && value.length < opt.min) return `长度不能小于${opt.min}`;
  if (opt.max && value.length > opt.max) return `长度不能大于${opt.max}`;
  if (opt.length && value.length !== opt.length) return `长度必须是${opt.length}`;
};

const ValidatorDemo = () => {
  const Form = useForm();

  return (
    <div>
      <Form.Field
        name="f1"
        label="长度 6 > a > 3"
        validator={[required(), myString({ min: 3, max: 6 })]}
      >
        <Input placeholder="输入内容" />
      </Form.Field>

      <Form.Field name="f2" label="长度 4" validator={[required(), myString({ length: 4 })]}>
        <Input placeholder="输入内容" />
      </Form.Field>
    </div>
  );
};

export default ValidatorDemo;
