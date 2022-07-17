import React from 'react';
import { createPermission, PermissionType } from 'm78/permission';
import { notify } from 'm78/notify';
import { Button } from 'm78/button';
import { Divider } from 'm78/layout';
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
                notify.render({
                  content: '去登陆',
                });
              },
            },
            {
              label: '算了',
              onClick() {
                notify.render({
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
                notify.render({
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

const FeedbackTypeDemo = () => {
  return (
    <div>
      <Button size="small" onClick={() => seed.set({ user: 'lxj' })}>
        登录
      </Button>
      <Button size="small" onClick={() => seed.set({ user: '' })}>
        退出
      </Button>

      <Divider vertical />

      <Button size="small" onClick={() => seed.set({ admin: 1 })}>
        设为管理员
      </Button>
      <Button size="small" onClick={() => seed.set({ admin: 2 })}>
        移除管理权限
      </Button>

      <div className="p-12">
        <h3>占位形反馈</h3>
        <div className="fs color-second">通过占位节点替换无权限内容</div>
        <Permission keys={['login', 'admin']}>
          <div className="tc">
            <div className="fs-lg">😀</div>
            <div className="fs-md color-success bold">权限验证通过</div>
            <div className="fs color-second mt-8">这里是需要权限验证的内容</div>
          </div>
        </Permission>
      </div>

      <Divider margin={16} />

      <div className="p-12">
        <h3>气泡提示型反馈</h3>
        <div className="fs color-second">通过气泡提示框进行权限提示</div>
        <Permission keys={['login', 'admin']} type={PermissionType.popper}>
          <Button className="mtb-24">执行一个需要权限的操作</Button>
        </Permission>
      </div>

      <Divider margin={16} />

      <div className="p-12">
        <h3>隐藏无权限节点</h3>
        <div className="fs color-second">阻止渲染无权限内容</div>
        <Permission keys={['login', 'admin']} type={PermissionType.hidden}>
          <div className="tc">
            <div className="fs-lg">😀</div>
            <div className="fs-md color-success bold">权限验证通过</div>
            <div className="fs color-second mt-8">这里是需要权限验证的内容</div>
          </div>
        </Permission>
      </div>
    </div>
  );
};

export default FeedbackTypeDemo;