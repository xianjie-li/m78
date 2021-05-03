import React from 'react';
import { Form } from 'm78/form';
import { Input } from 'm78/input';
import { Button } from 'm78/button';
import { Divider } from 'm78/layout';

const Inline = () => {
  return (
    <div>
      <h3>共用一个label</h3>

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
        <Form.Actions>
          <Button type="submit" color="blue">
            提交
          </Button>
        </Form.Actions>
      </Form>

      <h3 style={{ marginTop: 100 }}>独立的label</h3>

      <Form
        onFinish={e => {
          alert(JSON.stringify(e, null, 4));
        }}
      >
        <Form.Item label="手机号" name="phone" required>
          <Input placeholder="输入手机号" format="phone" />
        </Form.Item>
        <Form.Item>
          <Form.Item label="姓名" name={['address', 'name']} required>
            <Input placeholder="输入姓名" />
          </Form.Item>
          <Form.Item label="地址" name={['address', 'desc']} required>
            <Input placeholder="输入地址" />
          </Form.Item>
        </Form.Item>
        <Form.Item required>
          <Form.Item label="公司" name={['type', 0]} required>
            <Input placeholder="指定快递公司" />
          </Form.Item>
          <Form.Item label="备注" name={['type', 1]} required>
            <Input placeholder="输入备注" />
          </Form.Item>
        </Form.Item>
        <Form.Actions>
          <Button type="submit" color="blue">
            提交
          </Button>
        </Form.Actions>
      </Form>

      <h3 style={{ marginTop: 100 }}>横向布局</h3>

      <Form
        layout="horizontal"
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

        <Divider margin={30} />

        <Form.Item>
          <Form.Item label="公司" name={['type', 0]} required>
            <Input placeholder="指定快递公司" />
          </Form.Item>
          <Form.Item label="备注" name={['type', 1]} required>
            <Input placeholder="填写备注" />
          </Form.Item>
        </Form.Item>
        <Form.Actions>
          <Button type="submit" color="blue">
            提交
          </Button>
        </Form.Actions>
      </Form>
    </div>
  );
};

export default Inline;
