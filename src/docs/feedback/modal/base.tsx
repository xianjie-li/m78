import React from 'react';

import Modal from 'm78/modal';
import Button from 'm78/button';
import sty from './style.module.scss';

const Base = () => {
  const [show, setShow] = React.useState(false);

  return (
    <div>
      <div>
        <Button onClick={() => setShow(true)} type="button">
          通过show/onChange使用
        </Button>

        <Modal show={show} onChange={nShow => setShow(nShow)}>
          <div className={sty.box}>我是通过show/onChange使用的弹窗</div>
        </Modal>
      </div>

      <div className="mt-32">
        <Modal triggerNode={<Button type="button">通过triggerNode使用</Button>}>
          <div className={sty.box}>我是通过triggerNode使用的弹窗</div>
        </Modal>
      </div>

      <div className="mt-32">
        <Button
          type="button"
          onClick={() => {
            Modal.api({
              content: <div className={sty.box}>我是通过Modal.api()使用的弹窗</div>,
            });
          }}
        >
          Modal.api()
        </Button>
      </div>
    </div>
  );
};

export default Base;
