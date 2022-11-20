import _define_property from "@swc/helpers/src/_define_property.mjs";
import { FullSize } from "../types";
/** 与style库同步，用于js代码的常用屏幕尺寸 */ export var SM = 576;
export var MD = 768;
export var LG = 992;
export var XL = 1200;
/** 与style库同步，用于js代码的z-index预设值 */ export var Z_INDEX = 1000; // 基准显示层级, 所有弹层层级应不低于/等于1000, 因为1000是m78约定的内容和弹层中间的层级, 用于放置mask等
export var Z_INDEX_DRAWER = 1400;
export var Z_INDEX_MODAL = 1800;
export var Z_INDEX_MESSAGE = 2200;
var _obj;
/** size */ export var SIZE_MAP = (_obj = {
    default: 32
}, _define_property(_obj, FullSize.small, 24), _define_property(_obj, FullSize.large, 40), _define_property(_obj, FullSize.big, 60), _obj);
export var MASK_NAMESPACE = "M78-MASK";
