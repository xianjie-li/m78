import React from 'react';

import Modal from '@lxjx/fr/modal';
import Button from '@lxjx/fr/button';

import img1 from '@/mock/img/1.jpg';

import './style.css';

const Demo = () => {
  const [show, setShow] = React.useState(false);

  return (
    <div>
      <div>
        <Button onClick={() => setShow(p => !p)}>show </Button>
      </div>

      <Modal
        show={show}
        onClose={() => setShow(false)}
        content={
          <div className="modal">
            <div className="modal-img">
              <img src={img1} alt="" />
            </div>
            <div className="modal-title">乔碧萝首次露脸</div>
            <div className="modal-cont">
              她站在乌鲁木齐一家商场门口，挥手，微笑。约见地点是她选定的，她拒绝任何试图进入她生活场景的要求。
            </div>
            <div className="modal-btn">
              <Button link color="blue" onClick={() => setShow(false)}>
                我知道了
              </Button>
            </div>
          </div>
        }
      />
    </div>
  );
};

export default Demo;
