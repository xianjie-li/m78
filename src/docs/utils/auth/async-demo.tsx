import React from 'react';
import create from 'm78/auth';
import { delay } from '@lxjx/utils';
import Message from 'm78/message';
import Button from 'm78/button';

const { setDeps, Auth, getDeps } = create({
  /* 被所有验证器依赖数据 */
  dependency: {
    number: 0,
  },
  /* 声明验证器 */
  validators: {
    async checkSomething({ number }) {
      await delay(1500);

      if (number < 4) {
        return {
          label: '验证失败！',
          desc: '这是一个异步验证结果',
          actions: [
            {
              label: '好的',
              onClick() {
                Message.tips({
                  content: '好的',
                });
              },
            },
          ],
        };
      }
    },
  },
});

const AsyncDemo = () => {
  return (
    <div>
      <Button size="small" onClick={() => setDeps({ number: getDeps().number + 1 })}>
        add number
      </Button>

      <div>
        <Auth keys={['checkSomething']}>
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

export default AsyncDemo;
