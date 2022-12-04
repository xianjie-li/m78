import React from "react";
export var InputType;
(function(InputType) {
    InputType[/** 普通文本框 */ "text"] = "text";
    InputType[/** 数字输入框(含小数) */ "number"] = "number";
    InputType[/** 整数输入框 */ "integer"] = "integer";
    InputType[/** 正整数 */ "positiveInteger"] = "positiveInteger";
    InputType[/** 密码输入框 */ "password"] = "password";
    InputType[/** 只能输入常规字符`A-Za-z0-9_` */ "general"] = "general";
})(InputType || (InputType = {}));
