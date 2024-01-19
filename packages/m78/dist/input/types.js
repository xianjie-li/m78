import React from "react";
export var InputType;
(function(InputType) {
    /** 普通文本框 */ InputType["text"] = "text";
    /** 数字输入框(含小数) */ InputType["number"] = "number";
    /** 整数输入框 */ InputType["integer"] = "integer";
    /** 正整数 */ InputType["positiveInteger"] = "positiveInteger";
    /** 密码输入框 */ InputType["password"] = "password";
    /** 只能输入常规字符`A-Za-z0-9_` */ InputType["general"] = "general";
})(InputType || (InputType = {}));
