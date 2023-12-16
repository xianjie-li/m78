import React from "react";
import {
  createForm,
  Input,
  InputType,
  Dialog,
  Button,
  ButtonColor,
  Row,
} from "m78";
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
        label: "基础信息",
        name: "base",
        schema: [
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
        schema: [
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

      <form.Field
        name="base"
        element={() => (
          <Row>
            <form.Field name={["base", "age"]} />
            <form.Field name={["base", "sex"]} style={{ marginLeft: 12 }} />
          </Row>
        )}
      />

      <form.Field
        name="address"
        element={() => (
          <Row>
            <form.Field name={["address", 0]} />
            <form.Field name={["address", 1]} style={{ marginLeft: 12 }} />
            <form.Field name={["address", 2]} style={{ marginLeft: 12 }} />
          </Row>
        )}
      />

      {/* 这里使用Field作为布局组件排版按钮, 使按钮能刚好与表单控件对齐 */}
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
