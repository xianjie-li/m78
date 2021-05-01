import React from 'react';
import { Form, useForm } from 'm78/form';
import { Input } from 'm78/input';
import { Button } from 'm78/button';

interface Values {
  phone: string;
  psw: string;
}

const Instance = () => {
  const [form] = useForm<Values>();

  // 也可以同ref来获取表单实例
  // const ref = useRef<FormInstance<Values>>(null!);

  return (
    <div>
      <Form
        form={form}
        // instanceRef={ref}
        onFinish={e => {
          alert(JSON.stringify(e, null, 4));
        }}
      >
        <Form.Item label="手机号" name="phone" required>
          <Input />
        </Form.Item>
        <Form.Item label="密码" name="psw" required>
          <Input />
        </Form.Item>
        <Form.Footer>
          <Button
            onClick={() => {
              form.submit();
            }}
          >
            提交
          </Button>
          <Button
            onClick={() => {
              form.setFieldsValue({
                phone: '12312341234',
                psw: '1234',
              });
            }}
          >
            设置值
          </Button>
          <Button
            onClick={() => {
              alert(JSON.stringify(form.getFieldsValue(), null, 4));
            }}
          >
            获取值
          </Button>
          <Button
            onClick={() => {
              form.validateFields();
            }}
          >
            验证
          </Button>
          <Button
            onClick={() => {
              form.resetFields();
            }}
          >
            重置
          </Button>
        </Form.Footer>
      </Form>
    </div>
  );
};

export default Instance;
