import React, { useState } from 'react';
import { Form } from 'm78/form';
import { Input } from 'm78/input';
import { Button } from 'm78/button';
import { ListViewItemStyleEnum } from 'm78/list-view';

const Base = () => {
  const [layout, setLayout] = useState(false);
  const [column, setColumn] = useState<any>(undefined);
  const [border, setBorder] = useState(true);
  const [itemStyle, setItemStyle] = useState(ListViewItemStyleEnum.none);

  return (
    <div>
      <div className="mb-16">
        <Button onClick={() => setLayout(prev => !prev)}>
          {layout ? 'horizontal' : 'vertical'}
        </Button>
        <Button onClick={() => setColumn((prev: any) => (prev === undefined ? 3 : undefined))}>
          {column === undefined ? '多列' : '单列'}
        </Button>
        <Button onClick={() => setBorder(prev => !prev)}>边框 ({border ? '开' : '关'})</Button>
        <Button onClick={() => setItemStyle(ListViewItemStyleEnum.border)}>项边框</Button>
        <Button onClick={() => setItemStyle(ListViewItemStyleEnum.splitLine)}>项分割线</Button>
        <Button onClick={() => setItemStyle(ListViewItemStyleEnum.none)}>无分割样式</Button>
      </div>

      <Form
        onFinish={e => {
          // eslint-disable-next-line no-alert
          alert(JSON.stringify(e, null, 4));
        }}
        layout={layout ? 'horizontal' : 'vertical'}
        column={column}
        itemStyle={itemStyle}
        border={border}
      >
        <Form.Title desc="内置多种布局方式并提供了一些布局性组件">表单布局</Form.Title>

        <Form.Title subTile>子标题</Form.Title>
        <Form.Item label="手机号" name="phone" type="string" required>
          <Input placeholder="请输入" format="phone" />
        </Form.Item>
        <Form.Item label="姓名" name="name" required>
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item label="地址" name="address" required>
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item label="爱好" name="like" required>
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item label="生日" name="bd" required>
          <Input placeholder="请输入" />
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

export default Base;
