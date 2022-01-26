import React from 'react';
import { required, useForm } from 'm78/form';
import { Input } from 'm78/input';
import { Button } from 'm78/button';
import { Dialog } from 'm78/dialog';

const Form = () => {
  const Form = useForm();

  return (
    <div>
      <Dialog
        title="录入登录信息"
        content={
          <div>
            <Form.Field name="name" label="用户名" validator={[required()]}>
              <Input placeholder="请输入用户名" />
            </Form.Field>
            <Form.Field name="psw" label="密码" validator={[required()]}>
              <Input placeholder="请输入密码" type="password" />
            </Form.Field>
          </div>
        }
        onClose={async isConfirm => {
          if (isConfirm) {
            const rej = await Form.verify();

            if (rej) return false;

            alert(JSON.stringify(Form.getValues(), null, 4));
          }
        }}
      >
        <Button>渲染表单</Button>
      </Dialog>
    </div>
  );
};

export default Form;
