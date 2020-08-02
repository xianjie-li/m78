import React from 'react';
import create from '@lxjx/fr/auth';
import Button from '@lxjx/fr/button';

const { Auth, setDeps } = create({
  /* 被所有验证器依赖数据 */
  dependency: {
    num: 0,
  },
  /* 声明验证器 */
  validators: {
    // 异步验证
    asyncValidator() {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({
            label: '这是一个异步验证器',
          });
        }, 2000);
      });
    },
  },
});

const DemoAsync = () => {
  return (
    <div>
      <Button size="small" onClick={() => setDeps({ num: Math.random() })}>
        变更依赖
      </Button>
      <hr />
      <div style={{ border: '1px solid pink' }} className="mt-16 p-8">
        <h3>异步验证器:</h3>
        <Auth keys={['asyncValidator']}>
          <Button>✅ 异步验证</Button>
        </Auth>
      </div>
    </div>
  );
};

export default DemoAsync;
