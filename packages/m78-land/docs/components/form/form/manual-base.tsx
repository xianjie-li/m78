import React from "react";
import { createForm, Input, Dialog, Button, ButtonColor } from "m78";
import { required, string } from "m78/form/validator.js";

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
