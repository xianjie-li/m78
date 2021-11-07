import React from 'react';
import { Divider } from 'm78/layout';
import { Button } from 'm78/button';
import { ContextMenu, ContextMenuItem } from 'm78/context-menu';
import { SizeEnum } from 'm78/types';

const TipsDemo = () => {
  return (
    <div>
      <ContextMenu
        content={
          <div>
            <ContextMenuItem title="查看" />
            <ContextMenuItem title="刷新" />
            <ContextMenuItem title="排序方式" />
            <ContextMenuItem title="通过VS CODE打开" disabled />
            <ContextMenuItem title="分组依据" trailing="action" />
            <Divider />
            <ContextMenuItem title="✂ 复制" />
            <ContextMenuItem title="📜 粘贴" />
            <ContextMenuItem title="新建TXT" />
            <ContextMenuItem title="新建DOC" desc="该功能暂未开放喔" />
            <ContextMenuItem title="新建EXCEL" />
          </div>
        }
      >
        <Button size={SizeEnum.large}>鼠标右键点我 😛</Button>
      </ContextMenu>
    </div>
  );
};

export default TipsDemo;
