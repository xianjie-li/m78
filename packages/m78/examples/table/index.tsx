import React, { useEffect, useRef } from "react";
import { createTable } from "../../src/table-vanilla/table.js";
import { Scroll } from "../../src/index.js";
import { TableInstance, TableRowFixed } from "../../src/table-vanilla/types.js";

const list = Array.from({ length: 1000 }).map((_, i) => {
  const obj: any = {};

  Array.from({ length: 20 }).forEach((_, j) => {
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

const columns = Array.from({ length: 20 }).map((_, j) => {
  const c: any = {
    textGetter: (i: any) => i[`field${j}`],
  };

  if (j === 4) {
    // c.width = 200;
  }

  // if (j < 2) {
  //   c.fixed = "left";
  // }
  //
  // if (j > 12 && j < 15) {
  //   c.fixed = "right";
  // }

  return c;
});

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
      columns: columns,
      rows: (data, index) => {
        if (index % 2 === 0) {
          let fixed = undefined;

          // if (index < 3) {
          //   fixed = TableRowFixed.top;
          // }
          //
          // if (index === 4 || index === 100) {
          //   fixed = TableRowFixed.bottom;
          // }

          return {
            // height: 50,
            fixed,
          };
        }
      },
      // rows: {
      //   "0": {
      //     fixed: "top",
      //   },
      //   "1": {
      //     fixed: "top",
      //   },
      //   "501": {
      //     fixed: "bottom",
      //   },
      //   "999": {
      //     fixed: "bottom",
      //   },
      // },
      domEl: scrollRef.current,
      domContentEl: scrollContRef.current,
    });

    tableRef.current = table;

    console.timeEnd("1");

    console.log(table);

    // ref.current.addEventListener("wheel", (e) => {
    //   e.preventDefault();
    //
    //   stats.begin();
    //
    //   const deltaX = e.deltaX;
    //   const deltaY = e.deltaY;
    //
    //   tableRef.current.xy(
    //     tableRef.current.x() - deltaX,
    //     tableRef.current.y() - deltaY
    //   );
    //
    //   stats.end();
    // });
  }, []);

  return (
    <div>
      <div
        ref={ref}
        style={{
          width: 800,
          height: 400,
          // border: "1px solid red",
        }}
      >
        <Scroll
          className="m78-table_expand-size"
          direction="xy"
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
          tableRef.current.config.data = list;
          tableRef.current.reload();
        }}
      >
        list1
      </button>
      <button
        onClick={() => {
          tableRef.current.config.data = list2;
          tableRef.current.reload();
        }}
      >
        list2
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
          console.log(
            tableRef.current.getBoundItems({
              left: 200,
              top: 200,
              width: 600,
              height: 600,
            })
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
