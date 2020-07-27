import React from 'react';

import Modal from '@lxjx/fr/modal';
import Button from '@lxjx/fr/button';

function mult(mask = true) {
  for (let i = 0; i < 6; i++) {
    setTimeout(() => {
      const [refs, id] = Modal.api({
        title: `${i}通过api来调用modal`,
        mask,
        onConfirm() {
          refs.close(id);
        },
        onClose() {
          console.log(id);
        },
      });
    });
  }
}

const Demo = () => (
  <div>
    <Button
      onClick={() => {
        const [refs, id] = Modal.api({
          title: '通过api来调用modal',
          status: 'success',
          children: '配置与常规使用时的prop一样',
          loading: true,
          onConfirm() {
            refs.close(id);
          },
        });

        setTimeout(() => {
          refs.update(id, {
            loading: false,
          });
        }, 1000);
      }}
    >
      编程式调用
    </Button>
    <Button onClick={() => mult()}>打开一组窗口</Button>
    <Button onClick={() => mult(false)}>打开一组窗口(无遮罩)</Button>
  </div>
);

export default Demo;
