import React from "react";
import { createForm, required, string } from "m78/form";
import { Input, InputType } from "m78/input";
import { Dialog } from "m78/dialog";
import { Button, ButtonColor } from "m78/button";
import { Row } from "m78/layout";

const form = createForm({
  schemas: {
    schema: [
      {
        label: "姓名",
        name: "name",
        validator: [required(), string({ min: 2, max: 5 })],
        component: <Input placeholder="请输入姓名" />,
      },
      {
        label: "简介",
        name: "describe",
        validator: string({ max: 20 }),
        component: <Input placeholder="简要介绍一下自己" textArea />,
      },
      {
        label: "基础信息",
        name: "base",
        schema: [
          {
            name: "age",
            component: (
              <Input placeholder="填写年龄" type={InputType.integer} />
            ),
          },
          {
            name: "sex",
            component: <Input placeholder="输入性别" />,
          },
        ],
      },
    ],
  },
});

const ManualBase = () => {
  form.events.submit.useEvent(() => {
    Dialog.render({
      title: "表单数据",
      content: <pre>{JSON.stringify(form.getValues(), null, 2)}</pre>,
    });
  });

  return (
    <div className="ptb-32">
      <form.Field name="name" />
      <form.Field name="describe" />

      <form.Field name="base">
        {() => (
          <Row>
            <form.Field name={["base", "age"]} />
            <form.Field name={["base", "sex"]} style={{ marginLeft: 12 }} />
          </Row>
        )}
      </form.Field>

      <div style={{ paddingLeft: "5em", marginLeft: 8 }}>
        <Button onClick={form.reset}>重置</Button>
        <Button
          color={ButtonColor.primary}
          onClick={() => {
            form.submit().catch((err) => {
              console.log(err?.rejects);
            });
          }}
        >
          提交
        </Button>
      </div>
    </div>
  );
};

export default ManualBase;
