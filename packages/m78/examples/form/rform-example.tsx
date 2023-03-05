import React, { useMemo } from "react";
import {
  createForm,
  FormLayoutType,
  FormSchemaWithoutName,
} from "../../src/form/index.js";
import { Input } from "../../src/input/index.js";
import { Button } from "../../src/button/index.js";
import { required } from "@m78/verify/index.js";
import { Divider, Row } from "../../src/layout/index.js";
import { IconDeleteOutline } from "@m78/icons/icon-delete-outline.js";
import { IconArrowUpward } from "@m78/icons/icon-arrow-upward.js";
import { IconArrowDownward } from "@m78/icons/icon-arrow-downward.js";
import { Size } from "../../src/common/index.js";

const schemas: FormSchemaWithoutName = {
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
    },
    {
      name: "desc",
      label: "描述",
      validator: required(),
    },
    {
      name: "list",
      list: true,
      validator: required(),
      eachSchema: {
        validator: required(),
        schema: [
          {
            name: "title",
            validator: required(),
          },
          {
            name: "desc",
            validator: required(),
          },
        ],
      },
    },
  ],
};

const RformExample = () => {
  const Form = useMemo(() => {
    return createForm({
      defaultValue: {
        name: "m78",
        desc: "",
        abc: "1",
        list: [
          {
            title: "默认项",
            desc: "abcd",
          },
        ],
      },
      schemas,
      // size: Size.small,
      layoutType: FormLayoutType.horizontal,
      bubbleFeedback: true,
      components: {
        input: {
          component: <Input />,
        },
        abc: {
          component: <Input />,
        },
      },
    });
  }, []);

  const Form2 = useMemo(() => {
    return createForm({
      defaultValue: {
        name: "m78",
        desc: "",
        abc: "1",
      },
      schemas,
      layoutType: FormLayoutType.vertical,
    });
  }, []);

  const Form3 = useMemo(() => {
    return createForm({
      defaultValue: {
        name: "m78",
        desc: "",
        abc: "1",
      },
      schemas,
      layoutType: FormLayoutType.tile,
    });
  }, []);

  return (
    <div style={{ padding: 32 }}>
      <div>
        <Form.Field name="name" style={{ padding: 12 }} component="input" />
        <Form.Field name="topic" style={{ padding: 12 }} label="标签">
          <Input />
        </Form.Field>
        <Form.Field name="desc" style={{ padding: 12 }}>
          <Input textArea />
        </Form.Field>

        <Form.List name="list" style={{ padding: 12 }} label="物品">
          {(args) => {
            return (
              <div>
                {args.render(({ getName, index, length }) => {
                  const max = length - 1;
                  const min = 0;
                  const prev = index - 1 < min ? max - 1 : index - 1;
                  const next = index + 1 > max ? min : index + 1;

                  return (
                    <Row style={{ marginBottom: 16 }}>
                      <Form.Field
                        name={getName("title")}
                        layoutType={FormLayoutType.vertical}
                      >
                        <Input placeholder="名称" />
                      </Form.Field>
                      <Form.Field
                        style={{ marginLeft: 8 }}
                        name={getName("desc")}
                        layoutType={FormLayoutType.vertical}
                      >
                        <Input placeholder="描述" />
                      </Form.Field>

                      <Button
                        style={{ marginLeft: 8 }}
                        onClick={() => args.move(index, prev)}
                        icon
                        size={Size.small}
                      >
                        <IconArrowUpward />
                      </Button>
                      <Button
                        style={{ marginLeft: 8 }}
                        onClick={() => args.move(index, next)}
                        icon
                        size={Size.small}
                      >
                        <IconArrowDownward />
                      </Button>
                      <Button
                        style={{ marginLeft: 8 }}
                        onClick={() => args.remove(index)}
                        icon
                        size={Size.small}
                      >
                        <IconDeleteOutline />
                      </Button>
                    </Row>
                  );
                })}

                <Button onClick={() => args.add({ title: "", desc: "abc" })}>
                  新增项
                </Button>
              </div>
            );
          }}
        </Form.List>
      </div>

      <div className="mt-32">
        <Button onClick={Form.reset}>reset</Button>
        <Button
          onClick={async () => {
            try {
              await Form.submit();
              console.log(Form.getValues());
            } catch (e) {
              console.log(22, e);
            }
          }}
        >
          submit
        </Button>
      </div>

      <Divider />

      <div>
        <Form2.Field name="name">
          <Input />
        </Form2.Field>
        <Form2.Field name="topic" label="topic">
          <Input />
        </Form2.Field>
        <Form2.Field name="desc">
          <Input textArea />
        </Form2.Field>
        123123
      </div>

      <Divider />

      <div style={{ maxWidth: 500 }}>
        <Form3.Field name="name">
          <Input style={{ width: 160 }} />
        </Form3.Field>
        <Form3.Field name="topic" label="topic">
          <Input style={{ width: 160 }} />
        </Form3.Field>
        <Form3.Field name="desc">
          <Input textArea style={{ width: 220 }} />
        </Form3.Field>
      </div>
    </div>
  );
};

export default RformExample;
