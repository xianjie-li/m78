import React from 'react';
import { email, required, string, useForm } from 'm78/form';
import { Input } from 'm78/input';
import { Button } from 'm78/button';

const Base = () => {
  const Form = useForm({
    bubbleTips: true,
  });

  Form.submitEvent.useEvent(values => {
    alert(JSON.stringify(values, undefined, 4));
  });

  return (
    <div>
      <Form.Field
        name="name"
        label="用户名"
        validator={[required(), string({ min: 2 })]}
        extra="这是一段额外的提示文本"
      >
        <Input placeholder="输入用户名" />
      </Form.Field>
      <Form.Field
        name="email"
        label="邮箱"
        validator={[required(), email()]}
        extra={
          <div>
            <div>这是一段额外的提示文本</div>
            <div>这是另一段额外的提示文本</div>
          </div>
        }
      >
        <Input placeholder="输入邮箱" />
      </Form.Field>
      <Form.Field name="desc" label="概要" validator={[required(), string({ min: 6 })]}>
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
