import React from 'react';
import { Form } from 'm78/form';
import { Input } from 'm78/input';
import { Button } from 'm78/button';
import { Check } from 'm78/check';

const Linkage = () => (
  <Form
    onFinish={e => {
      // eslint-disable-next-line no-alert
      alert(JSON.stringify(e, null, 4));
    }}
  >
    <Form.Item label="登录凭证" name="code" required>
      <Input placeholder="输入`111`" />
    </Form.Item>

    <Form.Item
      label="输入密码"
      name="psw"
      required
      dependencies={['code']}
      valid={(name, form) => form.getFieldValue('code') === '111'}
    >
      <Input placeholder="输入密码" type="password" />
    </Form.Item>

    <Form.Item noStyle name="other" valuePropName="checked">
      <Check label="填点其他的" />
    </Form.Item>

    <Form.Item
      label="你是?"
      name="whoAreYou"
      dependencies={['other']}
      visible={(name, form) => !!form.getFieldValue('other')}
    >
      <Input placeholder="请输入" />
    </Form.Item>

    <Form.Actions>
      <Button type="submit" color="blue">
        提交
      </Button>
    </Form.Actions>
  </Form>
);

export default Linkage;
