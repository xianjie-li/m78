import React from "react";
import { createForm, Input, InputType, Dialog } from "m78";
import { required, string } from "m78/form";

const form = createForm({
  schemas: [
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
      label: "基础信息",
      name: "base",
      schemas: [
        {
          name: "age",
          element: <Input placeholder="填写年龄" type={InputType.integer} />,
        },
        {
          name: "sex",
          element: <Input placeholder="输入性别" />,
        },
      ],
    },
    {
      label: "地址",
      name: "address",
      schemas: [
        {
          name: 0,
          element: <Input placeholder="省" />,
        },
        {
          name: 1,
          element: <Input placeholder="市" />,
        },
        {
          name: 2,
          element: <Input placeholder="区" />,
        },
      ],
    },
  ],
});

const SchemaNestBase = () => {
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

export default SchemaNestBase;
