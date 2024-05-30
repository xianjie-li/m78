import React, { useEffect, useState } from "react";
import { Table } from "../../src/table/index.js";
import { useUpdate } from "@m78/hooks";
import {
  Button,
  FormInstance,
  FormSchema,
  Input,
  required,
  Size,
  Spacer,
  string,
  TableInstance,
} from "../../src/index.js";
import { RCTableInstance } from "../../src/table/types.js";

import { delay, getStorage, setStorage } from "@m78/utils";

const columns = Array.from({ length: 40 }).map((_, j) => {
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
    // c.width = 80;
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
    c.filterRender = (form: FormInstance) => {
      return (
        <div>
          <Spacer height={10}>
            <form.Field
              label="查询1"
              name={`field${j}-1-r`}
              element={() => (
                <div
                  onChange={(e) => {
                    console.log(e);
                  }}
                >
                  <input type="radio" name="11" />
                  升序
                  <input type="radio" name="11" className="ml-12" />
                  降序
                </div>
              )}
            />

            <form.Field
              label="查询1"
              name={[`field${j}-1`]}
              element={<Input />}
            />

            <form.Field
              label="查询2"
              name={[`field${j}-2`]}
              element={<Input />}
            />
          </Spacer>
        </div>
      );
    };
  }

  return c;
});

