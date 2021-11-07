import { Form, FormItem } from 'm78/form';
import React, { useState } from 'react';
import { Input } from 'm78/input';
import { Button } from 'm78/button';
import { CloseCircleOutlined } from 'm78/icon';

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
      <FormItem
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
      </FormItem>
      <FormItem name="age" label="年龄">
        <Input />
      </FormItem>
      <FormItem label="地址">
        <FormItem
          noStyle
          style={{ width: 178, marginRight: 12 }}
          name={['address', 'shen']}
          rules={[{ required: true }]}
        >
          <Input />
        </FormItem>
        <FormItem noStyle style={{ width: 178 }} name={['address', 'name']}>
          <Input />
        </FormItem>
      </FormItem>
      <FormItem label="朋友">
        <Form.List name="friends">
          {(fields, operations) => (
            <div>
              {fields.map(filed => (
                <div key={filed.key} className="mt-12">
                  <FormItem
                    noStyle
                    style={{ width: 178, marginRight: 12 }}
                    name={[filed.name, 'name']}
                    required
                  >
                    <Input />
                  </FormItem>
                  <FormItem noStyle style={{ width: 178 }} name={[filed.name, 'age']} required>
                    <Input />
                  </FormItem>
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
      </FormItem>

      <Form.Actions>
        <Button type="submit" color="blue">
          submit
        </Button>
        <Button onClick={() => setShow(prev => !prev)}>click</Button>
      </Form.Actions>
    </Form>
  );
};

export default Demo;
