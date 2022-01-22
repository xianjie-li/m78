import React from 'react';
import { required, string, useForm } from 'm78/form';
import { Input } from 'm78/input';

const Verify = () => {
  const Form = useForm();

  return (
    <div>
      <Form.Field name="user" label="用户名" validator={[required(), string({ min: 2, max: 6 })]}>
        <Input placeholder="输入用户名" />
      </Form.Field>
    </div>
  );
};

export default Verify;
