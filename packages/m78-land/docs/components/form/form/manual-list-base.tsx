import React from "react";
import { createForm, Input, Dialog, Button, ButtonColor } from "m78";
import { required, string } from "m78/form";

const form = createForm({
  schemas: {
    schema: [
      {
        label: "姓名",
        name: "name",
        validator: [required(), string({ min: 2, max: 5 })],
        element: <Input placeholder="请输入姓名" />,
      },
      {
        label: "简介",
        name: "describe",
        validator: string({ max: 20 }),
        element: <Input placeholder="简要介绍一下自己" textArea />,
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
              element: <Input placeholder="名称" />,
              validator: required(),
            },
            {
              name: "remark",
              element: <Input placeholder="备注" />,
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

      {/* 这里使用Field作为布局组件排版按钮 */}
      <form.Field
        label=" "
        element={() => (
          <>
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
          </>
        )}
      />
    </div>
  );
};

export default ManualBase;
