import React from 'react';
import create from 'm78/seed';
import Button from 'm78/button';
import Message from 'm78/message';

const { Auth, setDeps } = create({
  /* 被所有验证器依赖数据 */
  dependency: {
    /** 登录用户 */
    user: '',
    /** 是否是管理员 */
    admin: 2,
  },
  /* 声明验证器 */
  validators: {},
});

const ScopeDemo = () => {
  return (
    <div>
      <Button size="small" onClick={() => setDeps({ user: 'lxj' })}>
        登录
      </Button>
      <Button size="small" onClick={() => setDeps({ user: '' })}>
        退出
      </Button>

      <Auth
        keys={['login']}
        validators={{
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
        }}
      >
        <div className="tc">
          <div className="fs-38">😀</div>
          <div className="fs-24 color-success bold">权限验证通过</div>
          <div className="fs-14 color-second mt-8">这里是需要权限验证的内容</div>
        </div>
      </Auth>
    </div>
  );
};

export default ScopeDemo;
