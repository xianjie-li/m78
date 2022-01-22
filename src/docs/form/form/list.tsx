import React from 'react';
import { useForm, array, required, string } from 'm78/form';
import { Input } from 'm78/input';
import { Row, Spacer } from 'm78/layout';
import { DirectionEnum } from 'm78/common';
import { Button } from 'm78/button';
import { ArrowDownOutlined, ArrowUpOutlined, DeleteOutlined } from 'm78/icon';

const List = () => {
  const Form = useForm({
    maxWidth: 540,
  });

  Form.submitEvent.useEvent(values => {
    alert(JSON.stringify(values, undefined, 4));
  });

  return (
    <div>
      <Form.Field name="name" label="发货人" validator={[required(), string({ min: 2 })]}>
        <Input placeholder="输入发货人" />
      </Form.Field>

      <Form.List name="user" label="收货人" validator={[required(), array({ max: 3 })]}>
        {lProps => (
          <div className="pt-12">
            {lProps.list.map((item, index) => {
              const max = lProps.list.length - 1;
              const min = 0;
              const prev = index - 1 < min ? max - 1 : index - 1;
              const next = index + 1 > max ? min : index + 1;

              return (
                <Row key={item.key}>
                  <Spacer width={16}>
                    <Form.Field
                      bind={item.bind}
                      name="address"
                      layout={DirectionEnum.horizontal}
                      validator={[required()]}
                    >
                      <Input placeholder="输入地址" />
                    </Form.Field>
                    <Form.Field
                      bind={item.bind}
                      name="phone"
                      layout={DirectionEnum.horizontal}
                      validator={[required()]}
                    >
                      <Input placeholder="输入联系方式" />
                    </Form.Field>
                    <Button className="ml-12" onClick={() => lProps.move(index, prev)}>
                      <ArrowUpOutlined />
                    </Button>
                    <Button onClick={() => lProps.move(index, next)}>
                      <ArrowDownOutlined />
                    </Button>
                    <Button onClick={() => lProps.remove(index)}>
                      <DeleteOutlined className="color-red" />
                    </Button>
                  </Spacer>
                </Row>
              );
            })}
            <Button onClick={lProps.add}>添加收货人</Button>
          </div>
        )}
      </Form.List>

      <Button color="primary" onClick={Form.submit}>
        提交
      </Button>
      <Button onClick={Form.reset}>重置</Button>
    </div>
  );
};

export default List;
