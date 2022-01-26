import React from 'react';
import { m78Config } from 'm78/config';

import './style.scss';
import { Button } from 'm78/button';
import { OverlayDirectionEnum } from 'm78/overlay';

import { Dialog } from 'm78/dialog';
import { delay } from '@lxjx/utils';
import { TransitionTypeEnum } from 'm78/transition';
import { useForm, required } from 'm78/form';
import { Input } from 'm78/input';

const App = () => {
  const dark = m78Config.useState(state => state.darkMode);

  const Form = useForm();

  return (
    <div className="m78 p-16">
      <button
        style={{ position: 'fixed', right: 12, top: 12 }}
        type="button"
        onClick={() => m78Config.set({ darkMode: !m78Config.get().darkMode })}
      >
        {dark ? 'dark' : 'light'}
      </button>

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

/*
 * 分割线
 * */

export default App;
