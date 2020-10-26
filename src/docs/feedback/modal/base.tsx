import React from 'react';

import Modal from 'm78/modal';
import sty from './style.module.scss';

const Base = () => {
  const [show, setShow] = React.useState(false);

  return (
    <div>
      <div>
        <button onClick={() => setShow(true)} type="button">
          通过show/onChange使用
        </button>

        <Modal show={show} onChange={nShow => setShow(nShow)}>
          <div className={sty.box}>我是通过show/onChange使用的弹窗</div>
        </Modal>
      </div>

      <div className="mt-32">
        <Modal triggerNode={<button type="button">通过triggerNode使用</button>}>
          <div className={sty.box}>我是通过triggerNode使用的弹窗</div>
        </Modal>
      </div>

      <div className="mt-32">
        <button
          type="button"
          onClick={() => {
            Modal.api({
              content: <div className={sty.box}>我是通过Modal.api()使用的弹窗</div>,
            });
          }}
        >
          Modal.api()
        </button>
      </div>
    </div>
  );
};

export default Base;
