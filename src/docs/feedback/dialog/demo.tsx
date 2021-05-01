import React, { useState } from 'react';

import { Dialog } from 'm78/dialog';
import { Button } from 'm78/button';
import { message } from 'm78/message';

const Demo = () => {
  const [loading, setLoading] = useState(false);

  return (
    <div>
      <Dialog triggerNode={<Button>基本</Button>} title="这是标题">
        <div>这是弹窗内容</div>
      </Dialog>

      <Dialog
        close
        triggerNode={<Button>确认按钮+取消按钮</Button>}
        title="这是标题"
        onClose={isConfirm => {
          message.tips({
            type: isConfirm ? 'success' : 'error',
            content: isConfirm ? '你点击了确认' : '你关闭了弹窗',
          });
        }}
      >
        <div>确认 + 取消</div>
      </Dialog>

      <div className="mt-24">
        <Dialog
          loading={loading}
          triggerNode={
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
          }
        >
          <div>这是弹窗内容</div>
        </Dialog>

        <Dialog status="success" triggerNode={<Button>弹窗状态(成功)</Button>}>
          <div>这是弹窗内容</div>
        </Dialog>

        <Dialog status="error" triggerNode={<Button>弹窗状态(失败)</Button>}>
          <div>这是弹窗内容</div>
        </Dialog>

        <Dialog status="warning" triggerNode={<Button>弹窗状态(警告)</Button>}>
          <div>这是弹窗内容</div>
        </Dialog>
      </div>

      <div className="mt-24">
        <Dialog
          triggerNode={<Button>自定义</Button>}
          header={
            <div>
              自定义 <span style={{ color: 'red', fontSize: 20 }}>顶部</span>
            </div>
          }
          footer={
            <div>
              自定义 <span style={{ color: 'blue', fontSize: 20 }}>底部</span>
            </div>
          }
        >
          <div>这是弹窗内容</div>
        </Dialog>

        <Dialog
          triggerNode={<Button>按钮配置</Button>}
          btns={[
            {
              text: '按钮1',
              color: 'red',
              onClick() {
                console.log('点击按钮1');
              },
            },
            {
              text: '按钮2',
              color: 'green',
              onClick() {
                console.log('点击按钮2');
              },
            },
            {
              text: '按钮3',
              color: 'blue',
              onClick() {
                console.log('点击按钮3');
              },
            },
          ]}
        >
          <div>配置项请参考Button props</div>
        </Dialog>
      </div>

      <div className="mt-24">
        <Dialog
          prompt
          close
          triggerNode={<Button>提示输入框</Button>}
          title="用于快速提醒输入的dialog"
          onClose={(isConfirm, val) => {
            if (isConfirm) {
              console.log(val);
            }
          }}
        />

        <Dialog
          prompt
          promptDefaultValue="123"
          close
          triggerNode={<Button>提示输入框 + 相关配置</Button>}
          title="用于快速提醒输入的dialog"
          onClose={(isConfirm, val) => {
            if (isConfirm) {
              console.log(val);
            }
          }}
          promptInputProps={{
            type: 'password',
          }}
        >
          <div className="color-second">输入您的密码</div>
        </Dialog>
      </div>
    </div>
  );
};

export default Demo;
