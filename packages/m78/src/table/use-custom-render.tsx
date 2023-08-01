import React, { useEffect } from "react";
import {
  _CustomRenderItem,
  _RCTableContext,
  RCTableInstance,
  RCTableRenderArg,
} from "./types.js";
import {
  TableCell,
  TableCellWithDom,
  TableRenderCtx,
} from "../table-vanilla/index.js";
import { isTruthyOrZero } from "@m78/utils";
import { useFn } from "@m78/hooks";
import { IconFilterAlt } from "@m78/icons/icon-filter-alt.js";

import { Button } from "../button/index.js";
import { addCls, removeCls, Size } from "../common/index.js";
import SortBtn from "./simple-widgets/sort-btn.js";
import ReactDom, { flushSync } from "react-dom";

// 自定义渲染
export function _useCustomRender(ctx: _RCTableContext) {
  const { props, self, state } = ctx;

  // mountChange触发时, 清理renderMap中已卸载的单元格
  useEffect(() => {
    if (!state.instance) return;

    const handle = (cell: TableCell) => {
      if (!cell.isMount) {
        delete self.renderMap[cell.key];
      }
    };

    state.instance.event.mountChange.on(handle);

    return () => {
      state.instance.event.mountChange.off(handle);
    };
  }, [state.instance]);

  // 表头绘制控制, 添加过滤/排序按钮
  const headerRender = useFn(({ cell }: RCTableRenderArg) => {
    const column = cell.column;

    if (cell.row.isHeader && !column.isHeader) {
      const sort = column.config.sort;

      if (sort) {
        addCls(cell.dom, "__sort");
      } else {
        removeCls(cell.dom, "__sort");
      }

      return (
        <>
          <span>{cell.text}</span>
          <span className="m78-table_header-icons">
            {sort && <SortBtn />}
            {column.config.filterRender && (
              <Button className="color-disabled" size={Size.small} squareIcon>
                <IconFilterAlt className="fs-12" />
              </Button>
            )}
          </span>
        </>
      );
    }
  });

  // 覆盖并扩展table.config.render
  const render = useFn((cell: TableCellWithDom, _ctx: TableRenderCtx) => {
    const arg = {
      cell,
      context: props.context || {},
      table: state.instance as any as RCTableInstance,
    };

    if (cell.column.config.render && !cell.row.isFake) {
      _ctx.disableDefaultRender = true;

      self.renderMap[cell.key] = {
        cell,
        element: cell.column.config.render(arg),
      };
      return;
    }

    let ret = props.render?.(arg);

    if (!isTruthyOrZero(ret)) {
      ret = headerRender(arg);
    }

    if (isTruthyOrZero(ret)) {
      _ctx.disableDefaultRender = true;

      self.renderMap[cell.key] = {
        cell,
        element: ret!,
      };
      return;
    }
  });

  return {
    render,
  };
}

export type _UseCustomRender = ReturnType<typeof _useCustomRender>;

// 自定义渲染, 组件部分, 用于避免频繁render影响外部作用域
export function _CustomRender({ ctx }: { ctx: _RCTableContext }) {
  const { state, self } = ctx;

  const [list, setList] = React.useState<_CustomRenderItem[]>([]);

  // 更新渲染列表
  const update = useFn(() => {
    const ls = Object.keys(self.renderMap).map((key) => {
      return self.renderMap[key];
    });

    if (ctx.props.syncRender) {
      flushSync(() => {
        setList(ls);
      });
    } else {
      setList(ls);
    }
  });

  useEffect(() => {
    if (!state.instance) return;

    state.instance.event.rendered.on(update);

    update();

    return () => {
      state.instance.event.rendered.off(update);
    };
  }, [state.instance]);

  return (
    <>
      {list.map((i) => {
        return ReactDom.createPortal(i.element, i.cell.dom, String(i.cell.key));
      })}
    </>
  );
}
