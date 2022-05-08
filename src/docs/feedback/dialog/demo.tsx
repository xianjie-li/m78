import React, { useState } from 'react';

import { Dialog } from 'm78/dialog';
import { Button } from 'm78/button';
import { notify } from 'm78/notify';

const Demo = () => {
  const [loading, setLoading] = useState(false);

  return (
    <div>
      <Dialog title="这是标题" content={<div>这是弹窗内容</div>}>
        <Button>基本</Button>
      </Dialog>

      <Dialog
        close
        title="这是标题"
        onClose={isConfirm => {
          notify.render({
            status: isConfirm ? 'success' : 'error',
            content: isConfirm ? '你点击了确认' : '你关闭了弹窗',
          });
        }}
        content={<div>确认 + 取消</div>}
      >
        <Button>确认按钮+取消按钮</Button>
      </Dialog>

      <div className="mt-24">
        <Dialog loading={loading} content={<div>这是弹窗内容</div>}>
          <Button
            onClick={() => {
              setLoading(true);

              setTimeout(() => {
                setLoading(false);
              }, 1500);
            }}
          >
            加载状态
          </Button>
        </Dialog>

        <Dialog status="success" content={<div>这是弹窗内容</div>}>
          <Button>弹窗状态(成功)</Button>
        </Dialog>

        <Dialog status="error" content={<div>这是弹窗内容</div>}>
          <Button>弹窗状态(失败)</Button>
        </Dialog>

        <Dialog status="warning" content={<div>这是弹窗内容</div>}>
          <Button>弹窗状态(警告)</Button>
        </Dialog>
      </div>

      <div className="mt-24">
        <Dialog
          header={
            <div>
              自定义 <span style={{ color: 'red', fontSize: 20 }}>顶部</span>
            </div>
          }
          content={<div>这是弹窗内容</div>}
          footer={
            <div>
              自定义 <span style={{ color: 'blue', fontSize: 20 }}>底部</span>
            </div>
          }
        >
          <Button>自定义</Button>
        </Dialog>

        <Dialog
          content={<div>配置项请参考Button props</div>}
          btnList={[
            {
              children: '按钮1',
              color: 'red',
              onClick() {
                console.log('点击按钮1');
              },
            },
            {
              children: '按钮2',
              color: 'green',
              onClick() {
                console.log('点击按钮2');
              },
            },
            {
              children: '按钮3',
              color: 'blue',
              onClick() {
                console.log('点击按钮3');
              },
            },
          ]}
        >
          <Button>按钮配置</Button>
        </Dialog>
      </div>

      {/* <div className="mt-24"> */}
      {/*  <Dialog */}
      {/*    prompt */}
      {/*    close */}
      {/*    triggerNode={<Button>提示输入框</Button>} */}
      {/*    title="用于快速提醒输入的dialog" */}
      {/*    onClose={(isConfirm, val) => { */}
      {/*      if (isConfirm) { */}
      {/*        console.log(val); */}
      {/*      } */}
      {/*    }} */}
      {/*  /> */}

      {/*  <Dialog */}
      {/*    prompt */}
      {/*    promptDefaultValue="123" */}
      {/*    close */}
      {/*    triggerNode={<Button>提示输入框 + 相关配置</Button>} */}
      {/*    title="用于快速提醒输入的dialog" */}
      {/*    onClose={(isConfirm, val) => { */}
      {/*      if (isConfirm) { */}
      {/*        console.log(val); */}
      {/*      } */}
      {/*    }} */}
      {/*    promptInputProps={{ */}
      {/*      type: 'password', */}
      {/*    }} */}
      {/*  > */}
      {/*    <div className="color-second">输入您的密码</div> */}
      {/*  </Dialog> */}
      {/* </div> */}
    </div>
  );
};

export default Demo;
