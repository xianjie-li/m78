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
        element: <Input placeholder="输入姓名" />,
      },
      {
        label: "简介",
        name: "describe",
        validator: string({ max: 20 }),
        element: <Input placeholder="简要介绍一下自己" textArea />,
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
