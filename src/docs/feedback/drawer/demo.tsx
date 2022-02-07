import React from 'react';
import { Drawer } from 'm78/drawer';
import { Button } from 'm78/button';
import { useForm } from 'm78/form';
import { ListView, ListViewItem } from 'm78/list-view';
import { Check } from 'm78/check';
import { PositionEnum } from 'm78/common';
import { required } from '@m78/verify';
import { Input } from 'm78/input';
import { Row } from 'm78/layout';

const Demo = () => {
  const Form = useForm();

  Form.submitEvent.useEvent(values => {
    alert(JSON.stringify(values, null, 4));
  });

  return (
    <div>
      <Drawer
        style={{
          width: 600,
          height: 400,
        }}
        header={<div className="fs-22">标题</div>}
        content={
          <ListView>
            <ListViewItem leading="🍊" title="橘子" arrow />
            <ListViewItem leading="🍉" title="西瓜" arrow />
            <ListViewItem leading="🥝" title="猕猴桃" arrow desc="水果之王" />
            <ListViewItem leading="🍇" title="葡萄" trailing={<Check type="switch" />} />
            <ListViewItem leading="🍓" title="草莓" arrow trailing="其实不是水果" />
          </ListView>
        }
      >
        <Button>bottom</Button>
      </Drawer>

      <Drawer
        position={PositionEnum.right}
        header={<div>标题</div>}
        style={{ width: 400 }}
        content={
          <div className="pt-12">
            <Form.Field name="name" label="用户名" validator={[required()]}>
              <Input placeholder="请输入用户名" />
            </Form.Field>
            <Form.Field name="psw" label="密码" validator={[required()]}>
              <Input placeholder="请输入密码" type="password" />
            </Form.Field>

            <Row mainAlign="end">
              <Button color="primary" onClick={Form.submit}>
                submit
              </Button>
            </Row>
          </div>
        }
      >
        <Button>right</Button>
      </Drawer>

      <Drawer
        position={PositionEnum.top}
        header={<div>标题</div>}
        style={{ width: 400 }}
        content={
          <div className="pt-12">
            <Form.Field name="name" label="用户名" validator={[required()]}>
              <Input placeholder="请输入用户名" />
            </Form.Field>
            <Form.Field name="psw" label="密码" validator={[required()]}>
              <Input placeholder="请输入密码" type="password" />
            </Form.Field>

            <Row mainAlign="end">
              <Button color="primary" onClick={Form.submit}>
                submit
              </Button>
            </Row>
          </div>
        }
      >
        <Button>top</Button>
      </Drawer>

      <Drawer
        position={PositionEnum.left}
        header={<div>标题</div>}
        content={
          <div style={{ width: 400, paddingTop: 12 }}>
            <Form.Field name="name" label="用户名" validator={[required()]}>
              <Input placeholder="请输入用户名" />
            </Form.Field>
            <Form.Field name="psw" label="密码" validator={[required()]}>
              <Input placeholder="请输入密码" type="password" />
            </Form.Field>

            <Row mainAlign="end">
              <Button color="primary" onClick={Form.submit}>
                submit
              </Button>
            </Row>
          </div>
        }
      >
        <Button>left</Button>
      </Drawer>

      <Button
        onClick={() => {
          Drawer.render({
            content: (
              <div style={{ width: 400, paddingTop: 12 }}>
                <Form.Field name="name" label="用户名" validator={[required()]}>
                  <Input placeholder="请输入用户名" />
                </Form.Field>
                <Form.Field name="psw" label="密码" validator={[required()]}>
                  <Input placeholder="请输入密码" type="password" />
                </Form.Field>

                <Row mainAlign="end">
                  <Button color="primary" onClick={Form.submit}>
                    submit
                  </Button>
                </Row>
              </div>
            ),
          });
        }}
      >
        通过api使用
      </Button>
    </div>
  );
};

export default Demo;
