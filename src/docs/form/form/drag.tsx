import React from 'react';
import { Form, FormItem } from 'm78/form';
import { Input } from 'm78/input';
import { DND, DNDContext } from 'm78/dnd';
import { isTruthyOrZero } from '@lxjx/utils';
import classNames from 'clsx';
import { Button } from 'm78/button';
import { DeleteOutlined, DragOutlined } from 'm78/icon';

const Drag = () => {
  return (
    <div>
      <Form
        onFinish={e => {
          // eslint-disable-next-line no-alert
          alert(JSON.stringify(e, null, 4));
        }}
      >
        <Form.Item label="你的名字" name="name" required>
          <Input placeholder="输入名字" />
        </Form.Item>
        <FormItem label="家庭关系" name="friends" required>
          <Form.List name="friends">
            {(fields, operations) => (
              <DNDContext
                onAccept={e => {
                  const target = e.target?.data;
                  const source = e.source?.data;

                  if (isTruthyOrZero(target) && isTruthyOrZero(source)) {
                    console.log(target, source);
                    operations.move(source, target);
                  }
                }}
              >
                <div style={{ width: '100%' }}>
                  {fields.map((filed, index) => (
                    <DND data={index} key={filed.key}>
                      {({ innerRef, handleRef, status }) => (
                        <Form.Item
                          innerRef={innerRef}
                          className={classNames('m78-dnd-box mt-12', {
                            // 禁用、拖动到中间的状态
                            __active: status.dragOver,
                            __disabled: status.dragging,
                          })}
                        >
                          <Form.Item name={[filed.name, 'name']} required>
                            <Input placeholder="姓名" />
                          </Form.Item>
                          <Form.Item name={[filed.name, 'age']} required>
                            <Input placeholder="年龄" />
                          </Form.Item>
                          <Button
                            icon
                            className="ml-16"
                            onClick={() => operations.remove(index)}
                            style={{ flex: '0 0 auto' }}
                          >
                            <DeleteOutlined />
                          </Button>
                          <Button innerRef={handleRef} icon style={{ flex: '0 0 auto' }}>
                            <DragOutlined />
                          </Button>
                        </Form.Item>
                      )}
                    </DND>
                  ))}
                  <Button className="mt-12" onClick={() => operations.add()}>
                    添加
                  </Button>
                </div>
              </DNDContext>
            )}
          </Form.List>
        </FormItem>
        <Form.Actions>
          <Button type="submit" color="blue">
            提交
          </Button>
        </Form.Actions>
      </Form>
    </div>
  );
};

export default Drag;
