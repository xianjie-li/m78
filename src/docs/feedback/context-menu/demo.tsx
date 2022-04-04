import React from 'react';
import { Divider } from 'm78/layout';
import { Button } from 'm78/button';
import { ContextMenu } from 'm78/context-menu';
import { Size } from 'm78/common';
import { ListView, ListViewItem } from 'm78/list-view';

const TipsDemo = () => {
  return (
    <div>
      <ContextMenu
        content={
          <ListView size={Size.small}>
            <ListViewItem title="查看" />
            <ListViewItem title="刷新" />
            <ListViewItem title="排序方式" />
            <ListViewItem title="通过VS CODE打开" disabled />
            <ListViewItem title="分组依据" trailing="action" />
            <Divider />
            <ListViewItem title="复制" leading="✂" />
            <ListViewItem title="粘贴" leading="📜" />
            <ListViewItem title="查看" />
            <ListViewItem title="新建DOC" desc="该功能暂未开放喔" />
            <ListViewItem title="新建EXCEL" />
          </ListView>
        }
      >
        <Button size={Size.large}>鼠标右键点我 😛</Button>
      </ContextMenu>
    </div>
  );
};

export default TipsDemo;
