import React from 'react';
import Form from '@lxjx/fr/lib/form';
import Input from '@lxjx/fr/lib/input';
import Button from '@lxjx/fr/lib/button';

const Base = () => (
  <Form
    onFinish={e => {
      // eslint-disable-next-line no-alert
      alert(JSON.stringify(e, null, 4));
    }}
  >
    <Form.Item label="手机号" name="phone" type="string" required pattern={/^1\d{10}$/}>
      <Input placeholder="输入手机号" format="phone" />
    </Form.Item>
    <Form.Item label="收货地址" name="address" required min={10}>
      <Input placeholder="输入收货地址" textArea />
    </Form.Item>
    <Form.Footer>
      <Button type="submit" color="blue">
        提交
      </Button>
    </Form.Footer>
  </Form>
);

export default Base;
