import React from "react";
import {
  createForm,
  Input,
  Dialog,
  Button,
  ButtonColor,
  required,
  string,
} from "m78";

const form = createForm({
  values: "m78",
  schemas: {
    validator: [required(), string({ min: 5, max: 30 })],
    element: <Input placeholder="输入姓名" />,
  },
});

const ManualBase = () => {
  form.events.submit.useEvent((values) => {
    Dialog.render({
      title: "表单数据",
      content: <pre>{values}</pre>,
    });
  });

  return (
    <div className="ptb-32">
      <form.Field name={[]} spacePadding={false} />

      <Button
        className="mt-24"
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
  );
};

export default ManualBase;
