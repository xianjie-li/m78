import React from 'react';
import { useForm } from 'm78/form';
import { required } from '@m78/verify';
import { Input } from 'm78/input';

const ValueRenderDemo = () => {
  const Form = useForm();

  return (
    <div>
      <Form.Field name="name" label="名字" validator={[required()]}>
        <Input placeholder="输入内容" />
      </Form.Field>

      <Form.ValueRender name="name">{value => <div>名字: {value}</div>}</Form.ValueRender>
    </div>
  );
};

export default ValueRenderDemo;
