import React, { useState } from "react";
import { Table } from "../../src/table/index.js";
import { useUpdate } from "@m78/hooks";
import {
  Button,
  Input,
  number,
  required,
  Size,
  string,
  TableColumnLeafConfig,
} from "../../src/index.js";
import { RCTableEditWidgetImpl } from "../../src/table/types.js";
import { tableInput } from "../../src/table/form-widgets/table-input.js";
import { TableFormSchema } from "../../src/table-vanilla/plugins/form.js";

const columns: TableColumnLeafConfig[] = Array.from({ length: 40 }).map(
  (_, j) => {
    const c: any = {
      key: `field${j}`,
      label: `field${j}`,
    };

    if (j === 7) {
      c.fixed = "left";
    }

    if (j > 20 && j < 23) {
      c.fixed = "right";
    }

    if (j === 22) {
      c.width = 80;
    }

    if (j === 21) {
      c.render = () => {
        return <span>⭐️⭐️⭐️</span>;
      };
    }

    if (j > 2 && j < 7) {
      c.sort = true;
    }

    if (j > 9 && j < 13) {
      c.filterRender = () => null;
    }

    if (j > 2 && j < 12) {
      c.editRender = tableInput();
    }

    return c;
  }
);

const createRow = (key: any) => {
  const obj: any = {
    id: `id${key}`,
  };

  Array.from({ length: 40 }).forEach((_, j) => {
    obj[`field${j}`] = `${key}-${j}`;

    // if (j === 1) {
    //   obj[`field${j}`] = ["abc", `${key}-${j}`];
    // }
    //
    // if (j === 2) {
    //   obj[`field${j}`] = {
    //     value: `${key}-${j}`,
    //     other: 123,
    //   };
    // }
  });

  return obj;
};

const data1 = Array.from({ length: 2000 }).map((_, i) => {
  return createRow(i);
});

const data2 = Array.from({ length: 6 }).map((_, i) => {
  return createRow(i);
});

const schema: TableFormSchema[] = [
  {
    name: "field3",
    validator: [required(), string({ min: 2, max: 5 })],
  },
  {
    name: "field4",
    validator: [required(), string({ min: 2, max: 5 })],
  },
];

const rowConfig = {
  id4: {
    fixed: "top",
  },
} as const;

const TableFullExample = () => {
  const [data, setData] = useState(data1);
  const [autoSize, setAutoSize] = useState(false);

  const update = useUpdate();

  return (
    <div>
      <Table
        data={data}
        primaryKey="id"
        columns={columns}
        style={{
          height: 600,
        }}
        schema={schema}
        rows={rowConfig}
        render={({ cell }) => {
          if (cell.column.key === "field22" && !cell.row.isHeader) {
            return (
              <>
                <Button size={Size.small}>详情</Button>
              </>
            );
          }
        }}
      />

      <div className="mt-32">
        <button onClick={update}>render</button>
        <button onClick={() => setAutoSize((p) => !p)}>
          autoSize {autoSize.toString()}
        </button>
        <button onClick={() => setData(data1)}>data1</button>
        <button onClick={() => setData(data2)}>data2</button>
        <button onClick={() => setData([])}>data3</button>
      </div>
    </div>
  );
};

export default TableFullExample;
