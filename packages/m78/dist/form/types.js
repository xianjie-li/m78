import React from "react";
/** 要剔除的form-vanilla配置 */ export var _omitConfigs = [
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
    "bubbleDescribe",
    "maxWidth",
    "size",
    "disabled",
    "className",
    "style",
    "customer",
    "requireMarker",
    "spacePadding", 
];
/** 作为 list 时, 应从 Filed 或 schema 剔除的配置 */ export var _lisIgnoreKeys = [
    "component",
    "componentProps",
    "adaptor"
];
