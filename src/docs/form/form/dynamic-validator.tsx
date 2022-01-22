import React from 'react';
import { useForm } from 'm78/form';
import { Check } from 'm78/check';
import { required, specific, string } from '@m78/verify';
import { Input } from 'm78/input';
import { Button } from 'm78/button';

const DynamicValidator = () => {
  const Form = useForm({});

  Form.submitEvent.useEvent(values => {
    alert(JSON.stringify(values, undefined, 4));
  });

  return (
    <div>
      <Form.Field name="nameRequired" label="姓名是否必填" valueKey="checked" defaultValue>
        <Check />
      </Form.Field>

      <Form.Field
        name="name"
        label="姓名"
        validator={form =>
          form.getValue('nameRequired')
            ? [required(), string({ length: 5 })]
            : [string({ length: 5 })]
        }
        deps={['nameRequired']}
      >
        <Input placeholder="输入内容" />
      </Form.Field>

      <Form.Field
        name="name2"
        label="重复姓名"
        validator={form => [required(), specific(form.getValue('name'))]}
        deps={['name']}
      >
        <Input placeholder="请重复输入姓名" />
      </Form.Field>

      <Button color="primary" onClick={Form.submit}>
        提交
      </Button>
      <Button onClick={Form.reset}>重置</Button>
    </div>
  );
};

export default DynamicValidator;
