import React from 'react';
import Tips from 'm78/tips';
import { Divider } from 'm78/layout';
import Button from 'm78/button';

const TipsDemo = () => {
  const queue = Tips.useTipsController();

  return (
    <div>
      <div
        style={{
          position: 'relative',
          width: 300,
          border: '1px solid #ccc',
          overflow: 'hidden',
          padding: 12,
        }}
      >
        <Tips controller={queue} />

        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorem eum ex incidunt minus
          officia officiis perspiciatis qui sed. Amet cumque impedit, incidunt mollitia
          necessitatibus odio possimus. Autem eveniet sequi suscipit?
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorem eum ex incidunt minus
          officia officiis perspiciatis qui sed. Amet cumque impedit, incidunt mollitia
          necessitatibus odio possimus. Autem eveniet sequi suscipit? Lorem ipsum dolor sit amet,
          consectetur adipisicing elit. Dolorem eum ex incidunt minus officia officiis perspiciatis
          qui sed. Amet cumque impedit, incidunt mollitia necessitatibus odio possimus. Autem
          eveniet sequi suscipit?
        </p>
      </div>

      <Divider margin={20} />

      <h3>控制</h3>

      <div style={{ lineHeight: 2.6 }}>
        <Button onClick={queue.prev} disabled={!queue.hasPrev()} size="small">
          上一条
        </Button>
        <Button onClick={queue.next} disabled={!queue.hasNext()} size="small">
          下一条
        </Button>
        <Button onClick={queue.clear} size="small">
          清空消息
        </Button>
        <Button onClick={queue.manual} size="small">
          暂停计时
        </Button>
        <Button onClick={queue.auto} disabled={!queue.isManual} size="small">
          开启计时
        </Button>
      </div>

      <Divider margin={20} />

      <h3>发送消息</h3>

      <div style={{ lineHeight: 2.6 }}>
        <Button
          onClick={() => {
            queue.push({
              message: '这是一条消息',
            });
          }}
          size="small"
        >
          普通消息
        </Button>

        <Button
          onClick={() => {
            queue.push({
              message: '这是一条消息',
              type: 'bar',
            });
          }}
          size="small"
        >
          通知栏样式
        </Button>

        <Button
          onClick={() => {
            queue.push({
              message: '这是一条消息',
              nextable: true,
            });
          }}
          size="small"
        >
          关闭按钮/下一页按钮
        </Button>

        <Button
          onClick={() => {
            queue.push({
              message: '这是一条消息',
              prevable: true,
            });
          }}
          size="small"
        >
          上一页按钮
        </Button>

        <Button
          onClick={() => {
            queue.push({
              message: '这是一条消息',
              fitWidth: true,
            });
          }}
          size="small"
        >
          不固定宽度
        </Button>

        <Button
          onClick={() => {
            queue.push({
              message: '确定要购买吗?',
              fitWidth: true,
              actions: [
                {
                  text: '算了',
                  color: 'red',
                  handler() {
                    console.log('算了');
                  },
                },
                {
                  text: '好的',
                  color: 'blue',
                  handler() {
                    console.log('好的');
                  },
                },
              ],
            });
          }}
          size="small"
        >
          自定义操作
        </Button>

        <Button
          onClick={() => {
            queue.push({
              message: '这是一条消息',
              actionsNode: <span className="color-error">操作区内容</span>,
            });
          }}
          size="small"
        >
          自定义操作区内容
        </Button>

        <Button
          onClick={() => {
            Tips.push({
              message: '这是一条全局消息',
            });
          }}
          size="small"
        >
          全局提示
        </Button>

        <Button
          onClick={() => {
            Tips.tip('这是一条全局消息');
          }}
          size="small"
        >
          全局提示(快捷方式)
        </Button>
      </div>
    </div>
  );
};

export default TipsDemo;
