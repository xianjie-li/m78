import React, { useState } from "react";
import { Status } from "m78/common";
import { Dialog } from "m78/dialog";
import { notify } from "m78/notify";
import { Button } from "m78/button";
import { delay } from "@m78/utils";

const DialogExample = () => {
  const [loading, setLoading] = useState(false);

  return (
    <div>
      <p>基本</p>
      <Dialog
        title="这是标题"
        // status={Status.error}
        content={<div>这是弹窗内容</div>}
        onClose={async () => {
          await delay(1000);
        }}
      >
        <Button>基本</Button>
      </Dialog>

      <Dialog
        cancel
        title="这是标题"
        onClose={(isConfirm) => {
          notify.render({
            status: isConfirm ? "success" : "error",
            content: isConfirm ? "你点击了确认" : "你关闭了弹窗",
          });
        }}
        content={<div>确认 + 取消</div>}
      >
        <Button>确认+取消</Button>
      </Dialog>

      <div className="mt-24">
        <p>状态</p>
        <Dialog loading={loading} content={<div>这是弹窗内容</div>}>
          <Button
            onClick={() => {
              setLoading(true);

              setTimeout(() => {
                setLoading(false);
              }, 800);
            }}
          >
            加载状态
          </Button>
        </Dialog>

        <Dialog status={Status.info} content={<div>这是弹窗内容</div>}>
          <Button>弹窗状态(信息)</Button>
        </Dialog>

        <Dialog status={Status.success} content={<div>这是弹窗内容</div>}>
          <Button>弹窗状态(成功)</Button>
        </Dialog>

        <Dialog status={Status.error} content={<div>这是弹窗内容</div>}>
          <Button>弹窗状态(失败)</Button>
        </Dialog>

        <Dialog status={Status.warning} content={<div>这是弹窗内容</div>}>
          <Button>弹窗状态(警告)</Button>
        </Dialog>
      </div>

      <div className="mt-24">
        <p>定制</p>
        <Dialog
          header={
            <div>
              自定义 <span style={{ color: "red", fontSize: 20 }}>顶部</span>
            </div>
          }
          content={<div>这是弹窗内容</div>}
          footer={(close) => (
            <div>
              自定义底部
              <button onClick={() => close()}>cancel</button>
              <button onClick={() => close(true)}>confirm</button>
            </div>
          )}
          onClose={async (isConfirm) => {
            await delay(1000);
            console.log(isConfirm);
          }}
        >
          <Button>自定义</Button>
        </Dialog>

        <Dialog title="这是标题" content="这是弹窗内容, 可在顶部拖动" draggable>
          <Button>可拖动</Button>
        </Dialog>

        <Button
          onClick={() => {
            const dia = Dialog.render({
              title: "通过api唤起的dialog",
              content: (
                <div>
                  api用法时, 关闭后会自动卸载挂载的内容, 可通过
                  props.unmountOnExit 控制
                </div>
              ),
              cancel: true,
              async onClose(isConfirm) {
                if (isConfirm) {
                  await delay(600);

                  // 通过实例更新组件
                  dia.setState({
                    content: <div>更新了内容 {new Date().toString()}</div>,
                  });

                  return false;
                }
              },
            });

            // Dialog上还挂载了很多api相关的方法
            console.log(Dialog.getInstances(), dia);
          }}
        >
          通过全局api开启dialog
        </Button>

        <Button
          onClick={() => {
            return Dialog.success("这是一个成功的弹窗")
              .then(() => {
                console.log("确认");
              })
              .catch(() => {
                console.log("取消");
              });
          }}
        >
          用于快速提示的api
        </Button>
      </div>

      <div className="mt-24">
        <p>可使用所有overlay支持的功能</p>

        <Dialog
          title="这是标题"
          content={<div>这是弹窗内容</div>}
          childrenAsTarget
          cancel
        >
          <Button>显示在触发节点处</Button>
        </Dialog>

        <Dialog
          title="这是标题"
          content={<div>这是弹窗内容</div>}
          transitionType="punch"
        >
          <Button>动画</Button>
        </Dialog>
      </div>
    </div>
  );
};

export default DialogExample;
