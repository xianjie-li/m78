import React, { useState } from 'react';
import { useFn } from '@lxjx/hooks';
import { DND, DNDContext, DNDProps, DragFullEvent } from 'm78/dnd';
import { swap } from '@lxjx/utils';
import cls from 'clsx';

import sty from './grid.module.scss';

const ColumLen = 5;

const GridDemo = () => {
  const [list, setList] = useState(() => {
    return Array.from({ length: 20 }).map((_, ind) => ind);
  });

  const acceptHandle = useFn((e: DragFullEvent<number>) => {
    const tNode = e.target; // 放置目标
    const sNode = e.source; // 拖动目标

    console.log(sNode, tNode);

    if (!tNode || !sNode) return;

    const sInd = list.indexOf(sNode.data);
    const tInd = list.indexOf(tNode.data);

    // 拖动到中间
    if (e.status.dragCenter) {
      if (sInd === -1 || tInd === -1) return;

      // 交换两个项的位置
      swap(list, sInd, tInd);
    }

    if (e.status.dragLeft) {
      const removed = list.splice(sInd, 1);
      list.splice(tInd, 0, ...removed);
    }

    if (e.status.dragRight) {
      const removed = list.splice(sInd, 1);
      list.splice(tInd + 1, 0, ...removed);
    }

    if (e.status.dragTop) {
      const removed = list.splice(sInd, 1);
      list.splice(tInd - ColumLen, 0, ...removed);
    }

    if (e.status.dragBottom) {
      const removed = list.splice(sInd, 1);
      list.splice(tInd + ColumLen, 0, ...removed);
    }

    refreshState();
  });

  /** 禁用边缘放置 */
  const disableEdge: DNDProps['enableDrop'] = useFn(node => {
    const ind = list.indexOf(node.data);

    const disabledTop = ind < ColumLen;
    const disabledLeft = ind % ColumLen === 0;
    const disabledRight = (ind + 1) % ColumLen === 0;
    const disabledBottom = ind > list.length - ColumLen + 1;

    return {
      left: !disabledLeft,
      right: !disabledRight,
      bottom: !disabledBottom,
      top: !disabledTop,
      center: true,
    };
  });

  function refreshState() {
    setList(prev => [...prev]);
  }

  return (
    <div>
      <DNDContext onAccept={acceptHandle}>
        <div className={sty.grid}>
          {list.map(item => (
            <DND key={item} data={item} enableDrop={disableEdge}>
              {({ innerRef, status, enables }) => (
                <div
                  className={cls(sty.gridItem, 'm78-dnd-box', {
                    // 禁用、拖动到中间的状态
                    __active: status.dragCenter,
                    __disabled: !enables.enable,
                  })}
                  ref={innerRef}
                >
                  {item}

                  {/* 拖动到侧边方向的提示 */}
                  {status.dragLeft && <span className="m78-dnd-box_left" />}
                  {status.dragRight && <span className="m78-dnd-box_right" />}
                  {status.dragTop && <span className="m78-dnd-box_top" />}
                  {status.dragBottom && <span className="m78-dnd-box_bottom" />}
                </div>
              )}
            </DND>
          ))}
        </div>
      </DNDContext>
    </div>
  );
};

export default GridDemo;
