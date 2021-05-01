import React from 'react';

import { Modal } from 'm78/modal';
import { Button } from 'm78/button';
import sty from './style.module.scss';

const Alignment = () => {
  return (
    <div>
      <Modal triggerNode={<Button type="button">fromMouse</Button>}>
        <div className={sty.box}>我是弹层内容</div>
      </Modal>

      <Modal animationType="fade" triggerNode={<Button type="button">fade</Button>}>
        <div className={sty.box}>我是弹层内容</div>
      </Modal>

      <Modal animationType="zoom" triggerNode={<Button type="button">zoom</Button>}>
        <div className={sty.box}>我是弹层内容</div>
      </Modal>

      <Modal animationType="punch" triggerNode={<Button type="button">punch</Button>}>
        <div className={sty.box}>我是弹层内容</div>
      </Modal>

      <Modal animationType="slideLeft" triggerNode={<Button type="button">slideLeft</Button>}>
        <div className={sty.box}>我是弹层内容</div>
      </Modal>

      <Modal animationType="slideRight" triggerNode={<Button type="button">slideRight</Button>}>
        <div className={sty.box}>我是弹层内容</div>
      </Modal>

      <Modal animationType="slideTop" triggerNode={<Button type="button">slideTop</Button>}>
        <div className={sty.box}>我是弹层内容</div>
      </Modal>

      <Modal animationType="slideBottom" triggerNode={<Button type="button">slideBottom</Button>}>
        <div className={sty.box}>我是弹层内容</div>
      </Modal>

      <Modal animationType="bounce" triggerNode={<Button type="button">bounce</Button>}>
        <div className={sty.box}>我是弹层内容</div>
      </Modal>
    </div>
  );
};

export default Alignment;
