import React, { useEffect, useRef } from "react";
import { createTable } from "../../src/table-vanilla/table.js";
import { Scroll } from "../../src/index.js";
import { TableInstance } from "../../src/table-vanilla/types/instance.js";

import { TableColumnConfig } from "../../src/table-vanilla/types/items.js";
import { TableReloadLevel } from "../../src/table-vanilla/plugins/life.js";
import {
  TableColumnFixed,
  TableRowFixed,
} from "../../src/table-vanilla/types/base-type.js";
import { createRandString } from "@m78/utils";

const createRow = (key: any) => {
  const obj: any = {
    id: `id${key}`,
  };

  Array.from({ length: 40 }).forEach((_, j) => {
    obj[`field${j}`] = `${key}-${j}`;
  });

  return obj;
};

const list = Array.from({ length: 1000 }).map((_, i) => {
  return createRow(i);
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

const list3: any[] = [];

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

const columns3: TableColumnConfig[] = Array.from({ length: 40 }).map((_, j) => {
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

  if (j > 20 && j < 23) {
    c.fixed = "right";
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
      columns: columns3,
      // columns: mergeColumns,
      primaryKey: "id",
      dragSortRow: true,
      dragSortColumn: true,
      rows: {
        id5: {
          fixed: TableRowFixed.top,
        },
        id6: {
          fixed: TableRowFixed.top,
        },
        id7: {
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
      persistenceConfig: {
        sortColumns: ["field27", "field28", "field3"],
        // hideColumns: ["field17", "field18", "field19", "field20"],
        rows: {
          id12: {
            height: 100,
          },
        },
      },
      rowSelectable: (row) => {
        return row.key !== "id5" && row.key !== "id6" && row.key !== "id8";
      },
      cellSelectable: (cell) => {
        return cell.column.key !== "field22";
      },
      viewEl: scrollRef.current,
      viewContentEl: scrollContRef.current,
      render(cell, ctx) {
        if (cell.row.isFake) return;

        if (cell.column.key === "field22") {
          ctx.disableDefaultRender = true;
        }

        if (ctx.isFirstRender && cell.column.key === "field22") {
          const btn = document.createElement("button");
          btn.innerHTML = "操作";
          cell.dom.appendChild(btn);
        }
      },
    });

    // @ts-ignore
    window.temp = table;

    table.event.mutation.on((e) => {
      console.log(e);
    });

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
          list1
        </button>
        <button
          onClick={() => {
            tableRef.current.config({
              data: list2,
              columns: columns2,
            });
          }}
        >
          list2
        </button>
        <button
          onClick={() => {
            tableRef.current.config({
              data: list3 as any,
              columns: columns2,
            });
          }}
        >
          list3
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

      <div>
        <strong>history:</strong>
        <button
          onClick={() => {
            tableRef.current.history.undo();
            console.log(tableRef.current.history);
          }}
        >
          undo
        </button>
        <button
          onClick={() => {
            tableRef.current.history.redo();
            console.log(tableRef.current.history);
          }}
        >
          redo
        </button>
        <button
          onClick={() => {
            console.log(tableRef.current.history);
          }}
        >
          log
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

      <div>
        <strong>debug:</strong>

        <button
          onClick={() => {
            // @ts-ignore
            console.log(tableRef.current.__ctx);
          }}
        >
          log ctx
        </button>
      </div>

      <div>
        <strong>mutation:</strong>
        <button
          onClick={() => {
            console.log(tableRef.current.getChangedConfigKeys());
          }}
        >
          getChangedConfigKeys
        </button>
        <button
          onClick={() => {
            console.log(tableRef.current.getPersistenceConfig());
          }}
        >
          getPersistenceConfig
        </button>
        <button
          onClick={() => {
            const list =
              tableRef.current.getPersistenceConfig().hideColumns || [];

            const ind17 = list.indexOf("field17");

            if (ind17 === -1) {
              tableRef.current.setPersistenceConfig("hideColumns", [
                ...list,
                "field17",
                "field18",
              ]);
            } else {
              tableRef.current.setPersistenceConfig(
                "hideColumns",
                list.filter((i) => i !== "field17" && i !== "field18")
              );
            }
          }}
        >
          toggle field17/18"
        </button>
        <button
          onClick={() => {
            const list =
              tableRef.current.getPersistenceConfig().hideColumns || [];

            const ind = list.indexOf("field7");

            if (ind === -1) {
              tableRef.current.setPersistenceConfig("hideColumns", [
                ...list,
                "field7",
                "field8",
                "field21",
              ]);
            } else {
              tableRef.current.setPersistenceConfig(
                "hideColumns",
                list.filter(
                  (i) => i !== "field7" && i !== "field8" && i !== "field21"
                )
              );
            }
          }}
        >
          toggle 7
        </button>
        <button
          onClick={() => {
            tableRef.current.addRow(createRow(createRandString().slice(0, 4)));
          }}
        >
          add 1
        </button>
        <button
          onClick={() => {
            tableRef.current.addRow(
              createRow(createRandString().slice(0, 4)),
              "id999",
              true
            );
          }}
        >
          add 1 to end
        </button>
        <button
          onClick={() => {
            tableRef.current.addRow([
              createRow(createRandString().slice(0, 4)),
              createRow(createRandString().slice(0, 4)),
              createRow(createRandString().slice(0, 4)),
            ]);
          }}
        >
          add 3
        </button>
        <button
          onClick={() => {
            tableRef.current.addRow(
              createRow(createRandString().slice(0, 4)),
              "id4"
            );
          }}
        >
          add 1 to id4
        </button>
        <button
          onClick={() => {
            tableRef.current.removeRow(["id6", "id1", "id2"]);
          }}
        >
          remove 6,1,2
        </button>
        <div>
          row:
          <button
            onClick={() => {
              tableRef.current.moveRow(["id1", "id2"], "id6");
            }}
          >
            move n to f: 1,2 to 6
          </button>
          <button
            onClick={() => {
              tableRef.current.moveRow(["id998", "id999"], "id6");
            }}
          >
            move n to f: 998,999 to 6
          </button>
          <button
            onClick={() => {
              tableRef.current.moveRow(["id5", "id6"], "id2");
            }}
          >
            move f to n: 5,6 to 2
          </button>
          <button
            onClick={() => {
              tableRef.current.moveRow(["id100"], "id6");
            }}
          >
            move f to f: 100 to 6
          </button>
          <button
            onClick={() => {
              tableRef.current.moveRow(
                ["id0", "id1", "id2", "id3", "id4"],
                "id15"
              );
            }}
          >
            move n to n: 0,1,2,3,4 to 15
          </button>
          <button
            onClick={() => {
              tableRef.current.moveRow(["id1", "id2"], "id6", true);
            }}
          >
            move n to f: 1,2 to 6 after
          </button>
        </div>
        <div>
          col:
          <button
            onClick={() => {
              tableRef.current.moveColumn(["field5", "field6"], "field2");
            }}
          >
            move n to n: 5,6 to 2
          </button>
          <button
            onClick={() => {
              tableRef.current.moveColumn(["field5", "field6"], "field8");
            }}
          >
            move n to f: 5,6 to 8
          </button>
          <button
            onClick={() => {
              tableRef.current.moveColumn(["field7"], "field3");
            }}
          >
            move f to n: 7 to 3
          </button>
          <button
            onClick={() => {
              tableRef.current.moveColumn(["field29"], "field27");
            }}
          >
            move: 29 to 27
          </button>
        </div>
      </div>

      <div>
        <strong>highlight:</strong>
        <button
          onClick={() => {
            tableRef.current.highlight([
              tableRef.current.getCellKey("id2", "field1"),
              tableRef.current.getCellKey("id6", "field3"),
              tableRef.current.getCellKey("id4", "field1"),
              tableRef.current.getCellKey("id6", "field1"),
            ]);
          }}
        >
          highlight cell
        </button>
        <button
          onClick={() => {
            tableRef.current.highlight([
              tableRef.current.getCellKey("id25", "field14"),
            ]);
          }}
        >
          highlight cell2
        </button>
        <button
          onClick={() => {
            tableRef.current.highlightColumn("field14");
          }}
        >
          highlight field14
        </button>
        <button
          onClick={() => {
            tableRef.current.highlightRow("id99");
          }}
        >
          highlight id99
        </button>
      </div>

      <div>
        <strong>disabled:</strong>
        <button
          onClick={() => {
            tableRef.current.setCellDisable([
              tableRef.current.getCellKey("id2", "field1"),
              tableRef.current.getCellKey("id6", "field3"),
              tableRef.current.getCellKey("id4", "field1"),
              tableRef.current.getCellKey("id6", "field1"),
            ]);
          }}
        >
          disabled cell
        </button>
        <button
          onClick={() => {
            tableRef.current.setCellDisable([
              tableRef.current.getCellKey("id25", "field14"),
            ]);
          }}
        >
          disabled cell25/14
        </button>
        <button
          onClick={() => {
            tableRef.current.setColumnDisable(["field14"]);
          }}
        >
          disabled field14
        </button>
        <button
          onClick={() => {
            tableRef.current.setRowDisable(["id99"]);
          }}
        >
          disabled id99
        </button>
      </div>

      <div id="output"></div>
    </div>
  );
};

export default TableExample;
