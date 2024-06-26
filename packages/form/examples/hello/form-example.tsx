import React, { useEffect, useState } from "react";
import { array, number, required } from "../../src/validator/index.js";
import { createForm, createVerify, NamePath } from "../../src/index.js";
import {
  deleteNamePathValue,
  ensureArray,
  getNamePathValue,
  isArray,
  isNumber,
  NameItem,
  setNamePathValue,
  stringifyNamePath,
  deleteNamePathValues,
} from "@m78/utils";

const form = createForm({
  values: {
    name: "lxj",
    age: 18,
    list: [
      {
        title: "物品1",
        desc: "abc",
      },
      {
        title: "123123",
      },
      null,
    ],
    list2: [0, 1, 2],
    list3: [0, 1, 2],
    list4: [
      {
        title: "物品1",
      },
      {
        title: "物品2",
      },
    ],
  } as any,
  schemas: {
    validator: [required()],
    schemas: [
      {
        name: "name",
        validator: [required()],
        // valid: false,
      },
      {
        name: "sex",
        dynamic: ({ form }) => ({
          validator: form.getValue("name") === "lxj" ? undefined : required(),
        }),
      },
      {
        name: "list",
        validator: [array(), required()],
        valid: false,
        eachSchema: {
          validator: [required()],
          schemas: [
            {
              name: "title",
            },
            {
              name: "desc",
              validator: [required()],
            },
            {
              name: "desc2",
              list: true,
            },
          ],
        },
      },
      {
        name: "list2",
        validator: [required(), array()],
        schemas: [
          {
            name: 0,
          },
          {
            name: 1,
            valid: false,
          },
          {
            name: 2,
          },
        ],
      },
      {
        name: "list3",
        list: true,
        // valid: false,
      },
      {
        name: "list4",
        list: true,
        eachSchema: {
          validator: [],
          schemas: [
            {
              name: "title",
              validator: [required()],
              dynamic: ({ namePath }) => {
                const ind = namePath[1];

                return {
                  valid: ind === 1,
                };
              },
            },
          ],
        },
      },
    ],
  },
});

const verify = createVerify({
  schemas: {
    validator: [required()],
    schemas: [
      {
        name: "name",
        validator: [required()],
        // valid: false,
      },
      {
        name: "sex",
        dynamic: ({ form }) => {
          console.log(form.getValue("name"));
          return {
            validator: form.getValue("name") === "lxj" ? undefined : required(),
          };
        },
      },
      {
        name: "list",
        validator: [array(), required()],
        // valid: false,
        eachSchema: {
          validator: [required()],
          schemas: [
            {
              name: "title",
            },
            {
              name: "desc",
              validator: [required()],
            },
            {
              name: "desc2",
              list: true,
            },
          ],
        },
      },
      {
        name: "list2",
        validator: [required(), array()],
        schemas: [
          {
            name: 0,
          },
          {
            name: 1,
            valid: false,
          },
          {
            name: 2,
          },
        ],
      },
      {
        name: "list3",
        list: true,
        eachSchema: {
          validator: [required(), number()],
        },
      },
      {
        name: "list4",
        list: true,
        eachSchema: {
          schemas: [
            {
              name: "title",
              validator: [required()],
            },
          ],
        },
      },
    ],
  },
});

form.events.submit.on(() => {
  console.log("submit");
});

form.events.reset.on(() => {
  console.log("reset");
});

form.events.fail.on((errors) => {
  console.log("fail", errors);
});

form.events.update.on(
  form.notifyFilter("name", (name, relation) => {
    console.log("update", name, relation);
  })
);

form.events.change.on(
  form.notifyFilter("name", (name, relation) => {
    console.log("change", name, relation);
  })
);

form.events.update.on(
  form.notifyFilter(["list"], (name, relation) => {
    console.log("update", name, relation);
  })
);

form.events.change.on(
  form.notifyFilter("list3", (name, relation) => {
    console.log("change list3", name, relation);
  })
);

form.events.update.on(
  form.notifyFilter("list3", (name, relation) => {
    console.log("update list3", name, relation);
  })
);

