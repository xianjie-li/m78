import React, { useState } from 'react';
import Button from 'm78/button';
import Popper from 'm78/popper';
import DND from 'm78/dnd';
import { Spacer } from 'm78/layout';

import cls from 'classnames';
import DNDContext from 'm78/dnd/dnd-context';
import { useFn } from '@lxjx/hooks';
import { DragFullEvent } from 'm78/dnd/types';
import { isArray, isNumber, isString } from '@lxjx/utils';
import { DragOutlined } from './icon';

import sty from './play.module.scss';

const style = {
  width: 100,
  height: 100,
  border: '1px solid red',
};

/** 栏目的data类型, 它的列表本身 */
type ColumnNodeData = {
  name: string;
  list: number[];
};

/** 待办项的data类型，所属列表和值 */
type TodoNodeData = {
  list: number[];
  item: number;
};

const Play = () => {
  const [todo, setTodo] = useState(() => [
    {
      name: '待办',
      list: [1, 2, 3, 4, 5, 6],
    },
    {
      name: '进行中',
      list: [7, 8, 9],
    },
    {
      name: '已完成',
      list: [10, 11, 12, 13],
    },
  ]);

  const acceptHandle = useFn(
    ({ target, source, status }: DragFullEvent<TodoNodeData, ColumnNodeData | TodoNodeData>) => {
      const sData = source?.data;
      const tData = target?.data;

      console.log(sData, tData);

      if (!sData || !tData) return;

      // 目标是栏目
      if (isColumn(tData)) {
        // 拖动目标也是栏目, 交换位置
        if (isColumn(sData)) {
          setTodo(prev => {
            const tInd = prev.findIndex(item => item.name === tData.name);
            const sInd = prev.findIndex(item => item.name === sData.name);

            prev.splice(tInd, 1, prev.splice(sInd, 1, prev[tInd])[0]);

            return [...prev];
          });
          return;
        }

        const ind = sData.list.indexOf(sData.item);

        if (ind !== -1) {
          const removed = sData.list.splice(ind, 1);

          tData.list.push(...removed);

          // 触发更新
          setTodo(prev => [...prev]);
        }
        return;
      }

      // 目标是待办项
      const sInd = sData.list.indexOf(sData.item);
      const tInd = tData.list.indexOf(tData.item);

      if (sInd === -1 || tInd === -1) return;

      const removed = sData.list.splice(sInd, 1);

      let insertInd = tInd;

      // 除了下外，其它均为替换当前位置
      if (status.dragBottom) {
        insertInd += 1;
      }

      tData.list.splice(insertInd, 0, ...removed);

      // 触发更新
      setTodo(prev => [...prev]);
    },
  );

  /** 检测是否是ColumnNodeData */
  function isColumn(data: any): data is ColumnNodeData {
    if (!data) return false;
    return isString(data.name);
  }

  /** 检测是否是TodoNodeData */
  function isTodo(data: any): data is TodoNodeData {
    if (!data) return false;
    return isNumber(data.item);
  }

  return (
    <div>
      <DNDContext onAccept={acceptHandle}>
        {todo.map(({ name, list }) => (
          <DND<ColumnNodeData>
            key={name}
            data={{
              name,
              list,
            }}
            id={name}
          >
            {bonus => (
              <div
                ref={bonus.innerRef}
                className={cls(sty.column, 'm78-dnd-box', {
                  __active: bonus.status.dragOver || bonus.status.dragCenter,
                })}
              >
                <div ref={bonus.handleRef} className={sty.columnTitle}>
                  {name}
                </div>
                <div className={sty.columnList}>
                  {list.map(todoItem => (
                    <DND<TodoNodeData>
                      key={todoItem}
                      data={{
                        list,
                        item: todoItem,
                      }}
                      enableDrop={(dragNode, dropNode) => {
                        if (isColumn(dragNode?.data)) return false;
                        return {
                          top: true,
                          bottom: true,
                          center: true,
                        };
                      }}
                    >
                      {({ innerRef, status, enables }) => (
                        <div
                          ref={innerRef}
                          className={cls(sty.todo, 'm78-dnd-box', {
                            __active: status.dragCenter,
                            __disabled: !enables.enable || status.dragging,
                            __dragging: status.dragging,
                          })}
                        >
                          <div>待办事项{todoItem}</div>
                          <div>这是该事项的说明...</div>

                          {status.dragLeft && <div className="m78-dnd-box_left" />}
                          {status.dragRight && <div className="m78-dnd-box_right" />}
                          {status.dragBottom && <div className="m78-dnd-box_bottom" />}
                          {status.dragTop && <div className="m78-dnd-box_top" />}
                        </div>
                      )}
                    </DND>
                  ))}
                </div>

                {bonus.status.dragLeft && <div className="m78-dnd-box_left" />}
                {bonus.status.dragRight && <div className="m78-dnd-box_right" />}
              </div>
            )}
          </DND>
        ))}
      </DNDContext>

      <Spacer height={2000} />
    </div>
  );
};

/*
*


* */

export default Play;
