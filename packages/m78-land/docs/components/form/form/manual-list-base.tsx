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
        label: "物品信息",
        name: "things",
        // 设置该项为list项
        list: true,
        // 每一个子项应遵循的的schema
        eachSchema: {
          // 由于这里是多个子字段, 所以传入了schema数组, 如果是单个字段可以直接在eachSchema中配置字段
          schema: [
            {
              name: "title",
              component: <Input placeholder="名称" />,
              validator: required(),
            },
            {
              name: "remark",
              component: <Input placeholder="备注" />,
            },
          ],
        },
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

      <form.List
        name="things"
        layoutRender={(meta) => (
          <>
            <form.Field name={meta.getName("title")} />
            <form.Field
              name={meta.getName("remark")}
              style={{ marginLeft: 12 }}
            />
          </>
        )}
      />

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
