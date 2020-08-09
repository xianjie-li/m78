import React from 'react';
import create from 'm78/auth';
import Button from 'm78/button';

const { Auth, setDeps } = create({
  /* 被所有验证器依赖数据 */
  dependency: {
    name: 'lxj',
  },
  /* 声明验证器 */
  validators: {
    // 指定用户可用
    onlySpecify(deps, extra) {
      if (deps.name !== extra) {
        return {
          label: '该资源只能上传者本人访问',
          desc: '请联系资源上传者',
          actions: [
            {
              label: `联系${extra}`,
              color: 'blue',
              onClick() {
                window.alert('联系上传者');
              },
            },
          ],
        };
      }
    },
  },
});

const DemoExtra = () => {
  return (
    <div>
      <Button size="small" onClick={() => setDeps({ name: 'lxj' })}>
        登录用户`lxj`
      </Button>
      <Button size="small" onClick={() => setDeps({ name: 'jxl' })}>
        登录用户`jxl`
      </Button>
      <hr />
      <Auth keys={['onlySpecify']} extra="jxl">
        <Button>✅ 登录 + 指定用户</Button>
      </Auth>
    </div>
  );
};

export default DemoExtra;
