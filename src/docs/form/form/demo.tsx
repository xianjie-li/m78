import Form, { Item } from '@lxjx/fr/form';
import React, { useState } from 'react';
import Input from '@lxjx/fr/input';
import Button from '@lxjx/fr/button';
import { CloseCircleOutlined } from '@lxjx/fr/icon';

const Demo = () => {
  const submitHandle = (e: any) => {
    console.log(e);
  };

  const [show, setShow] = useState(false);

  return (
    <Form
      layout="horizontal"
      onFinish={submitHandle}
      disabled={show}
      initialValues={{
        name: 'lxj',
        age: '3',
      }}
    >
      {/* <Form.Title title="基础表单" /> */}
      <Item
        dependencies={['age']}
        valid={(namePath, form) => form.getFieldValue('age') !== '3'}
        name="name"
        label="姓名"
        required
        max={6}
        min={3}
        len={6}
        validator={(rule, value, callback) => {
          setTimeout(() => {
            if (value === 'lxj') {
              callback('名字不能为lxj');
            } else {
              callback();
            }
          }, 1000);
        }}
      >
        <Input />
      </Item>
      <Item name="age" label="年龄">
        <Input />
      </Item>
      <Item label="地址">
        <Item
          noStyle
          style={{ width: 178, marginRight: 12 }}
          name={['address', 'shen']}
          rules={[{ required: true }]}
        >
          <Input />
        </Item>
        <Item noStyle style={{ width: 178 }} name={['address', 'name']}>
          <Input />
        </Item>
      </Item>
      <Item label="朋友">
        <Form.List name="friends">
          {(fields, operations) => (
            <div>
              {fields.map(filed => (
                <div key={filed.key} className="mt-12">
                  <Item
                    noStyle
                    style={{ width: 178, marginRight: 12 }}
                    name={[filed.name, 'name']}
                    required
                  >
                    <Input />
                  </Item>
                  <Item noStyle style={{ width: 178 }} name={[filed.name, 'age']} required>
                    <Input />
                  </Item>
                  <Button icon onClick={() => operations.remove(filed.name)}>
                    <CloseCircleOutlined />
                  </Button>
                </div>
              ))}
              <Button className="mt-12" onClick={() => operations.add()}>
                新增
              </Button>
            </div>
          )}
        </Form.List>
      </Item>
      <Form.Footer>
        <Button type="submit" color="blue">
          submit
        </Button>
        <Button onClick={() => setShow(prev => !prev)}>click</Button>
      </Form.Footer>
    </Form>
  );
};

export default Demo;
