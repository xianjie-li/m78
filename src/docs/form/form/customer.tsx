import React from 'react';
import { LayoutCustomer, useForm } from 'm78/form';
import { Input } from 'm78/input';
import { Button } from 'm78/button';
import { required, string } from '@m78/verify';

const myCustomer: LayoutCustomer = ({ fieldProps, required: require, field }, child) => {
  return (
    <div style={{ marginBottom: 12 }}>
      <div className="fs-18 mb-4">
        {fieldProps.label} {require && '*'}
      </div>
      <div>{child}</div>
      <div className="color-red">{field.touched && field.error}</div>
    </div>
  );
};

const Customer = () => {
  const Form = useForm({
    fieldCustomer: myCustomer,
  });

  Form.submitEvent.useEvent(values => {
    alert(JSON.stringify(values, undefined, 4));
  });

  return (
    <div>
      <Form.Field name="filed1" label="字段1" validator={[required(), string({ max: 6, min: 2 })]}>
        <Input placeholder="输入内容" />
      </Form.Field>
      <Form.Field name="filed2" label="字段2" validator={[required(), string({ max: 6, min: 2 })]}>
        <Input placeholder="输入内容" />
      </Form.Field>
      <Form.Field name="filed3" label="字段3" validator={[required(), string({ max: 6, min: 2 })]}>
        <Input placeholder="输入内容" />
      </Form.Field>

      <Button color="primary" onClick={Form.submit}>
        提交
      </Button>
      <Button onClick={Form.reset}>重置</Button>
    </div>
  );
};

export default Customer;
