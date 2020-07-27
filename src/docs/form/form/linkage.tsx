import React from 'react';
import Form from '@lxjx/fr/form';
import Input from '@lxjx/fr/input';
import Button from '@lxjx/fr/button';
import Check from '@lxjx/fr/check';

const Linkage = () => (
  <Form
    onFinish={e => {
      // eslint-disable-next-line no-alert
      alert(JSON.stringify(e, null, 4));
    }}
  >
    <Form.Item label="登录凭证" name="code" required>
      <Input placeholder="输入`1111`" />
    </Form.Item>
    <Form.Item
      label="输入密码"
      name="psw"
      required
      dependencies={['code']}
      valid={(name, form) => form.getFieldValue('code') === '1111'}
    >
      <Input placeholder="输入密码" type="password" />
    </Form.Item>

    <Form.Item noStyle name="other" valuePropName="checked">
      <Check className="ml-8" label="填点其他的" />
    </Form.Item>
    <Form.Item
      label="你是?"
      name="whoAreYou"
      required
      dependencies={['other']}
      visible={(name, form) => !!form.getFieldValue('other')}
    >
      <Input placeholder="请输入" />
    </Form.Item>

    <Form.Footer>
      <Button type="submit" color="blue">
        提交
      </Button>
    </Form.Footer>
  </Form>
);

export default Linkage;
