import React from "react";
/** 要剔除的原Config属性 */ export var _omitConfigs = [
    "eventCreator",
    "languagePack",
    "extendLanguagePack",
    "verifyFirst",
    "ignoreStrangeValue", 
];
export var FormLayoutType;
(function(FormLayoutType) {
    FormLayoutType["horizontal"] = "horizontal";
    FormLayoutType["vertical"] = "vertical";
})(FormLayoutType || (FormLayoutType = {}));
/** FormProps中的所有key, 用于在分别根据Field/schema/config获取配置时检测是否可安全获取 */ export var _formPropsKeys = [
    "layoutType",
    "fieldCustomer",
    "bubbleFeedback",
    "maxWidth",
    "size",
    "disabled",
    "className",
    "style",
    "spacePad",
    "wrapCustomer",
    "requireMarker",
    "modifyMarker", 
];
/** FormKeyCustomer的所有 key */ export var _formKeyCustomerKeys = [
    "valueKey",
    "changeKey",
    "disabledKey",
    "sizeKey",
    "valueGetter",
    "ignoreBindKeys", 
];
/** 作为 list 时, 应从 Filed 或 schema 等剔除的配置 */ export var _lisIgnoreKeys = [
    "component",
    "componentProps",
    "fieldCustomer",
    "valueKey",
    "changeKey",
    "disabledKey",
    "sizeKey",
    "valueGetter",
    "ignoreBindKeys", 
];
