import React, { useState } from 'react';
import DND, { DragBonus, DNDContext, DragPartialEvent, DNDProps } from 'm78/dnd';
import { Row } from 'm78/layout';

import cls from 'classnames';
import { DragFullEvent } from 'm78/dnd/types';
import _shuffle from 'lodash/shuffle';

import { useFn } from '@lxjx/hooks';
import { swap } from '@lxjx/utils';
import { useTransition, animated } from 'react-spring';
import sty from './play.module.scss';

const ColumLen = 5;

const Play = () => {
  const [list, setList] = useState(() => {
    return Array.from({ length: 20 }).map((_, ind) => ind);
  });

  console.log(list);

  const transition = useTransition(list, {
    keys: item => item,
    enter: item => {
      const ind = list.indexOf(item);
      return {
        left: (ind % ColumLen) * 100,
        top: Math.floor(ind / ColumLen) * 100,
        opacity: 1,
      };
    },
    update: item => {
      const ind = list.indexOf(item);
      return {
        left: (ind % ColumLen) * 100,
        top: Math.floor(ind / ColumLen) * 100,
        opacity: 1,
      };
    },
    // leave: item => {
    //   const ind = list.indexOf(item);
    //   return {
    //     left: (ind % ColumLen) * 120,
    //     top: Math.floor(ind / ColumLen) * 120,
    //     opacity: 0,
    //   };
    // },
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
    const disabledBottom = ind > list.length - (ColumLen + 1);

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

  const fragment = transition((style, item, transition, index) => {
    return (
      <DND data={item} enableDrop={disableEdge}>
        {({ innerRef, status, enables }) => (
          <animated.div
            className={cls(sty.gridItem, 'm78-dnd-box', {
              // 禁用、拖动到中间的状态
              __active: status.dragCenter,
              __disabled: !enables.enable,
            })}
            ref={innerRef}
            style={style}
          >
            {item}

            {/* 拖动到侧边方向的提示 */}
            {status.dragLeft && <span className="m78-dnd-box_left" />}
            {status.dragRight && <span className="m78-dnd-box_right" />}
            {status.dragTop && <span className="m78-dnd-box_top" />}
            {status.dragBottom && <span className="m78-dnd-box_bottom" />}
          </animated.div>
        )}
      </DND>
    );
  });

  return (
    <div>
      <button
        onClick={() => {
          const ls = _shuffle(list);
          setList([...ls]);
        }}
      >
        suffer
      </button>

      <DNDContext onAccept={acceptHandle}>
        <div
          className={sty.grid}
          style={{
            width: ColumLen * 100,
            height: Math.ceil(list.length / ColumLen) * 100,
          }}
        >
          {fragment}
          {/* {list.map((item, ind) => ( */}
          {/*  <DND key={item} data={item} enableDrop={disableEdge}> */}
          {/*    {({ innerRef, status, enables }) => ( */}
          {/*      <div */}
          {/*        className={cls(sty.gridItem, 'm78-dnd-box', { */}
          {/*          // 禁用、拖动到中间的状态 */}
          {/*          __active: status.dragCenter, */}
          {/*          __disabled: !enables.enable, */}
          {/*        })} */}
          {/*        ref={innerRef} */}
          {/*        style={{ */}
          {/*          position: 'absolute', */}
          {/*          transition: '0.3s', */}
          {/*          left: (ind % ColumLen) * 100, */}
          {/*          top: Math.floor(ind / ColumLen) * 100, */}
          {/*        }} */}
          {/*      > */}
          {/*        {item} */}

          {/*        /!* 拖动到侧边方向的提示 *!/ */}
          {/*        {status.dragLeft && <span className="m78-dnd-box_left" />} */}
          {/*        {status.dragRight && <span className="m78-dnd-box_right" />} */}
          {/*        {status.dragTop && <span className="m78-dnd-box_top" />} */}
          {/*        {status.dragBottom && <span className="m78-dnd-box_bottom" />} */}
          {/*      </div> */}
          {/*    )} */}
          {/*  </DND> */}
          {/* ))} */}
        </div>
      </DNDContext>
    </div>
  );
};

export default Play;
