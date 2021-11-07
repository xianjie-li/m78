import React from 'react';
import { DND, DNDContext } from 'm78/dnd';
import { Row } from 'm78/layout';
import cls from 'clsx';

import sty from './sty1.module.scss';

const StatusDemo = () => {
  return (
    <div>
      <DNDContext>
        <Row mainAlign="evenly">
          <DND
            data="DND1"
            enableDrop={{
              bottom: true,
              top: true,
            }}
          >
            {({ innerRef, status }) => (
              <div
                ref={innerRef}
                // 内置的样式类名为.m78-dnd-box
                className={cls('m78-dnd-box', sty.dndBox2, {
                  __disabled: status.dragging,
                })}
              >
                <div>1. 仅上下可放置 + 内置线条提示动画</div>
                {/* 拖动到侧边方向的提示 */}
                {status.dragTop && <span className="m78-dnd-box_top" />}
                {status.dragBottom && <span className="m78-dnd-box_bottom" />}
              </div>
            )}
          </DND>
          <DND data="DND2" enableDrop>
            {({ innerRef, status, enables }) => (
              <div ref={innerRef} className="m78-dnd-box-anime">
                <div
                  className={cls('m78-dnd-box-anime_main', sty.dndBox2, {
                    // 禁用、拖动到中间的状态
                    __active: status.dragCenter,
                    __disabled: !enables.enable || status.dragging,
                    __left: status.dragLeft,
                    __top: status.dragTop,
                    __right: status.dragRight,
                    __bottom: status.dragBottom,
                  })}
                >
                  <div>2. 全方向放置 + 内置偏移动画</div>
                </div>
              </div>
            )}
          </DND>
        </Row>
        <Row mainAlign="evenly" className="mt-24">
          <DND data="DND3" enableDrop>
            {({ innerRef, status, enables }) => (
              <div
                ref={innerRef}
                // 内置的样式类名为.m78-dnd-box
                className={cls('m78-dnd-box', sty.dndBox2, {
                  // 禁用、拖动到中间的状态
                  __active: status.dragOver,
                  __disabled: !enables.enable || status.dragging,
                })}
              >
                <div>3. 任意方向</div>
              </div>
            )}
          </DND>
          <DND
            data="DND4"
            enableDrop={(node, source) => {
              return source?.data !== 'DND2';
            }}
          >
            {({ innerRef, status, enables }) => (
              <div
                ref={innerRef}
                // 内置的样式类名为.m78-dnd-box
                className={cls('m78-dnd-box', sty.dndBox2, {
                  // 禁用、拖动到中间的状态
                  __active: status.dragOver,
                  __disabled: !enables.enable || status.dragging,
                })}
              >
                <div>4. 拖动`2`时禁用</div>
              </div>
            )}
          </DND>
        </Row>
      </DNDContext>
    </div>
  );
};

export default StatusDemo;
