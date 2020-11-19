import React from 'react';
import create from 'm78/auth';
import Message from 'm78/message';
import Button from 'm78/button';
import { Divider } from 'm78/layout';

const { useAuth, setDeps } = create({
  /* 被所有验证器依赖数据 */
  dependency: {
    /** 登录用户 */
    user: '',
    /** 是否是管理员 */
    admin: 2,
  },
  /* 声明验证器 */
  validators: {
    // 登录状态验证器
    login(deps) {
      if (!deps.user) {
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
                Message.tips({
                  content: '去登陆',
                });
              },
            },
            {
              label: '算了',
              onClick() {
                Message.tips({
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
                Message.tips({
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

const UseAuthDemo = () => {
  const authMeta = useAuth(['login', 'admin']);

  return (
    <div>
      <Button size="small" onClick={() => setDeps({ user: 'lxj' })}>
        登录
      </Button>
      <Button size="small" onClick={() => setDeps({ user: '' })}>
        退出
      </Button>

      <Divider vertical />

      <Button size="small" onClick={() => setDeps({ admin: 1 })}>
        设为管理员
      </Button>
      <Button size="small" onClick={() => setDeps({ admin: 2 })}>
        移除管理权限
      </Button>

      <pre className="p-12 mtb-12" style={{ backgroundColor: '#efefef' }}>
        {JSON.stringify(authMeta, null, 2)}
      </pre>
    </div>
  );
};

export default UseAuthDemo;
