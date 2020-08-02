import React from 'react';
import create from '@lxjx/fr/auth';
import Button from '@lxjx/fr/button';

/**
 *  1. 通过`create()`根据依赖数据和验证器创建auth api
 *  2. 通过`auth.Auth`组件来根据当前权限显示内容或反馈信息，也可以使用`auth.withAuth()`来创建权限高阶组件
 *  3. 当权限依赖改变时，通过`auth.setDeps`来进行更新
 * */

const { Auth, setDeps } = create({
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

const Demo = () => {
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
        <h3>占位型反馈:</h3>
        <Auth keys={['login', 'admin']}>
          <Button>✅ 登录 + 管理员可用</Button>
        </Auth>
      </div>
      <div style={{ border: '1px solid pink' }} className="mt-16 p-8">
        <h3>提示框反馈:</h3>
        <Auth keys={['login', 'admin']} type="popper">
          <Button>✅ 登录 + 管理员可用</Button>
        </Auth>
      </div>
      <div style={{ border: '1px solid pink' }} className="mt-16 p-8">
        <h3>隐藏无权限内容:</h3>
        <Auth keys={['login']} type="hidden">
          <Button>✅ 登录可用</Button>
        </Auth>
      </div>
    </div>
  );
};

export default Demo;
