import React, { useState } from 'react';

import { isString, swap } from '@lxjx/utils';
import { useFn } from '@lxjx/hooks';
import { DND, DragFullEvent, DNDContext } from 'm78/dnd';
import cls from 'clsx';

import sty from './board-demo.module.scss';

/** 栏目的data类型 */
type ColumnNodeData = {
  name: string;
  list: string[];
};

/** 待办项的data类型 */
type TodoNodeData = {
  list: string[];
  item: string;
};

const BoardDemo = () => {
  /** todo数据源 */
  const [todo, setTodo] = useState(() => [
    {
      name: 'Todo',
      list: ['😀', '😁', '😂', '🤣', '😃', '😄', '😅', '😆', '😉', '😊', '😋'],
    },
    {
      name: 'Progress',
      list: ['😎'],
    },
    {
      name: 'Completed',
      list: ['😍', '😘'],
    },
  ]);

  /** 检测是否是ColumnNodeData */
  function isColumn(data: any): data is ColumnNodeData {
    if (!data) return false;
    return isString(data.name);
  }

  /** 放置事件，在这里同步列表状态, 通常会将不同的放置类型通过此函数分发到不同的处理函数中，这里作为演示都写在一起 */
  const acceptHandle = useFn(
    ({ target, source, status }: DragFullEvent<TodoNodeData, ColumnNodeData | TodoNodeData>) => {
      // 拖动目标
      const sData = source?.data;
      // 放置目标
      const tData = target?.data;

      if (!sData || !tData) return;

      /* ######### 放置目标是栏目 #########  */
      if (isColumn(tData)) {
        // 拖动目标也是栏目, 交换彼此位置
        if (isColumn(sData)) {
          setTodo(prev => {
            // 查找两者的当前索引
            const tInd = prev.findIndex(item => item.name === tData.name);
            const sInd = prev.findIndex(item => item.name === sData.name);

            // 交换栏目位置
            swap(prev, sInd, tInd);
            // 如果不想使用库来交互元素位置，可以替换成以下代码
            // prev.splice(tInd, 1, prev.splice(sInd, 1, prev[tInd])[0]);

            return [...prev];
          });
          return;
        }

        // 拖动目标是待办项，将其放到该栏目底部
        const ind = sData.list.indexOf(sData.item);

        if (ind !== -1) {
          const removed = sData.list.splice(ind, 1);

          tData.list.push(...removed);

          // 触发更新
          setTodo(prev => [...prev]);
        }
        return;
      }

      /* ######### 放置目标是待办项 #########  */
      // 查找两者的当前索引
      const sInd = sData.list.indexOf(sData.item);
      const tInd = tData.list.indexOf(tData.item);

      if (sInd === -1 || tInd === -1) return;

      // 从当前组移除
      const removed = sData.list.splice(sInd, 1);

      // 插入位置
      let insertInd = tInd;

      // 方向为`bottom`，放置到目标下方，其它均为替换当前位置
      if (status.dragBottom) {
        insertInd += 1;
      }

      tData.list.splice(insertInd, 0, ...removed);

      // 触发更新
      setTodo(prev => [...prev]);
    },
  );

  return (
    <div>
      <DNDContext onAccept={acceptHandle}>
        {todo.map(({ name, list }) => (
          /* 栏目 */
          <DND<ColumnNodeData>
            key={name}
            data={{
              name,
              list,
            }}
          >
            {bonus => (
              <div
                // 设置挂载点
                ref={bonus.innerRef}
                className={cls(sty.column, 'm78-dnd-box', {
                  // 拖动到顶部时时设置高亮
                  __active: bonus.status.dragOver,
                })}
              >
                {/* 设置标题部分为拖动把手 */}
                <div ref={bonus.handleRef} className={sty.columnTitle}>
                  {name}
                </div>
                <div className={sty.columnList}>
                  {/* 待办项列表 */}
                  {list.map(todoItem => (
                    <DND<TodoNodeData>
                      key={todoItem}
                      data={{
                        list,
                        item: todoItem,
                      }}
                      enableDrop={dragNode => {
                        // 如果拖动目标是栏目、禁止防止
                        if (isColumn(dragNode?.data)) return false;

                        // 否则允许上中下三个位置
                        return {
                          top: true,
                          bottom: true,
                          center: true,
                        };
                      }}
                    >
                      {({ innerRef, status, enables }) => (
                        <div
                          // 设置挂载点
                          ref={innerRef}
                          className={cls(sty.todo, 'm78-dnd-box', {
                            // 设置拖动高亮、禁用、拖动中的样式
                            __active: status.dragCenter,
                            __disabled: !enables.enable || status.dragging,
                          })}
                        >
                          <div>item{todoItem}</div>
                          <div>这是该事项的说明...</div>

                          {/* 拖动到上下方的反馈节点 */}
                          {status.dragBottom && <div className="m78-dnd-box_bottom" />}
                          {status.dragTop && <div className="m78-dnd-box_top" />}
                        </div>
                      )}
                    </DND>
                  ))}
                </div>
              </div>
            )}
          </DND>
        ))}
      </DNDContext>
    </div>
  );
};

export default BoardDemo;
