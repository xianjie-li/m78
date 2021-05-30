import React from 'react';
import { Button } from 'm78/button';
import { Divider } from 'm78/layout';
import { createAuth } from 'm78/auth';
import { message } from 'm78/message';
import { createSeed } from 'm78/seed';

const seed = createSeed({
  /* 被所有验证器依赖数据 */
  state: {
    /** 登录用户 */
    user: '',
    /** 是否是管理员 */
    admin: 2,
  },
});

const Auth = createAuth({
  seed,
  /* 声明验证器 */
  validators: {
    // 登录状态验证器
    login(state) {
      if (!state.user) {
        // 验证未通过时，返回提示信息，还可以同时返回对应的操作
        return {
          label: '未登录',
          desc: '请登录后再进行操作',
          actions: [
            // 每一项都是一个Button props
            {
              label: '去登陆',
              color: 'red',
              onClick() {
                message.tips({
                  content: '去登陆',
                });
              },
            },
            {
              label: '算了',
              onClick() {
                message.tips({
                  content: '算了',
                });
              },
            },
          ],
        };
      }
    },
    // 是否是管理员
    admin(deps) {
      if (deps.admin !== 1) {
        return {
          label: '管理员可用',
          desc: '请联系管理员执行此操作!',
          actions: [
            // 每一项都是一个Button props
            {
              label: '联系管理员',
              color: 'blue',
              onClick() {
                message.tips({
                  content: '联系管理员',
                });
              },
            },
          ],
        };
      }
    },
  },
});

const BaseDemo = () => {
  return (
    <div>
      <Button size="small" onClick={() => seed.setState({ user: 'lxj' })}>
        登录
      </Button>
      <Button size="small" onClick={() => seed.setState({ user: '' })}>
        退出
      </Button>

      <Divider vertical />

      <Button size="small" onClick={() => seed.setState({ admin: 1 })}>
        设为管理员
      </Button>
      <Button size="small" onClick={() => seed.setState({ admin: 2 })}>
        移除管理权限
      </Button>

      <Auth keys={['login', 'admin']}>
        <div className="tc">
          <div className="fs-lg">😀</div>
          <div className="fs-md color-success bold">权限验证通过</div>
          <div className="fs color-second mt-8">这里是需要权限验证的内容</div>
        </div>
      </Auth>
    </div>
  );
};

export default BaseDemo;
