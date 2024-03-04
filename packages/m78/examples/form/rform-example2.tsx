import React, { useMemo } from "react";
import {
  createForm,
  FormLayoutType,
  FormSchemaWithoutName,
} from "../../src/form/index.js";
import { Input } from "../../src/input/index.js";
import { Button } from "../../src/button/index.js";
import { required } from "@m78/form/validator/index.js";
import { Divider, Row } from "../../src/layout/index.js";
import { IconLike } from "@m78/icons/like";
import { Size } from "../../src/index.js";

const IconDeleteOutline = IconLike;
const IconArrowUpward = IconLike;
const IconArrowDownward = IconLike;

const singleSchemas: FormSchemaWithoutName = {
  validator: required(),
  element: <Input />,
};

const RformExample = () => {
  const Form5 = useMemo(() => {
    return createForm({
      values: "1233",
      schemas: singleSchemas,
    });
  }, []);

  return (
    <div style={{ padding: 32 }}>
      <div>
        <Form5.Field name="[]" spacePadding={false} />
        <Button
          onClick={() => {
            Form5.verify().then((r) => {
              console.log(r);
            });
          }}
        >
          submit
        </Button>
        <Button onClick={() => Form5.setValue([], "")}>set ''</Button>
        <Button onClick={() => Form5.setValue([], "123123")}>
          set '123123'
        </Button>
        <Button onClick={() => Form5.setValues("2222")}>set '2222'</Button>
      </div>
    </div>
  );
};

export default RformExample;
