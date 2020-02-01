import React from 'react';
import message from '@lxjx/flicker/lib/message';
import '@lxjx/flicker/lib/message/style';

import Button from '@lxjx/flicker/lib/button';
import '@lxjx/flicker/lib/button/style';

const type = [
  'success',
  'error',
  'warning',
  undefined,
];

function messageTest() {
  message.tips({
    content: '提示',
    duration: Math.floor(Math.random() * 5000) + 500,
    // @ts-ignore
    type: type[Math.floor(Math.random() * 4)],
  });
}

function loadingTest() {
  const [ref, id] = message.loading();

  setTimeout(() => {
    ref.close(id);
  }, 2000);
}

function notifyTest() {
  message.notify({
    title: '标题标题',
    desc: '描述描述描述描述描述描述描述，描述描述描述描述描述描述描述描述描述描述描述，描述描述描述描述描述',
    // @ts-ignore
    type: type[Math.floor(Math.random() * 4)],
  });
}

const Demo = () => {
  return (
    <div>
      <Button onClick={messageTest}>message</Button>
      <Button onClick={loadingTest}>loading</Button>
      <Button onClick={notifyTest}>notify</Button>
    </div>
  );
};

export default Demo;
