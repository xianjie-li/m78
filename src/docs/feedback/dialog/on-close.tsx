import React from 'react';
import { Dialog } from 'm78/dialog';
import { Button } from 'm78/button';
import { delay } from '@lxjx/utils';

const OnClose = () => {
  function handleClose1(isConfirm: boolean) {
    if (isConfirm) {
      return false;
    }
  }

  async function handleClose2(isConfirm: boolean) {
    if (isConfirm) {
      await delay(1000);

      return false;
    }
  }

  return (
    <div>
      <Dialog content={<div>onClose返回false, 阻止关闭</div>} onClose={handleClose1}>
        <Button>return false</Button>
      </Dialog>

      <Dialog
        content={
          <div>
            onClose返回Promise, 自动触发加载状态, 如果promise的值为false或抛出异常则阻止关闭
          </div>
        }
        onClose={handleClose2}
      >
        <Button>return Promise</Button>
      </Dialog>
    </div>
  );
};

export default OnClose;
