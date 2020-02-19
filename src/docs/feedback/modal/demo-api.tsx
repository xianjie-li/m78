import React from 'react';

import Modal from '@lxjx/flicker/lib/modal';
import Button from '@lxjx/flicker/lib/button';

const Demo = () => {

  return (
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
      >编程式调用
      </Button>
    </div>
  );
};

export default Demo;
