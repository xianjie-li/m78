import React from 'react';
import Form, { Item } from 'm78/form';
import Input from 'm78/input';
import Button from 'm78/button';
import { CloseOutlined } from 'm78/icon';

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
    <Item label="朋友" name="friends" required>
      <Form.List name="friends">
        {(fields, operations) => (
          <div>
            {fields.map(filed => (
              <div key={filed.key} className="mt-12">
                <Item noStyle style={{ width: 200 }} name={[filed.name, 'name']} required>
                  <Input />
                </Item>
                <Item noStyle style={{ width: 200 }} name={[filed.name, 'age']} required>
                  <Input />
                </Item>
                <Button className="ml-16" icon onClick={() => operations.remove(filed.name)}>
                  <CloseOutlined />
                </Button>
              </div>
            ))}
            <Button className="mt-12" onClick={() => operations.add()}>
              新增一个朋友
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
