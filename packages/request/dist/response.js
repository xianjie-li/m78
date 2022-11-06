import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
/**
 * 响应类, 用于抹平不同客户端返回之间的差异
 * */ export var Response = function Response() {
    "use strict";
    _class_call_check(this, Response);
    /** 响应消息, 通常是请求响应中与code对应的提示文本 */ this.message = "";
    /** http状态码, 若为0, 通常意味着未与服务器正常建立连接, 错误是由于本地环境导致, 如网络/cors等 */ this.code = 0;
    /** 响应数据 */ this.data = null;
    /** 响应头 */ this.headers = {};
};
