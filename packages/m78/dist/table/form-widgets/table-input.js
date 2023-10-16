import { Size } from "../../common/index.js";
import clsx from "clsx";
/** Input的table绑定 */ export var tableInputAdaptor = function(arg) {
    return arg.binder(arg.element, {
        className: clsx("m78-table_input", arg.element.props.className),
        size: Size.small,
        defaultValue: arg.value,
        border: false,
        autoFocus: true,
        clear: false,
        onChange: arg.change,
        onSearch: function() {
            arg.submit();
        }
    });
};
