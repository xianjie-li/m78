import React from 'react';
import { Form } from 'm78/form';
import { Input } from 'm78/input';
import { Button } from 'm78/button';

const Base = () => (
  <Form
    onFinish={e => {
      alert(JSON.stringify(e, null, 4));
    }}
  >
    <Form.Item label="手机号" name="phone" type="string" required pattern={/^1\d{10}$/}>
      <Input placeholder="输入手机号" format="phone" />
    </Form.Item>
    <Form.Item label="收货地址" name="address" required min={10}>
      <Input placeholder="输入收货地址" textArea />
    </Form.Item>
    <Form.Actions>
      <Button type="submit" color="blue">
        提交
      </Button>
    </Form.Actions>
  </Form>
);

export default Base;
