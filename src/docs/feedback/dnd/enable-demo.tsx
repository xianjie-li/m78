import React from 'react';
import { DND, DNDContext } from 'm78/dnd';
import { Row } from 'm78/layout';
import cls from 'clsx';
import sty from './sty1.module.scss';

const EnableDemo = () => {
  return (
    <div>
      <DNDContext
        onAccept={e => {
          console.log('onAccept', e);
        }}
        onStart={e => {
          console.log('onStart', e);
        }}
      >
        <Row mainAlign="evenly">
          <div>
            <DND data="DND1" enableDrop={false}>
              {({ innerRef, status }) => {
                return (
                  <div
                    ref={innerRef}
                    className={cls(sty.dndBox, {
                      __active: status.dragOver,
                    })}
                    style={{ margin: 12 }}
                  >
                    {status.dragging && <span>😫</span>}
                    {status.regular && <span>🥰</span>}
                  </div>
                );
              }}
            </DND>

            <div className="tc">仅可拖动</div>
          </div>

          <div>
            <DND data="DND2" enableDrag={false} enableDrop={false}>
              {({ innerRef, enables }) => {
                return (
                  <div
                    ref={innerRef}
                    className={sty.dndBox}
                    style={{ margin: 12, opacity: enables.enable ? undefined : 0.7 }}
                  >
                    <span>⛔</span>
                  </div>
                );
              }}
            </DND>

            <div className="tc">禁止拖动放置</div>
          </div>
        </Row>

        <Row mainAlign="evenly">
          <div>
            <DND
              data="DND3"
              enableDrop={{
                top: true,
                bottom: true,
              }}
            >
              {({ innerRef, status }) => {
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
                    {status.dragTop && <span>👆</span>}
                    {status.dragBottom && <span>👇</span>}
                    {status.regular && <span>👆👇</span>}
                  </div>
                );
              }}
            </DND>

            <div className="tc">上下可放置</div>
          </div>

          <div>
            <DND
              data="DND4"
              enableDrop={(node, tNode) => {
                if (!tNode) return true;

                if (tNode?.data === 'DND3') {
                  return {
                    top: true,
                    bottom: true,
                    center: true,
                  };
                }

                return false;
              }}
            >
              {({ innerRef, status, enables }) => {
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
                    {enables.enable && status.regular && <span>🥰</span>}
                    {!enables.enable && <span>⛔</span>}
                  </div>
                );
              }}
            </DND>

            <div className="tc">仅左侧盒子可放置</div>
          </div>
        </Row>
      </DNDContext>
    </div>
  );
};

export default EnableDemo;
