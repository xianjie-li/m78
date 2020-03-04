import React from 'react';

import Modal from '@lxjx/flicker/lib/modal';
import Button from '@lxjx/flicker/lib/button';

import './style.css';

const Demo = () => {
  const [show, setShow] = React.useState(false);
  const [show2, setShow2] = React.useState(false);
  const [show3, setShow3] = React.useState(false);
  const [show4, setShow4] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  return (
    <div>
      <div>
        <Button onClick={() => setShow(p => !p)}>show </Button>
        <Button onClick={() => setShow2(p => !p)}>flex按钮</Button>
        <Button onClick={() => setShow3(p => !p)}>无遮罩层</Button>
        <Button onClick={() => setShow4(p => !p)}>自定义按钮</Button>
      </div>

      <Modal
        title="基本示例"
        show={show}
        status="success"
        loading={loading}
        onClose={() => {
          setShow(false);
        }}
        onConfirm={() => {
          setLoading(true);
          setTimeout(() => {
            setLoading(false);
            setShow(false);
          }, 1000);
        }}
      >
        我是内容我是内容我是内容我是内容我是内容我是内容
      </Modal>

      <Modal
        title="flex按钮"
        show={show2}
        flexBtn
        close
        onClose={() => {
          setShow2(false);
        }}
        onConfirm={() => {
          setShow2(false);
        }}
      >
        我是内容
      </Modal>

      <Modal
        title="无遮罩层"
        status="error"
        show={show3}
        mask={false}
        onClose={() => {
          setShow3(false);
        }}
        onConfirm={() => {
          setShow3(false);
        }}
      >
        我是内容
      </Modal>

      <Modal
        title="自定义按钮"
        status="warning"
        show={show4}
        btns={[
          {
            text: '删除',
            color: 'red',
            onClick() {
              setShow4(false);
            },
          }, {
            text: '确认',
            color: 'blue',
            onClick() {
              setShow4(false);
            },
          },
        ]}
      >
        我是内容
      </Modal>
    </div>
  );
};

export default Demo;
