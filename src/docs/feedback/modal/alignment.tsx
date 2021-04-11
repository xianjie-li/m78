import React from 'react';

import Modal from 'm78/modal';
import Button from 'm78/button';
import sty from './style.module.scss';

const Alignment = () => {
  return (
    <div>
      <Modal alignment={[0, 0]} triggerNode={<Button type="button">[0, 0] 左上</Button>}>
        <div className={sty.box}>我是弹层内容</div>
      </Modal>
      <Modal
        alignment={[0.5, 0.5]}
        triggerNode={<Button type="button">[0.5, 0.5] 居中(默认)</Button>}
      >
        <div className={sty.box}>我是弹层内容</div>
      </Modal>
      <Modal alignment={[1, 1]} triggerNode={<Button type="button">[1, 1] 右下</Button>}>
        <div className={sty.box}>我是弹层内容</div>
      </Modal>
      <Modal alignment={[1, 0]} triggerNode={<Button type="button">[1, 0] 右上</Button>}>
        <div className={sty.box}>我是弹层内容</div>
      </Modal>
    </div>
  );
};

export default Alignment;
