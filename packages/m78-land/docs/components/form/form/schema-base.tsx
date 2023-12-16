import React from "react";
import { createForm, Input, Dialog, required, string } from "m78";

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

const SchemaBase = () => {
  return (
    <div className="ptb-32">
      <form.SchemaRender
        onSubmit={(values) => {
          Dialog.render({
            title: "表单数据",
            content: <pre>{JSON.stringify(values, null, 2)}</pre>,
          });
        }}
      />
    </div>
  );
};

export default SchemaBase;
