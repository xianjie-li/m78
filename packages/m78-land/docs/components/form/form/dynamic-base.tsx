import React from "react";
import { createForm, Input, Dialog } from "m78";
import { required, string } from "m78/form";

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
        label: "密码",
        name: "psw",
        validator: required(),
        component: <Input placeholder="输入密码" />,
      },
      {
        label: "再次输入",
        name: "psw2",
        // 声明对字段psw的依赖, 使对应字段发生变更时自身也会同步变更, 此配置主要用于提升性能, 避免不必要的渲染
        deps: ["psw"],
        // dynamic使我们可以根据当前表单的状态动态调整schema配置
        dynamic: (formIns) => ({
          // valid为true时, 字段才会显示并参与验证和提交
          valid: !!formIns.getValue("psw"),
          // 这里我们自定义了一个验证器, 要求psw2和psw的值必须相同
          validator: [
            required(),
            ({ value }) => {
              if (value !== formIns.getValue("psw")) {
                return "两次输入不一致";
              }
            },
          ],
        }),
        component: <Input placeholder="再次输入密码" />,
      },
    ],
  },
});

const DynamicBase = () => {
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

export default DynamicBase;
