import React from 'react';
import create from '@lxjx/fr/auth';
import Button from '@lxjx/fr/button';

const { withAuth, setDeps } = create({
  /* 被所有验证器依赖数据 */
  dependency: {
    name: '',
    admin: 2,
  },
  /* 声明验证器 */
  validators: {
    // 登录状态
    login(deps) {
      // 验证未通过时，返回提示信息，还可以同时返回对应的操作
      if (!deps.name) {
        return {
          label: '未登录',
          desc: '请登录后再进行操作',
          actions: [
            // 每一项都是一个Button props
            {
              label: '去登陆',
              color: 'red',
              onClick() {
                window.alert('去登录');
              },
            },
            {
              label: '算了',
              onClick() {
                window.alert('算了');
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
                window.alert('联系管理员');
              },
            },
          ],
        };
      }
    },
  },
});

function Component() {
  return (
    <div>
      <Button>这是一个按钮</Button>
    </div>
  );
}

const LoginC = withAuth({ keys: ['login'] })(Component);

const LoginA = withAuth({ keys: ['admin'] })(Component);

const DemoWithAuth = () => {
  return (
    <div>
      <Button size="small" onClick={() => setDeps({ name: 'lxj' })}>
        登录
      </Button>
      <Button size="small" onClick={() => setDeps({ name: '' })}>
        退出
      </Button>
      <Button size="small" onClick={() => setDeps({ admin: 1 })}>
        设为管理员
      </Button>
      <Button size="small" onClick={() => setDeps({ admin: 2 })}>
        移除管理权限
      </Button>
      <hr />
      <div style={{ border: '1px solid pink' }} className="mt-16 p-8">
        <LoginC />
      </div>
      <div style={{ border: '1px solid pink' }} className="mt-16 p-8">
        <LoginA />
      </div>
    </div>
  );
};

export default DemoWithAuth;
