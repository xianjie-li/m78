import React from 'react';

import { Dialog } from 'm78/dialog';
import { Button } from 'm78/button';
import { delay } from '@lxjx/utils';

const Api = () => {
  return (
    <div>
      <Button
        onClick={() => {
          const dia = Dialog.render({
            title: '通过api唤起的dialog',
            content: <div>这是弹层内容</div>,
            clickAwayClosable: false, // 禁止点击区域外关闭
            close: true,
            async onClose(isConfirm) {
              if (isConfirm) {
                await delay(600);

                // 通过实例更新组件
                dia.setState({
                  content: <div>更新了内容 {new Date().toString()}</div>,
                });

                return false;
              }
            },
          });

          // Dialog上还挂载了很多api相关的方法
          console.log(Dialog.getInstances());
        }}
      >
        通过api唤起dialog
      </Button>
    </div>
  );
};

export default Api;
