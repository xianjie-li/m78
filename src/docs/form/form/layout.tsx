import React, { useState } from 'react';
import Form, { FormProps } from '@lxjx/fr/lib/form';
import Input from '@lxjx/fr/lib/input';
import Button from '@lxjx/fr/lib/button';

const Base = () => {
  const [layout, setLayout] = useState(false);
  const [column, setColumn] = useState<any>(undefined);

  return (
    <div>
      <Button style={{ marginBottom: 48 }} onClick={() => setLayout(prev => !prev)}>
        {layout ? 'horizontal' : 'vertical'}
      </Button>
      <Button
        style={{ marginBottom: 48 }}
        onClick={() => setColumn((prev: any) => (prev === undefined ? 3 : undefined))}
      >
        {column === undefined ? '多列' : '单列'}
      </Button>

      <Form
        onFinish={e => {
          // eslint-disable-next-line no-alert
          alert(JSON.stringify(e, null, 4));
        }}
        layout={layout ? 'horizontal' : 'vertical'}
        column={column}
      >
        <Form.Title title="表单布局" desc="内置多种布局方式并提供了一些布局性组件" />

        <Form.SubTitle title="表单区域1" />
        <Form.Item label="手机号" name="phone" type="string" required>
          <Input placeholder="请输入" format="phone" />
        </Form.Item>
        <Form.Item label="姓名" name="name" required>
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item label="地址" name="address" required>
          <Input placeholder="请输入" />
        </Form.Item>

        <Form.SubTitle title="表单区域2" />
        <Form.Item label="爱好" name="like" required>
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item label="生日" name="bd" required>
          <Input placeholder="请输入" />
        </Form.Item>

        <Form.Footer>
          <Button type="submit" color="blue">
            提交
          </Button>
        </Form.Footer>
      </Form>
    </div>
  );
};

export default Base;
