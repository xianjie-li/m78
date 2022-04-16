import React from 'react';
import { createPermission } from 'm78/permission';
import { Button } from 'm78/button';
import { message } from 'm78/message';
import create from '@m78/seed';

const seed = create({
  /* 被所有验证器依赖数据 */
  state: {
    /** 登录用户 */
    user: '',
    /** 是否是管理员 */
    admin: 2,
  },
});

const Permission = createPermission({
  seed,
  /* 声明验证器 */
  validators: {},
});

const ScopeDemo = () => {
  return (
    <div>
      <Button size="small" onClick={() => seed.set({ user: 'lxj' })}>
        登录
      </Button>
      <Button size="small" onClick={() => seed.set({ user: '' })}>
        退出
      </Button>

      <Permission
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
        }}
      >
        <div className="tc">
          <div className="fs-lg">😀</div>
          <div className="fs-md color-success bold">权限验证通过</div>
          <div className="fs color-second mt-8">这里是需要权限验证的内容</div>
        </div>
      </Permission>
    </div>
  );
};

export default ScopeDemo;
