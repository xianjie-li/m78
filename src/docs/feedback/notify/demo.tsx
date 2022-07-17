import React from 'react';
import { notify } from 'm78/notify';
import { Button } from 'm78/button';
import mockjs from 'mockjs';
import { NotifyPosition } from 'm78/notify/type';
import { Status } from 'm78/common';

const Random = mockjs.Random;

const NotifyExample = () => {
  return (
    <div>
      <Button
        onClick={() => {
          notify.render({
            title: Random.cword(0, 6),
            content: Random.cparagraph(1, 2),
            status: Random.pick(Object.keys(Status)),
            position: Random.pick(Object.keys(NotifyPosition)),
          });
        }}
      >
        随机 状态/位置/内容 的消息
      </Button>

      <Button
        onClick={() => {
          notify.render({
            content: '一段提示文本',
            status: Status.success,
            duration: Infinity,
            cancel: true,
          });
        }}
      >
        关闭按钮 + 不自动关闭
      </Button>

      <Button
        onClick={() => {
          notify.render({
            content: Random.cparagraph(1, 2),
            status: Status.success,
            mask: true,
          });
        }}
      >
        带遮罩
      </Button>

      <Button
        onClick={() => {
          const ins = notify.loading({
            mask: true,
          });

          setTimeout(ins.hide, 2000);
        }}
      >
        loading
      </Button>

      <Button
        onClick={() => {
          notify.render({
            title: '标题',
            content: '消息提示消息消息提示消息消息提示消息消息提示消息',
            status: 'error',
            cancel: true,
            duration: Infinity,
            actions: props => (
              <div>
                <Button size="small" onClick={() => props.onChange(false)}>
                  取消
                </Button>
                <Button
                  size="small"
                  color="primary"
                  onClick={() => {
                    props.onUpdate({
                      loading: true,
                    });
                    setTimeout(() => {
                      props.onUpdate({
                        loading: false,
                      });
                      props.onChange(false);
                    }, 800);
                  }}
                >
                  确认
                </Button>
              </div>
            ),
          });
        }}
      >
        操作栏 + 更新实例
      </Button>
    </div>
  );
};

export default NotifyExample;
