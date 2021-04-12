import React from 'react';
import create from 'm78/seed';
import Message from 'm78/message';
import Button from 'm78/button';
import { Divider } from 'm78/layout';

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
                Message.tips({
                  content: '联系上传者',
                });
              },
            },
          ],
        };
      }
    },
  },
});

const ExtraDemo = () => {
  return (
    <div>
      <Button size="small" onClick={() => setDeps({ name: 'lxj' })}>
        登录用户`lxj`
      </Button>
      <Button size="small" onClick={() => setDeps({ name: 'jxl' })}>
        登录用户`jxl`
      </Button>

      <Divider />

      <div>
        <Auth keys={['onlySpecify']} extra="jxl">
          <div className="tc">
            <div className="fs-38">😀</div>
            <div className="fs-24 color-success bold">权限验证通过</div>
            <div className="fs-14 color-second mt-8">这里是需要权限验证的内容</div>
          </div>
        </Auth>
      </div>
    </div>
  );
};

export default ExtraDemo;
