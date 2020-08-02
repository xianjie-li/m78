import React from 'react';
import create from '@lxjx/fr/auth';
import Button from '@lxjx/fr/button';

const { Auth, setDeps } = create({
  /* 被所有验证器依赖数据 */
  dependency: {
    name: 'lxj',
  },
  /* 声明验证器 */
  validators: {
    // 指定用户可用
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
  },
});

const DemoCustom = () => {
  return (
    <div>
      <Button size="small" onClick={() => setDeps({ name: 'lxj' })}>
        登录
      </Button>
      <Button size="small" onClick={() => setDeps({ name: '' })}>
        退出
      </Button>
      <hr />
      <div className="mt-16 p-8">
        <h3>自定义icon:</h3>
        <Auth keys={['login']} icon={<span>:(</span>}>
          <Button>✅ 登录可用</Button>
        </Auth>
      </div>
      <div className="mt-16 p-8">
        <h3>自定义反馈内容:</h3>
        <Auth
          keys={['login']}
          icon={<span>:(</span>}
          feedback={rejectMeta => (
            <div>
              <h3 className="color-error">{rejectMeta.label}</h3>
              <h3 className="color-second">{rejectMeta.desc}</h3>
              {rejectMeta.actions &&
                rejectMeta.actions.map(action => (
                  <button key={action.label} type="button" onClick={action.onClick}>
                    {action.label}
                  </button>
                ))}
            </div>
          )}
        >
          <Button>✅ 登录可用</Button>
        </Auth>
      </div>
    </div>
  );
};

export default DemoCustom;
