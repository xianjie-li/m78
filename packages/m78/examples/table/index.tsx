import React, { useEffect, useRef } from "react";
import { createTable } from "../../src/table-vanilla/table.js";
import { Scroll } from "../../src/index.js";
import {
  TableColumnConfig,
  TableColumnFixed,
  TableInstance,
  TableRowFixed,
} from "../../src/table-vanilla/types.js";

const list = Array.from({ length: 5000 }).map((_, i) => {
  const obj: any = {
    id: `id${i}`,
  };

  Array.from({ length: 40 }).forEach((_, j) => {
    obj[`field${j}`] = `${i}-${j}`;
  });

  return obj;
});

const list2 = Array.from({ length: 1000 }).map((_, i) => {
  const obj: any = {};

  Array.from({ length: 20 }).forEach((_, j) => {
    obj[`field${j}`] = `${i}-${j}`;
  });

  return obj;
});

const columns: TableColumnConfig[] = Array.from({ length: 40 }).map((_, j) => {
  const c: any = {
    key: `field${j}`,
    label: `field${j}`,
  };

  if (j === 4) {
    // c.width = 200;
  }
  //
  // if (j > 6 && j < 9) {
  //   c.fixed = "left";
  // }
  //
  // if (j > 20 && j < 23) {
  //   c.fixed = "right";
  // }

  return c;
});

const mergeColumns: TableColumnConfig[] = [];

mergeColumns.push(
  ...[
    {
      label: "表头1",
      children: [
        {
          label: "表头1-1",
          children: columns.slice(0, 4),
        },
        {
          label: "表头1-2",
          children: columns.slice(4, 7),
        },
      ],
    },
    {
      label: "浮动表头",
      children: columns.slice(7, 9),
      fixed: TableColumnFixed.left,
    },
    {
      label: "表头2",
      children: [
        {
          label: "表头2-1",
          children: columns.slice(9, 14),
        },
        {
          label: "表头2-2",
          children: columns.slice(14, 17),
        },
        {
          label: "表头2-3",
          children: columns.slice(17, 21),
        },
      ],
    },
    {
      label: "浮动表头-右",
      children: columns.slice(21, 23),
      fixed: TableColumnFixed.right,
    },
    /** 单合并项 */
    {
      label: "表头3",
      children: [
        {
          label: "表头3-1",
          children: columns.slice(23, 24),
        },
      ],
    },
    /** 小于其他层的合并项 */
    {
      label: "表头4",
      children: columns.slice(24, 27),
    },
    /** 小于其他层 */
    ...columns.slice(27, 30),
    {
      label: "表头5",
      children: [
        {
          label: "表头5-1",
          children: columns.slice(30, 34),
        },
        {
          label: "表头5-2",
          children: columns.slice(34, 40),
        },
      ],
    },
  ]
);

const TableExample = () => {
  const ref = useRef<HTMLDivElement>(null!);
  const scrollRef = useRef<HTMLDivElement>(null!);
  const scrollContRef = useRef<HTMLDivElement>(null!);
  const tableRef = useRef<TableInstance>(null!);

  useEffect(() => {
    console.time("1");

    const table = createTable({
      el: ref.current,
      data: list,
      // columns: columns,
      columns: mergeColumns,
      primaryKey: "id",
      rows: {
        // id17: {
        //   fixed: TableRowFixed.top,
        // },
        // id29: {
        //   fixed: TableRowFixed.top,
        // },
        id80: {
          fixed: TableRowFixed.bottom,
        },
        id100: {
          fixed: TableRowFixed.bottom,
        },
        id500: {
          height: 100,
        },
      },
      cells: {
        id3_field4: {
          mergeX: 3,
          mergeY: 3,
        },
        id6_field9: {
          mergeX: 3,
          mergeY: 2,
        },
        id9_field8: {
          mergeY: 3,
          mergeX: 5,
        },
        id15_field13: {
          mergeY: 3,
          mergeX: 2,
        },
      },
      viewEl: scrollRef.current,
      viewContentEl: scrollContRef.current,
      render(cell, isFirstRender) {
        if (
          isFirstRender &&
          cell.column.key === "field22" &&
          !cell.row.isHeader
        ) {
          const btn = document.createElement("button");
          btn.innerHTML = "操作";
          cell.dom.appendChild(btn);
          return (cell.state.btnRendered = true);
        }
      },
    });

    table.event.click.on((cell, event) => {
      console.log("click", cell, event);
    });

    window.temp = table;

    tableRef.current = table;

    console.timeEnd("1");

    console.log(table);
  }, []);

  return (
    <div>
      <div
        ref={ref}
        style={{
          width: 1300,
          height: 800,
          // border: "1px solid red",
        }}
      >
        <Scroll
          className="m78-table_view m78-table_expand-size"
          direction="xy"
          disabledScroll
          innerWrapRef={scrollRef}
          miniBar
          scrollIndicator={false}
        >
          <div ref={scrollContRef} />
        </Scroll>
      </div>

      <button
        onClick={() => {
          tableRef.current.y(tableRef.current.y() + 30);
          tableRef.current.render();
        }}
      >
        top
      </button>
      <button
        onClick={() => {
          tableRef.current.y(tableRef.current.y() - 30);
          tableRef.current.render();
        }}
      >
        bottom
      </button>

      <button
        onClick={() => {
          tableRef.current.x(tableRef.current.x() + 30);
          tableRef.current.render();
        }}
      >
        left
      </button>
      <button
        onClick={() => {
          tableRef.current.x(tableRef.current.x() - 30);
          tableRef.current.render();
        }}
      >
        right
      </button>
      <button
        onClick={() => {
          tableRef.current.destroy();
        }}
      >
        destroy
      </button>
      <button
        onClick={() => {
          tableRef.current.reload();
        }}
      >
        reload
      </button>
      <button
        onClick={() => {
          tableRef.current.reload({ keepPosition: true });
        }}
      >
        reload keep
      </button>
      <button
        onClick={() => {
          tableRef.current.config().data = list;
          tableRef.current.reload();
        }}
      >
        list1
      </button>
      <button
        onClick={() => {
          tableRef.current.config().data = list2;
          tableRef.current.reload();
        }}
      >
        list2
      </button>
      <button
        onClick={() => {
          tableRef.current.config().data[3].field3 =
            "不去过去给我钱给我个, 恩格尔我各位各位各位各位各位各位各位";
          tableRef.current.render();
        }}
      >
        change text
      </button>
      <button
        onClick={() => {
          console.log(
            tableRef.current.getBoundItems(
              {
                left: 200,
                top: 200,
                width: 600,
                height: 600,
              },
              true
            )
          );
        }}
      >
        getBound
      </button>
      <button
        onClick={() => {
          console.log(tableRef.current.getBoundItems([300, 300]));
        }}
      >
        getBound
      </button>
      <button
        onClick={() => {
          console.log(tableRef.current.zoom());
        }}
      >
        getZoom
      </button>
      <button
        onClick={() => {
          tableRef.current.zoom(tableRef.current.zoom() - 0.1);
        }}
      >
        - zoom
      </button>
      <button
        onClick={() => {
          tableRef.current.zoom(tableRef.current.zoom() + 0.1);
        }}
      >
        + zoom
      </button>
    </div>
  );
};

export default TableExample;
