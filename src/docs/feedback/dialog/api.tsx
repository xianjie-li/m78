import React from 'react';

import Dialog from 'm78/dialog';
import Button from 'm78/button';

const Api = () => {
  return (
    <div>
      <Button
        onClick={() => {
          const [ref, id] = Dialog.api({
            content: <div>这是弹窗内容</div>,
            status: 'success',
            close: '不用了',
            confirm: '好的',
            loading: true,
            onClose(isConfirm?: boolean) {
              console.log(isConfirm);
            },
          });

          setTimeout(() => {
            ref.close(id);
          }, 1500);
        }}
      >
        打开
      </Button>
    </div>
  );
};

export default Api;
