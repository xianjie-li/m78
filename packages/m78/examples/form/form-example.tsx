import { array, createVerify, required } from "@m78/verify/index.js";
import React from "react";
import { createForm } from "../../src/form/form.js";

const verify = createVerify({});

const form = createForm({
  defaultValue: {
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
  schema: {
    validator: [required()],
    schema: [
      {
        name: "name",
        validator: [required()],
        valid: false,
      },
      {
        name: "sex",
        dynamic: (form) => ({
          validator: form.getValue("name") === "lxj" ? undefined : required(),
        }),
      },
      {
        name: "list",
        validator: [array(), required()],
        valid: false,
        eachSchema: {
          validator: [required()],
          schema: [
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
        schema: [
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
      },
      {
        name: "list4",
        list: true,
        eachSchema: {
          schema: [
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
  return (
    <div>
      <div>111</div>

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
          form.setFormTouched(true);
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
          console.log(form.getValue(["list", 1]));
        }}
      >
        getValue
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
    </div>
  );
};

export default FormExample;
