import React from 'react';
import DND, { DNDContext } from 'm78/dnd';
import { Row } from 'm78/layout';
import cls from 'classnames';

import sty from './sty1.module.scss';

const StatusDemo = () => {
  return (
    <div>
      <DNDContext>
        <Row mainAlign="evenly">
          <DND
            data="DND1"
            enableDrop={{
              left: true,
              right: true,
              bottom: true,
              top: true,
              center: true,
            }}
          >
            {({ innerRef, status, enables }) => (
              <div
                ref={innerRef}
                // 内置的样式类名为.m78-dnd-box
                className={cls('m78-dnd-box', sty.dndBox2, {
                  // 禁用、拖动到中间的状态
                  __active: status.dragCenter,
                  __disabled: !enables.enable,
                })}
              >
                <div>1. 全方向放置</div>

                {/* 拖动到侧边方向的提示 */}
                {status.dragLeft && <span className="m78-dnd-box_left" />}
                {status.dragRight && <span className="m78-dnd-box_right" />}
                {status.dragTop && <span className="m78-dnd-box_top" />}
                {status.dragBottom && <span className="m78-dnd-box_bottom" />}
              </div>
            )}
          </DND>

          <DND
            data="DND2"
            enableDrop={{
              bottom: true,
              top: true,
            }}
          >
            {({ innerRef, status, enables }) => (
              <div
                ref={innerRef}
                // 内置的样式类名为.m78-dnd-box
                className={cls('m78-dnd-box', sty.dndBox2, {
                  // 禁用、拖动到中间的状态
                  __active: status.dragCenter,
                  __disabled: !enables.enable,
                })}
              >
                <div>2. 上下可放置</div>

                {/* 拖动到侧边方向的提示 */}
                {status.dragLeft && <span className="m78-dnd-box_left" />}
                {status.dragRight && <span className="m78-dnd-box_right" />}
                {status.dragTop && <span className="m78-dnd-box_top" />}
                {status.dragBottom && <span className="m78-dnd-box_bottom" />}
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
                  __disabled: !enables.enable,
                })}
              >
                <div>3. 不限制方向</div>
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
                  __disabled: !enables.enable,
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
