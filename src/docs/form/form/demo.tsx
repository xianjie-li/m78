import Form, { Item } from '@lxjx/fr/lib/form';
import React, { useState, useRef } from 'react';
import RForm, { Field, List } from 'rc-field-form';
import Input from '@lxjx/fr/lib/input';
import Button from '@lxjx/fr/lib/button';
import { CloseCircleOutlined } from '@lxjx/fr/lib/icon';

const Demo = () => {
  const submitHandle = (e: any) => {
    console.log(e);
  };

  const [show, setShow] = useState(true);

  return (
    <Form
      onFinish={submitHandle}
      initialValues={{
        name: 'lxj',
        age: 3,
      }}
    >
      <Item
        // dependencies={['age']}
        // valid={(namePath, form) => form.getFieldValue('age') !== '3'}
        name="name"
        label="姓名"
        // required
        // rules={[{ required: true, max: 6, min: 2 }]}
      >
        <Input />
      </Item>
      <Item
        visible={show}
        name="age"
        label="年龄"
        rules={[{ type: 'number', required: true, max: 6, min: 2, transform: value => +value }]}
      >
        <Input />
      </Item>
      <Item
        label="地址"
        dependencies={['age']}
        valid={(namePath, form) => form.getFieldValue('age') !== '3'}
      >
        <Item
          noStyle
          style={{ width: 178, marginRight: 12 }}
          name={['address', 'shen']}
          rules={[{ required: true }]}
        >
          <Input />
        </Item>
        <Item
          noStyle
          style={{ width: 178 }}
          name={['address', 'name']}
          rules={[{ required: true }]}
        >
          <Input />
        </Item>
      </Item>
      <Item label="朋友">
        <List name="friends">
          {(fields, operations) => (
            <div>
              {fields.map(filed => (
                <div key={filed.key} className="mt-12">
                  <Item
                    noStyle
                    style={{ width: 178, marginRight: 12 }}
                    name={[filed.name, 'name']}
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Item>
                  <Item
                    noStyle
                    style={{ width: 178 }}
                    name={[filed.name, 'age']}
                    rules={[{ required: true }]}
                  >
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
        </List>
      </Item>
      <Button type="submit" color="blue">
        submit
      </Button>
      <Button onClick={() => setShow(prev => !prev)}>click</Button>
    </Form>
  );
};

export default Demo;
