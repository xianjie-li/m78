import { createForm } from "./index.js";
import { required } from "@m78/form/validator/index.js";
import { Input } from "../input/index.js";
import React from "react";
import { render, waitFor } from "@testing-library/react";

describe("form", () => {
  test("render", async () => {
    const form = createForm({
      values: {
        name: "m78",
        desc: "",
      },
      schemas: {
        schemas: [
          {
            name: "name",
            validator: required(),
            label: "姓名",
            dynamic: ({ form }) => ({
              hidden: form.getValue("desc") === "abc",
            }),
            deps: ["desc"],
            describe:
              "填入你的姓名, 填入你的姓名填入你的姓名填入你的姓名填入你的姓名填入你的姓名, 填入你的姓名.",
            element: <Input />,
          },
          {
            name: "desc",
            label: "描述",
            validator: required(),
            element: <Input textArea />,
          },
          {
            name: "obj",
            label: "对象",
            validator: required(),
            schemas: [
              {
                name: "title",
                validator: required(),
                element: <Input placeholder="名称" />,
              },
              {
                name: "desc",
                validator: required(),
                element: <Input placeholder="描述" />,
              },
            ],
          },
          {
            name: "list",
            label: "列表",
            list: true,
            dynamic: ({ form }) => ({
              valid: form.getValue("name") !== "123",
            }),
            deps: ["name"],
            validator: required(),
            eachSchema: {
              schemas: [
                {
                  name: "title",
                  validator: required(),
                  element: <Input placeholder="名称" />,
                },
                {
                  name: "desc",
                  validator: required(),
                  element: <Input placeholder="描述" />,
                },
              ],
            },
          },
          {
            name: "list2",
            label: "列表3",
            list: true,
            listDefaultValue: "11",
            dynamic: ({ form }) => ({
              valid: form.getValue("name") !== "123",
            }),
            deps: ["name"],
            validator: required(),
            eachSchema: {
              validator: required(),
              element: <Input />,
            },
          },
        ],
      },
    });

    const r = render(<form.SchemaRender />);

    expect(r.container).toMatchSnapshot();

    await waitFor(() => {
      return form.verify();
    });

    const r2 = render(<form.SchemaRender />);

    expect(r2.container).toMatchSnapshot();
  });
});
