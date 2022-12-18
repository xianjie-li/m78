import React from "react";
import mockjs from "mockjs";
import { Status } from "m78/common";
import { notify, NotifyPosition } from "m78/notify";
import { Button } from "m78/button";

const Random = mockjs.Random;

const Notify = () => {
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
        随机 状态/位置/内容
      </Button>

      <Button
        onClick={() => {
          notify.render({
            content: "需要手动关闭喔~",
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
          const ins = notify.loading("加载中");

          // 一秒后关闭
          setTimeout(ins.close, 1000);
        }}
      >
        loading
      </Button>

      <Button
        onClick={() => {
          notify.render({
            title: "标题",
            content: "消息提示消息消息提示消息消息提示消息消息提示消息",
            status: "error",
            cancel: true,
            duration: Infinity,
            actions: (props) => (
              <div>
                <Button size="small" onClick={() => props.onChange(false)}>
                  取消
                </Button>
                <Button
                  size="small"
                  color="primary"
                  onClick={() => {
                    // 设置为加载状态, 并在800ms后关闭
                    props.onUpdate({
                      loading: true,
                    });
                    setTimeout(() => {
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

export default Notify;
