import React from "react";
import { _Context, FormFieldProps } from "./types.js";

export function _implList(ctx: _Context) {
  const { form } = ctx;

  form.List = (props) => {
    return (
      <form.Field
        {...(props as any as FormFieldProps)}
        // @ts-ignore
        __isList
      />
    );
  };

  (form.List as React.FunctionComponent).displayName = "FieldList";
}