const FormExample = () => {
  const [str, setStr] = useState(() => {
    // return JSON.stringify({}, null, 4);
    return JSON.stringify(form.getValues(), null, 4);
  });

  useEffect(() => {
    form.events.change.on(() => {
      setStr(JSON.stringify(form.getValues(), null, 4));
    });
  }, []);

  return (
    <div>
      <div className="f-red f-red_b">111</div>
      <button
        onClick={() => {
          form
            .verify()
            .then(() => {
              console.log("res");
            })
            .catch((err) => {
              console.log("err", err);
            });
        }}
      >
        verify
      </button>
      <button
        onClick={() => {
          form
            .submit()
            .then(() => {
              console.log("res");
            })
            .catch((err) => {
              console.log("err", err);
            });
        }}
      >
        submit
      </button>
      <button
        onClick={() => {
          form.setValue("name", String(Math.random()));
        }}
      >
        setValue name
      </button>
      <button
        onClick={() => {
          form.setValue("age", Math.random());
        }}
      >
        setValue age
      </button>
      <button
        onClick={() => {
          form.setValue(["list", 1], {
            title: "物品333",
          });
        }}
      >
        setValue list
      </button>
      <button onClick={() => console.log(form.getChanged("name"))}>
        getChanged
      </button>
      <button onClick={() => console.log(form.getFormChanged())}>
        getFormChanged
      </button>

      <button
        onClick={() => {
          console.log(form.getTouched("name"));
        }}
      >
        getTouched
      </button>

      <button
        onClick={() => {
          form.setTouched("name", false);
        }}
      >
        setTouched
      </button>

      <button
        onClick={() => {
          console.log(form.getFormTouched());
        }}
      >
        getFormTouched
      </button>

      <button
        onClick={() => {
          form.setTouched([], true);
        }}
      >
        setFormTouched
      </button>

      <button
        onClick={() => {
          console.log(form.getValues());
        }}
      >
        getValues
      </button>

      <button
        onClick={() => {
          console.log(form.getValue([]));
        }}
      >
        getValue []
      </button>

      <button
        onClick={() => {
          console.log(form.getValue(["list4"]));
        }}
      >
        getValue list4
      </button>

      <button
        onClick={() => {
          console.log(form.getValue(["list4", 1]));
        }}
      >
        getValue list4[1]
      </button>

      <button
        onClick={() => {
          console.log(form.getValue(["list4", 1, "title"]));
        }}
      >
        getValue list4[1].title
      </button>

      <button
        onClick={() => {
          console.log(form.getDefaultValues());
        }}
      >
        getDefaultValues
      </button>

      <button
        onClick={() => {
          form.setDefaultValues({
            name: "lxj",
          });
        }}
      >
        setDefaultValues
      </button>

      <button
        onClick={() => {
          form.reset();
        }}
      >
        reset
      </button>
      <button
        onClick={() => {
          console.log(form.getSchemas());
        }}
      >
        getSchemas
      </button>
      <button
        onClick={() => {
          console.log(form.getSchema("list3"));
        }}
      >
        getSchema list 3
      </button>
      <button
        onClick={() => {
          console.log(form.getSchema("list4"));
        }}
      >
        getSchema list 4
      </button>
      <button
        onClick={() => {
          console.log(form.getSchema(["list4", 1]));
        }}
      >
        getSchema list 4[1]
      </button>
      <button
        onClick={() => {
          console.log(form.getSchema(["list4", 1, "title"]));
        }}
      >
        getSchema list4[1].title
      </button>
      <button
        onClick={() => {
          form.setSchemas({});
        }}
      >
        setSchemas
      </button>
      <button
        onClick={() => {
          console.log(form.getErrors("sex"));
        }}
      >
        getErrors
      </button>
      <button
        onClick={() => {
          console.log(form.getList("list2"));
        }}
      >
        getList list2
      </button>
      <button
        onClick={() => {
          console.log(form.getList("list3"));
        }}
      >
        getList list3
      </button>
      <button
        onClick={() => {
          console.log(form.getList("list4"));
        }}
      >
        getList list4
      </button>

      <button
        onClick={() => {
          form.listAdd("list3", [3, 4, 5]);
        }}
      >
        add item to list3
      </button>
      <button
        onClick={() => {
          form.listAdd("list3", [7, 8], 0);
        }}
      >
        add item to list3 before
      </button>
      <button
        onClick={() => {
          form.listRemove("list3", 2);
        }}
      >
        remove item 2 from list3
      </button>
      <button
        onClick={() => {
          form.listMove("list3", 0, 2);
        }}
      >
        move 0 - 2
      </button>
      <button
        onClick={() => {
          form.listSwap("list3", 0, 2);
        }}
      >
        swap 0 - 2
      </button>
      <button
        onClick={() => {
          form.setValue("list3", [7, 8, 9]);
        }}
      >
        setValue list3
      </button>

      <pre>{str}</pre>

      <button onClick={() => console.log(verify.getConfig())}>getConfig</button>
      <button
        onClick={() =>
          verify
            .check({
              name: "lxj",
              age: 18,
              list: [
                {
                  title: "物品1",
                  desc: "abc",
                },
                {
                  title: "123123",
                },
                null,
              ],
              list2: [0, 1, 2],
              list3: [0, 1, 2],
              list4: [
                {
                  title: "物品1",
                },
                {
                  title: "物品2",
                },
              ],
            })
            .then((res) => {
              console.log(res);
            })
        }
      >
        check
      </button>
      <button
        onClick={() =>
          verify
            .check({
              name: "lxj",
              list: [
                {
                  title: "物品1",
                  desc: "abc",
                },
                {
                  title: "123123",
                  desc: "abc",
                },
                // null,
              ],
              list2: [0, 1, 2],
              list3: [0, 1, 2, "12", [2]],
              list4: [
                {
                  title: "物品1",
                },
                {
                  title: "物品2",
                },
                {},
              ],
            })
            .then((res) => {
              console.log(res);
            })
        }
      >
        check
      </button>

      <button
        onClick={() => {
          console.time("create");

          for (let i = 0; i < 100000; i++) {
            createForm({
              values: {
                name: "lxj",
                age: 18,
                list: [
                  {
                    title: "物品1",
                    desc: "abc",
                  },
                  {
                    title: "123123",
                  },
                  null,
                ],
                list2: [0, 1, 2],
                list3: [0, 1, 2],
                list4: [
                  {
                    title: "物品1",
                  },
                  {
                    title: "物品2",
                  },
                ],
              } as any,
              schemas: {
                validator: [required()],
                schemas: [
                  {
                    name: "name",
                    validator: [required()],
                    // valid: false,
                  },
                  {
                    name: "sex",
                    dynamic: ({ form }) => ({
                      validator:
                        form.getValue("name") === "lxj"
                          ? undefined
                          : required(),
                    }),
                  },
                  {
                    name: "list",
                    validator: [array(), required()],
                    valid: false,
                    eachSchema: {
                      validator: [required()],
                      schemas: [
                        {
                          name: "title",
                        },
                        {
                          name: "desc",
                          validator: [required()],
                        },
                        {
                          name: "desc2",
                          list: true,
                        },
                      ],
                    },
                  },
                  {
                    name: "list2",
                    validator: [required(), array()],
                    schemas: [
                      {
                        name: 0,
                      },
                      {
                        name: 1,
                        valid: false,
                      },
                      {
                        name: 2,
                      },
                    ],
                  },
                  {
                    name: "list3",
                    list: true,
                    // valid: false,
                  },
                  {
                    name: "list4",
                    list: true,
                    eachSchema: {
                      validator: [],
                      schemas: [
                        {
                          name: "title",
                          validator: [required()],
                          dynamic: ({ namePath }) => {
                            const ind = namePath[1];

                            return {
                              valid: ind === 1,
                            };
                          },
                        },
                      ],
                    },
                  },
                ],
              },
            });
          }

          console.timeEnd("create");
        }}
      >
        create 10000
      </button>
    </div>
  );
};

export default FormExample;
