import React from 'react';
import { message } from 'm78/message';
import 'm78/message/style';

import { Button } from 'm78/button';
import 'm78/button/style';

const type = ['success', 'error', 'warning', undefined];

function messageTest() {
  message({
    content: '提示',
    duration: Math.floor(Math.random() * 5000) + 500,
    // @ts-ignore
    type: type[Math.floor(Math.random() * 4)],
  });
}

function loadingTest() {
  const [ref, id] = message({
    loading: true,
  });

  setTimeout(() => {
    ref.close(id);
  }, 2000);
}

function notifyTest() {
  const [res, id] = message({
    title: '标题标题',
    desc:
      '描述描述描述描述描述描述描述，描述描述描述描述描述描述描述描述描述描述描述，描述描述描述描述描述',
    // @ts-ignore
    type: type[Math.floor(Math.random() * 4)],
    duration: Infinity,
    hasCancel: true,
    content: (
      <div className="m78-message_notification">
        <div className="m78-message_notification_title">我是标题</div>
        <div className="m78-message_notification_desc">
          我是描述我是描述我是描我是描述我是描述我是描述我是描述我是描述我是描述我是描述
        </div>
        <div className="m78-message_notification_foot">
          <Button>取消</Button>
          <Button color="blue" onClick={() => res.close(id)}>
            确认
          </Button>
        </div>
      </div>
    ),
    loading: false,
  });
}

const Demo = () => (
  <div>
    <Button onClick={messageTest}>message</Button>
    <Button onClick={loadingTest}>loading</Button>
    <Button onClick={notifyTest}>notify</Button>
  </div>
);

export default Demo;
