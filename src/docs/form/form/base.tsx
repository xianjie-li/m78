import React from 'react';
import { useForm, email, required, string } from 'm78/form';
import { Input } from 'm78/input';
import { Button } from 'm78/button';

const Base = () => {
  const Form = useForm();

  Form.submitEvent.useEvent(values => {
    alert(JSON.stringify(values, undefined, 4));
  });

  return (
    <div>
      <Form.Field name="name" label="用户名" validator={[required(), string({ min: 2 })]}>
        <Input placeholder="输入用户名" />
      </Form.Field>
      <Form.Field name="email" label="邮箱" validator={[required(), email()]}>
        <Input placeholder="输入邮箱" />
      </Form.Field>
      <Form.Field name="desc" label="概要" validator={[string({ min: 6 })]}>
        <Input placeholder="介绍一下你自己" textArea />
      </Form.Field>

      <Button color="primary" onClick={Form.submit}>
        提交
      </Button>
      <Button onClick={Form.reset}>重置</Button>
    </div>
  );
};

export default Base;