const createRow = (key: any) => {
  const obj: any = {
    id: `id${key}`,
  };

  Array.from({ length: 40 }).forEach((_, j) => {
    if (j === 4 || j === 3) {
      obj[`field${j}`] = `${key}-${j} abcdefghi`;
    } else {
      obj[`field${j}`] = `${key}-${j}`;
    }

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

const data1 = Array.from({ length: 10000 }).map((_, i) => {
  return createRow(i);
});

const data2 = Array.from({ length: 6 }).map((_, i) => {
  return createRow(i);
});

const schema: FormSchema[] = [
  {
    name: "field3",
    validator: [required(), string({ min: 2, max: 5 })],
    element: <Input />,
  },
  {
    name: "field4",
    validator: [required(), string({ min: 2, max: 5 })],
    element: <Input />,
  },
  {
    name: "field5",
    dynamic: ({ form }) => {
      return {
        valid: form.getValue("field4") === "123",
      };
    },
    element: <Input />,
  },
  {
    name: "field6",
    validator: [required(), string({ min: 2, max: 5 })],
    element: <Input />,
  },
  {
    name: "field7",
    validator: [required(), string({ min: 2, max: 5 })],
    element: <Input />,
  },
  {
    name: "field8",
    validator: [string({ min: 2, max: 5 })],
    element: <Input />,
  },
  {
    name: "field9",
    validator: [string({ min: 2, max: 5 })],
    element: <Input />,
  },
  {
    name: "field10",
    validator: [string({ min: 2, max: 5 })],
    element: <Input />,
  },
];

const rowConfig = {
  id4: {
    fixed: "top",
  },
  id22: {
    fixed: "bottom",
  },
  id28: {
    fixed: "bottom",
  },
} as const;

const filterSchema = [
  {
    name: "field11-1",
    validator: required(),
  },
];

async function configPersister(key: string, table: TableInstance) {
  const curConf = table.getPersistenceConfig();

  await delay(2000);

  console.log(222);

  throw Error("error");
}

async function configReader(key: string): Promise<any> {
  await delay(2000);

  if (Math.random() > 0.3) {
    throw Error("qqq");
  }

  return {
    columns: {
      field3: {
        width: 150,
      },
      field4: {
        width: 200,
      },
    },
  };
}

const TableFullExample = () => {
  const [data, setData] = useState(data1);
  const [autoSize, setAutoSize] = useState(false);

  const [count, setCount] = useState(8);

  const update = useUpdate();

  const [table, setTable] = useState<RCTableInstance | null>(null);

  useEffect(() => {
    if (!table) return;

    // table.event.feedback.on((e) => {
    //   e.forEach((ev) => {
    //     console.log(ev.cell?.key, ev.type, ev.text);
    //   });
    // });
  }, [table]);

  return (
    <div>
      <button onClick={() => setCount((p) => p + 1)}>click {count}</button>
      <Table
        configCacheKey="local-test"
        data={data}
        primaryKey="id"
        columns={columns}
        style={{
          height: 600,
        }}
        schemas={schema}
        rows={rowConfig}
        render={({ cell }) => {
          if (cell.column.key === "field22" && !cell.row.isFake) {
            return (
              <>
                <Button size={Size.small}>详情</Button>
              </>
            );
          }
        }}
        instanceRef={setTable}
        defaultFilter={{
          "field11-1": "12312",
        }}
        onMutation={(e) => {
          console.log("mutation", e);
        }}
        filterSchema={filterSchema}
        defaultNewData={{
          field3: "123",
          field4: "345",
          field5: "567",
        }}
        onFilter={(filterData) => {
          console.log(filterData);
        }}
        commonFilter={(form) => {
          return (
            <Spacer height={12} style={{ width: 400 }}>
              <form.Field label="查询1" name="filter1" element={<Input />} />
              <form.Field label="查询2" name="filter2" element={<Input />} />
              <form.Field label="查询3" name="filter3" element={<Input />} />
            </Spacer>
          );
        }}
        dataOperations={{
          add: true,
          delete: true,
          edit: true,
          sortRow: true,
          sortColumn: true,
        }}
      ></Table>

      <div className="mt-32">
        <button onClick={update}>render</button>
        <button onClick={() => setAutoSize((p) => !p)}>
          autoSize {autoSize.toString()}
        </button>
        <button onClick={() => setData(data1)}>data1</button>
        <button onClick={() => setData(data2)}>data2</button>
        <button onClick={() => setData([])}>data3</button>
      </div>

      {table && (
        <div className="mt-12">
          <button
            onClick={() => {
              console.time("getData");
              console.log(
                table.getData().then((r) => {
                  console.log(r);
                  console.timeEnd("getData");
                })
              );
            }}
          >
            getData
          </button>

          <button
            onClick={() => {
              console.log(table?.getTableChanged());
            }}
          >
            getTableChanged
          </button>
          <button
            onClick={() => {
              console.log(table?.getChanged("id7"));
            }}
          >
            getChanged row 7
          </button>
          <button
            onClick={() => {
              console.log(table?.getChanged("id7", "field6"));
            }}
          >
            getChanged cell id7 field6
          </button>
          <button
            onClick={() => {
              table
                ?.verify()
                .then((res) => {
                  console.log("success:", res);
                })
                .catch((err) => {
                  console.log("fail:", err.rejects);
                });
            }}
          >
            verify
          </button>

          <button
            onClick={() => {
              table
                ?.verifyRow("id2")
                .then((res) => {
                  console.log("success:", res);
                })
                .catch((err) => {
                  console.log("fail:", err.rejects);
                });
            }}
          >
            verify id2
          </button>

          <button
            onClick={() => {
              table
                ?.verifyUpdated()
                .then((res) => {
                  console.log("success:", res);
                })
                .catch((err) => {
                  console.log("fail:", err.rejects);
                });
            }}
          >
            verify changed
          </button>
        </div>
      )}

      <div className="mt-12">
        <button
          onClick={() => {
            // @ts-ignore
            console.log(table.__ctx);
          }}
        >
          log ctx
        </button>
      </div>

      <div className="mt-12">
        soft remove:
        <button
          onClick={() => {
            table?.softRemove(["id4", "id7", "id8"]);
          }}
        >
          remove id4/7/8
        </button>
        <button
          onClick={() => {
            table?.restoreSoftRemove(["id4", "id8"]);
          }}
        >
          restoreSoftRemove id4/8
        </button>
        <button
          onClick={() => {
            console.log(table?.isSoftRemove("id4"));
          }}
        >
          isSoftRemove id4
        </button>
        <button
          onClick={() => {
            table?.confirmSoftRemove();
          }}
        >
          confirmSoftRemove
        </button>
      </div>

      <div className="mt-12">
        <button
          onClick={() => {
            table?.setXY(100, 100);
          }}
        >
          setXY
        </button>
        <button
          onClick={() => {
            console.log(table?.getChangeStatus());
          }}
        >
          getChangeStatus
        </button>
        <button
          onClick={() => {
            table?.resetStatus();
          }}
        >
          resetStatus
        </button>
        <button
          onClick={() => {
            table?.setRowValue("id5", {
              field7: "123213",
              field4: "5-4 abcdefghi",
              field0: "7-0",
            });
          }}
        >
          setRowValue
        </button>
      </div>
    </div>
  );
};

export default TableFullExample;
