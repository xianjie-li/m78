import { InputProps } from "../../input/index.js";
import { Size } from "../../common/index.js";
import { RCTableEditAdaptor } from "../types.js";
import clsx from "clsx";

/** Input的table绑定 */
export const tableInputAdaptor: RCTableEditAdaptor = (arg) => {
  return arg.binder<InputProps>(arg.element, {
    className: clsx("m78-table_input", arg.element.props.className),
    size: Size.small,
    defaultValue: arg.value,
    border: false,
    autoFocus: true,
    clear: false,
    onChange: arg.change,
    onSearch: () => {
      arg.submit();
    },
  });
};
