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
    <Form.Item label="通过rules验证" name="rules" rules={[{ required: true, max: 10, min: 2 }]}>
      <Input placeholder="随便输入点什么" />
    </Form.Item>
    <Form.Item label="通过flat props验证" name="flat" type="string" required max={10} min={2}>
      <Input placeholder="随便输入点什么" />
    </Form.Item>
    <Form.Item
      label="自定义验证器"
      name="validator"
      validator={(rule, value) =>
        new Promise((res, rej) => {
          if (!value) {
            rej('该项必填');
          }
          if (value.length > 10 || value.length < 2) {
            rej('长度为2-10之间');
          }
          res();
        })
      }
    >
      <Input placeholder="随便输入点什么" />
    </Form.Item>
    <Form.Item
      label="异步验证器"
      name="asyncValidator"
      validator={(rule, value) =>
        new Promise((res, rej) => {
          setTimeout(() => {
            if (!value) {
              rej('该项必填');
              return;
            }
            if (value.length > 10 || value.length < 2) {
              rej('长度为2-10之间');
            }
            res();
          }, 1000);
        })
      }
    >
      <Input placeholder="随便输入点什么" />
    </Form.Item>
    <Form.Footer>
      <Button type="submit" color="blue">
        提交
      </Button>
    </Form.Footer>
  </Form>
);

export default Base;
