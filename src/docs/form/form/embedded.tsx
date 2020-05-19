import React from 'react';
import Form from '@lxjx/fr/lib/form';
import Input from '@lxjx/fr/lib/input';
import Button from '@lxjx/fr/lib/button';

const Embedded = () => (
  <Form
    onFinish={e => {
      // eslint-disable-next-line no-alert
      alert(JSON.stringify(e, null, 4));
    }}
  >
    <Form.Item label="手机号" name="phone" required>
      <Input placeholder="输入手机号" format="phone" />
    </Form.Item>

    <Form.Item label="收货地址" name="address">
      <Form.Item noStyle name={['address', 'name']} required style={{ width: 200 }}>
        <Input placeholder="输入姓名" />
      </Form.Item>
      <Form.Item noStyle name={['address', 'desc']} required style={{ width: 200 }}>
        <Input placeholder="输入地址" />
      </Form.Item>
    </Form.Item>

    <Form.Item label="物流" name="address">
      <Form.Item noStyle name={['type', 0]} required style={{ width: 200 }}>
        <Input placeholder="指定快递公司" />
      </Form.Item>
      <Form.Item noStyle name={['type', 1]} required style={{ width: 200 }}>
        <Input placeholder="备注" />
      </Form.Item>
    </Form.Item>

    <Form.Footer>
      <Button type="submit" color="blue">
        提交
      </Button>
    </Form.Footer>
  </Form>
);

export default Embedded;
