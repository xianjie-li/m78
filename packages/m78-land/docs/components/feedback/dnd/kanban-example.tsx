import React, { useState } from "react";

import css from "./style.module.scss";
import { Lay, LayStyle } from "m78/layout";
import { DND, DNDFullEvent } from "m78/dnd";
import { Scroll } from "m78/scroll";
import { useFn } from "@m78/hooks";
import clsx from "clsx";
import { isString, swap } from "@m78/utils";

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

const KanbanExample = () => {
  /** todo数据源 */
  const [todo, setTodo] = useState(() => [
    {
      name: "Todo",
      list: ["😀", "😁", "😂", "🤣", "😃", "😄", "😅", "😆", "😉", "😊", "😋"],
    },
    {
      name: "Progress",
      list: ["😎"],
    },
    {
      name: "Completed",
      list: ["😍", "😘"],
    },
  ]);

  /** 检测是否是ColumnNodeData */
  function isColumn(data: any): data is ColumnNodeData {
    if (!data) return false;
    return isString(data.name);
  }

  /** 放置事件，在这里同步列表状态, 通常会将不同的放置类型通过此函数分发到不同的处理函数中，这里作为演示都写在一起 */
  const acceptHandle = useFn(
    ({
      target,
      source,
      status,
    }: DNDFullEvent<ColumnNodeData | TodoNodeData>) => {
      // 拖动目标
      const sData = source?.data;
      // 放置目标
      const tData = target?.data;

      if (!sData || !tData) return;

      /* ######### 放置目标是栏目 #########  */
      if (isColumn(tData)) {
        // 拖动目标也是栏目, 交换彼此位置
        if (isColumn(sData)) {
          setTodo((prev) => {
            // 查找两者的当前索引
            const tInd = prev.findIndex((item) => item.name === tData.name);
            const sInd = prev.findIndex((item) => item.name === sData.name);

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
          setTodo((prev) => [...prev]);
        }
        return;
      }

      if (isColumn(sData)) return;

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
      if (status.bottom) {
        insertInd += 1;
      }

      tData.list.splice(insertInd, 0, ...removed);

      // 触发更新
      setTodo((prev) => [...prev]);
    }
  );

  function renderTask(todoItem: string, list: string[]) {
    return (
      <DND<TodoNodeData>
        key={todoItem}
        data={{
          list,
          item: todoItem,
        }}
        enableDrag
        enableDrop={({ source }) => {
          // 如果拖动目标是栏目、禁止放置
          if (isColumn(source?.data)) return false;

          // 否则允许上中下三个位置
          return {
            top: true,
            bottom: true,
            center: true,
          };
        }}
        onSourceAccept={acceptHandle}
        group="kanban"
      >
        {({ ref, status, enables }) => (
          <Lay
            // 设置挂载点
            innerRef={ref}
            className={clsx(css.columnTask, {
              [css.columnTipLineTop]: status.top,
              [css.columnTipLineBottom]: status.bottom,
            })}
            // 设置拖动高亮、禁用、拖动中的样式
            active={status.center}
            disabled={!enables.enable || status.dragging}
            title={`item${todoItem}`}
            desc="task1 desc..."
            itemStyle={LayStyle.border}
          />
        )}
      </DND>
    );
  }

  return (
    <div>
      {todo.map(({ name, list }) => (
        /* 栏目 */
        <DND<ColumnNodeData>
          enableDrag
          enableDrop
          key={name}
          data={{
            name,
            list,
          }}
          onSourceAccept={acceptHandle}
          group="kanban"
        >
          {(rProps) => (
            <div
              // 设置挂载点
              ref={rProps.ref}
              className={clsx(css.column, {
                // 拖动到顶部时时设置高亮
                [css.columnActive]: rProps.status.over,
              })}
            >
              {/* 设置标题部分为拖动把手 */}
              <div ref={rProps.handleRef} className={css.columnTitle}>
                {name}
              </div>
              <Scroll
                direction="y"
                className={css.columnList}
                contStyle={{ padding: "8px 8px 80px" }}
                miniBar
              >
                {/* 待办项列表 */}
                {list.map((todoItem) => renderTask(todoItem, list))}
              </Scroll>
            </div>
          )}
        </DND>
      ))}
    </div>
  );
};

export default KanbanExample;
