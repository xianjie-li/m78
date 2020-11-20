import React from 'react';
import Form from 'm78/form';
import Input from 'm78/input';
import Button from 'm78/button';

const Embedded = () => (
  <Form
    onFinish={e => {
      alert(JSON.stringify(e, null, 4));
    }}
  >
    <Form.Item label="手机号" name="phone" required>
      <Input placeholder="输入手机号" format="phone" />
    </Form.Item>

    <Form.Item label="基本信息" required>
      <Form.Item name={['address', 'name']} required>
        <Input placeholder="输入姓名" />
      </Form.Item>
      <Form.Item name={['address', 'desc']} required>
        <Input placeholder="输入地址" />
      </Form.Item>
    </Form.Item>
    <Form.Item label="物流信息" required>
      <Form.Item name={['type', 0]} required>
        <Input placeholder="指定快递公司" />
      </Form.Item>
      <Form.Item name={['type', 1]} required>
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
