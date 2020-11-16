import React from 'react';
import Form, { Item } from 'm78/form';
import Input from 'm78/input';
import Button from 'm78/button';

const List = () => (
  <Form
    onFinish={e => {
      // eslint-disable-next-line no-alert
      alert(JSON.stringify(e, null, 4));
    }}
  >
    <Form.Item label="你的名字" name="name" required>
      <Input placeholder="输入名字" />
    </Form.Item>
    <Item label="家庭关系" name="friends" required>
      <Form.List name="friends">
        {(fields, operations) => (
          <div style={{ width: '100%' }}>
            {fields.map(filed => (
              <Form.Item key={filed.key}>
                <Form.Item name={[filed.name, 'name']} required>
                  <Input placeholder="姓名" />
                </Form.Item>
                <Form.Item name={[filed.name, 'age']} required>
                  <Input placeholder="年龄" />
                </Form.Item>
                <Button className="ml-16" onClick={() => operations.remove(filed.name)}>
                  删除
                </Button>
              </Form.Item>
            ))}
            <Button className="mt-12" onClick={() => operations.add()}>
              添加
            </Button>
          </div>
        )}
      </Form.List>
    </Item>
    <Form.Footer>
      <Button type="submit" color="blue">
        提交
      </Button>
    </Form.Footer>
  </Form>
);

export default List;
