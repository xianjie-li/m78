import React from 'react';
import { Form, FormRenderChild } from 'm78/form';
import { Input } from 'm78/input';
import { Button } from 'm78/button';

const customRender: FormRenderChild = (control, meta) => {
  return (
    <div style={{ margin: '12px 0', color: meta.status === 'error' ? 'red' : undefined }}>
      <div>
        {meta.label}
        <span className="color-error">
          {meta.required && '*'}
          <span className="ml-12">{meta.errorString}</span>
        </span>
      </div>
      <div>
        <Input {...control} />
      </div>
    </div>
  );
};

const Custom = () => {
  return (
    <Form
      noStyle
      onFinish={e => {
        alert(JSON.stringify(e, null, 4));
      }}
      style={{ padding: 20, maxWidth: 560 }}
    >
      <Form.Item noStyle label="手机号" name="phone" required>
        {customRender}
      </Form.Item>
      <Form.Item noStyle label="密码" name="psw" required>
        {customRender}
      </Form.Item>
      <Form.Actions>
        <Button type="submit" color="blue">
          提交
        </Button>
      </Form.Actions>
    </Form>
  );
};

export default Custom;
