import React, { useEffect } from "react";
import {
  createForm,
  FormLayoutType,
  Input,
  Dialog,
  Button,
  ButtonColor,
  Size,
} from "m78";
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
        label: "简介",
        name: "describe",
        validator: string({ max: 20 }),
        component: <Input placeholder="简要介绍一下自己" textArea />,
      },
    ],
  },
});

const SchemaLayout = () => {
  const [layout, setLayout] = React.useState<FormLayoutType>(
    FormLayoutType.horizontal
  );

  useEffect(() => {
    form.updateProps({
      layoutType: layout,
    });
  }, [layout]);

  return (
    <div className="ptb-32">
      <div className="mb-32 tc">
        {Object.keys(FormLayoutType).map((key) => (
          <Button
            key={key}
            size={Size.small}
            color={layout === key ? ButtonColor.primary : undefined}
            onClick={() => setLayout(key as FormLayoutType)}
          >
            {key}
          </Button>
        ))}
      </div>

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

export default SchemaLayout;
