import React, { useEffect, useRef } from "react";
import { createTable } from "../../src/table-vanilla/table.js";
import { Scroll } from "../../src/index.js";
import {
  TableColumnConfig,
  TableColumnFixed,
  TableInstance,
  TableReloadLevel,
  TableRowFixed,
} from "../../src/table-vanilla/types.js";

const list = Array.from({ length: 10000 }).map((_, i) => {
  const obj: any = {
    id: `id${i}`,
  };

  Array.from({ length: 40 }).forEach((_, j) => {
    obj[`field${j}`] = `${i}-${j}`;
  });

  return obj;
});

const list2 = Array.from({ length: 1000 }).map((_, i) => {
  const obj: any = {
    id: `id${i}`,
  };

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
    c.width = 200;
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

const columns2: TableColumnConfig[] = Array.from({ length: 20 }).map((_, j) => {
  const c: any = {
    key: `field${j}`,
    label: `field${j}`,
  };

  if (j === 4) {
    c.width = 200;
  }

  if (j > 6 && j < 9) {
    c.fixed = "left";
  }

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

const ls = [1, 2, 3, 4, 5];
let seed = 5;
const getNew = () => (seed += 1);

const TableExample = () => {
  const ref = useRef<HTMLDivElement>(null!);
  const scrollRef = useRef<HTMLDivElement>(null!);
  const scrollContRef = useRef<HTMLDivElement>(null!);
  const tableRef = useRef<TableInstance>(null!);

  useEffect(() => {
    console.time("1");

    const table = createTable({
      rowSelectable: (row) => {
        return row.key !== "id5" && row.key !== "id6" && row.key !== "id8";
      },
      cellSelectable: (cell) => {
        return cell.column.key !== "field22";
      },
      el: ref.current,
      data: list,
      // columns: columns,
      columns: mergeColumns,
      primaryKey: "id",
      rows: {
        // id17: {
        //   fixed: TableRowFixed.top,
        // },
        id29: {
          fixed: TableRowFixed.top,
        },
        id30: {
          fixed: TableRowFixed.top,
        },
        id31: {
          fixed: TableRowFixed.top,
        },
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
        "id3##field4": {
          mergeX: 3,
          mergeY: 3,
        },
        "id6##field10": {
          mergeX: 3,
          mergeY: 2,
        },
        "id9##field8": {
          mergeY: 3,
          mergeX: 5,
        },
        "id15##field13": {
          mergeY: 3,
          mergeX: 2,
        },
      },
      viewEl: scrollRef.current,
      viewContentEl: scrollContRef.current,
      render(cell, ctx) {
        if (
          ctx.isFirstRender &&
          cell.column.key === "field22" &&
          !cell.row.isHeader
        ) {
          const btn = document.createElement("button");
          btn.innerHTML = "操作";
          cell.dom.appendChild(btn);
          ctx.disableDefaultRender = true;
        }
      },
    });

    table.event.click.on((cell, event) => {
      // console.log("click", cell, event);
      // tableRef.current.addRange({
      //   left: cell.column.x,
      //   top: cell.row.y,
      //   width: cell.column.width,
      //   height: cell.row.height,
      // });
      // tableRef.current.addRange({
      //   left: cell.column.x - 100,
      //   top: cell.row.y - 32,
      //   width: cell.column.width + 200,
      //   height: cell.row.height + 64,
      // });
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
          // width: 1300,
          maxWidth: "1300px",
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
          tableRef.current.xy(tableRef.current.x(), tableRef.current.y() - 30);
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
          console.time("reload");
          tableRef.current.reload();
          console.timeEnd("reload");
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
          console.time("reload index");
          tableRef.current.reload({ level: TableReloadLevel.index });
          console.timeEnd("reload index");
        }}
      >
        reload index
      </button>
      <button
        onClick={() => {
          console.time("reload full");
          tableRef.current.reload({ level: TableReloadLevel.full });
          console.timeEnd("reload full");
        }}
      >
        reload full
      </button>
      <div>
        <strong>config: </strong>
        <button
          onClick={() => {
            console.log(tableRef.current.config());
          }}
        >
          get config
        </button>
        <button
          onClick={() => {
            tableRef.current.config({
              data: list,
              columns: mergeColumns,
            });
          }}
        >
          config list1
        </button>
        <button
          onClick={() => {
            tableRef.current.config({
              data: list2,
              columns: columns2,
            });
          }}
        >
          config list2
        </button>
        <button
          onClick={() => {
            tableRef.current.config({
              rowHeight: 40,
              columnWidth: 200,
            });
          }}
        >
          config size
        </button>
        <button
          onClick={() => {
            tableRef.current.config(
              {
                cells: {
                  ...tableRef.current.config().cells,
                  "id19##field13": {
                    mergeY: 3,
                    mergeX: 2,
                  },
                },
              },
              true
            );
          }}
        >
          config merge
        </button>
      </div>
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

      <div>
        <button
          onClick={() => {
            const num = getNew();

            tableRef.current.redo({
              redo() {
                ls.push(num);
              },
              undo() {
                ls.pop();
                console.log(222);
              },
            });

            console.log(ls);
          }}
        >
          push
        </button>
        <button
          onClick={() => {
            const num = getNew();

            tableRef.current.redo({
              redo() {
                ls.unshift(num);
              },
              undo() {
                ls.shift();
              },
            });

            console.log(ls);
          }}
        >
          unshif
        </button>
        <button
          onClick={() => {
            const num = getNew();
            const center = Math.floor(ls.length / 2);

            tableRef.current.redo({
              redo() {
                ls.splice(center, 0, num);
              },
              undo() {
                ls.splice(center, 1);
              },
            });

            console.log(ls);
          }}
        >
          insert
        </button>
        <button
          onClick={() => {
            tableRef.current.undo();
            console.log(ls);
          }}
        >
          undo
        </button>
        <button
          onClick={() => {
            tableRef.current.redo();
            console.log(ls);
          }}
        >
          redo
        </button>

        <div>
          <strong>select:</strong>
          <button
            onClick={() => {
              console.log(tableRef.current.getSelectedRows());
            }}
          >
            getSelectedRows
          </button>
          <button
            onClick={() => {
              console.log(tableRef.current.getSelectedCells());
            }}
          >
            getSelectedCells
          </button>
          <button
            onClick={() => {
              tableRef.current.selectRows(["id15", "id16", "id18"]);
            }}
          >
            selectRows
          </button>
          <button
            onClick={() => {
              tableRef.current.selectCells([
                "id15##field1",
                "id15##field1",
                "id16##field2",
                "id16##field3",
              ]);
            }}
          >
            selectCells
          </button>
        </div>
      </div>
    </div>
  );
};

export default TableExample;
