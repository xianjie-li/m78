import React from "react";
import {
  FormAdaptorsItem,
  m78Config,
  RCTableEditAdaptor,
} from "../config/index.js";
import { _Input } from "./input.js";
import { InputProps } from "./types.js";
import clsx from "clsx";

/** Input的table绑定 */
export const tableInputAdaptor: RCTableEditAdaptor = (arg) => {
  return arg.binder<InputProps>(arg.element, {
    className: clsx("m78-table_input", arg.element.props.className),
    defaultValue: arg.value,
    border: false,
    autoFocus: true,
    clear: false,
    textArea: true,
    charCount: false,
    autoSize: false,
    onChange: arg.change,
    onSearch: () => {
      arg.submit();
    },
    style: {
      ...arg.element.props?.style,
      borderRadius: 0,
    },
  });
};

const adaptor: FormAdaptorsItem = {
  element: <_Input />,
  tableAdaptor: tableInputAdaptor,
  name: "Input",
};

const adaptors = m78Config.get().formAdaptors;

m78Config.set({
  formAdaptors: [...adaptors, adaptor],
});
