import { RCTableEditWidgetCreator } from "../types.js";
import { Input, InputProps } from "../../input/index.js";
import { Size } from "../../common/index.js";
import React from "react";

/** Input的table绑定 */
export const tableInput: RCTableEditWidgetCreator<InputProps> =
  (conf?: InputProps) => (arg) => {
    return (
      <Input
        {...conf}
        className="m78-table_input"
        size={Size.small}
        defaultValue={arg.value}
        border={false}
        autoFocus
        clear={false}
        onChange={arg.change}
        onSearch={() => {
          arg.submit();
        }}
      />
    );
  };
