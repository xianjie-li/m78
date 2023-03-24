import { createForm } from "./index.js";
import { required } from "@m78/verify";
import { Input } from "../input/index.js";
import React from "react";
import { render } from "@testing-library/react";

describe("form", () => {
  test("schema", async () => {
    const form = createForm({
      defaultValue: {
        name: "m78",
        desc: "",
      },
      schemas: {
        schema: [
          {
            name: "name",
            validator: required(),
            label: "姓名",
            dynamic: (form) => ({
              hidden: form.getValue("desc") === "abc",
            }),
            deps: ["desc"],
            describe:
              "填入你的姓名, 填入你的姓名填入你的姓名填入你的姓名填入你的姓名填入你的姓名, 填入你的姓名.",
            component: <Input />,
          },
          {
            name: "desc",
            label: "描述",
            validator: required(),
            component: <Input textArea />,
          },
          {
            name: "obj",
            label: "对象",
            validator: required(),
            schema: [
              {
                name: "title",
                validator: required(),
                component: <Input placeholder="名称" />,
              },
              {
                name: "desc",
                validator: required(),
                component: <Input placeholder="描述" />,
              },
            ],
          },
          {
            name: "list",
            label: "列表",
            list: true,
            dynamic: (form) => ({
              valid: form.getValue("name") !== "123",
            }),
            deps: ["name"],
            validator: required(),
            eachSchema: {
              schema: [
                {
                  name: "title",
                  validator: required(),
                  component: <Input placeholder="名称" />,
                },
                {
                  name: "desc",
                  validator: required(),
                  component: <Input placeholder="描述" />,
                },
              ],
            },
          },
          {
            name: "list2",
            label: "列表3",
            list: true,
            listDefaultValue: "11",
            dynamic: (form) => ({
              valid: form.getValue("name") !== "123",
            }),
            deps: ["name"],
            validator: required(),
            eachSchema: {
              validator: required(),
              component: <Input />,
            },
          },
        ],
      },
    });

    const r = render(<form.SchemaRender />);

    expect(r.container).toMatchSnapshot();
  });
});
