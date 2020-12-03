import React, { useState } from 'react';
import DND, { DNDContext, DragBonus, DragFullEvent, DragPartialEvent } from 'm78/dnd';
import cls from 'classnames';
import { Row } from 'm78/layout';
import sty from './sty1.module.scss';

const BaseDemo = () => {
  const [text, setText] = useState('尝试拖动盒子到相邻盒子的不同位置🤏');

  function renderDND({ innerRef, status }: DragBonus) {
    return (
      <div
        ref={innerRef}
        className={cls(sty.dndBox, {
          __active: status.dragOver,
          __left: status.dragLeft,
          __top: status.dragTop,
          __right: status.dragRight,
          __bottom: status.dragBottom,
        })}
        style={{ margin: 12 }}
      >
        {status.dragging && <span>😫</span>}
        {status.dragCenter && <span>😍</span>}
        {status.dragLeft && <span>👈</span>}
        {status.dragRight && <span>👉</span>}
        {status.dragTop && <span>👆</span>}
        {status.dragBottom && <span>👇</span>}
        {status.regular && <span>🥰</span>}
      </div>
    );
  }

  function acceptHandle(e: DragFullEvent<string>) {
    console.log(e.source);
    console.log(e.target);

    let position = '';

    if (e.status.dragLeft) position = '左';
    if (e.status.dragRight) position = '右';
    if (e.status.dragTop) position = '上';
    if (e.status.dragBottom) position = '下';
    if (e.status.dragCenter) position = '中间';

    setText(`从${e.source.data}拖动到${e.target.data}, 位置是: ${position}`);
  }

  function dragStartHandle(e: DragPartialEvent<string>) {
    setText(`开始拖动: ${e.source.data}`);
  }

  function dropHandle(e: DragPartialEvent<string>) {
    if (!e.target) {
      setText(`取消了拖动`);
    }
  }

  function dragEnterHandle(e: DragFullEvent<string>) {
    setText(`进入${e.target.data}`);
  }

  function dragLeaveHandle() {
    setText('离开');
  }

  return (
    <div>
      <div className="fs-24 mb-16">{text}</div>

      <DNDContext
        onAccept={e => {
          console.log('onAccept', e);
        }}
        onStart={e => {
          console.log('onStart', e);
        }}
      >
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
            onDrag={dragStartHandle}
            onDrop={dropHandle}
            onSourceEnter={dragEnterHandle}
            onSourceLeave={dragLeaveHandle}
            onSourceAccept={acceptHandle}
          >
            {renderDND}
          </DND>

          <DND
            data="DND2"
            enableDrop={{
              left: true,
              right: true,
              bottom: true,
              top: true,
              center: true,
            }}
            onDrag={dragStartHandle}
            onDrop={dropHandle}
            onSourceEnter={dragEnterHandle}
            onSourceLeave={dragLeaveHandle}
            onSourceAccept={acceptHandle}
          >
            {renderDND}
          </DND>
        </Row>
      </DNDContext>
    </div>
  );
};

export default BaseDemo;
