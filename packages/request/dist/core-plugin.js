import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _wrap_native_super from "@swc/helpers/src/_wrap_native_super.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
import { Plugin } from "./plugin";
import { ResponseError } from "./response-error";
import { pickValid } from "@m78/utils";
/** 在某些请求api(fetch)中，即使出现404/500依然会走resolve，通过此方法自行限定错误范围 */ function checkResponseStatus(status) {
    return status >= 200 && status < 300;
}
/** 核心插件，用于完成各种配置对应的基础功能 */ export var CorePlugin = /*#__PURE__*/ function(Plugin) {
    "use strict";
    _inherits(CorePlugin, Plugin);
    var _super = _create_super(CorePlugin);
    function CorePlugin() {
        _class_call_check(this, CorePlugin);
        return _super.apply(this, arguments);
    }
    var _proto = CorePlugin.prototype;
    _proto.before = function before() {
        var start = this.getCurrentOption("start");
        this.ctx._corePlugin = {
            // 从返回、配置等提取出来的反馈信息
            message: ""
        };
        this.ctx._corePlugin.startFlag = start === null || start === void 0 ? void 0 : start(this.options);
    };
    _proto.finish = function finish() {
        var finish1 = this.getCurrentOption("finish");
        finish1 === null || finish1 === void 0 ? void 0 : finish1(this.options, this.ctx._corePlugin.startFlag);
    };
    _proto.error = function error(error1) {
        var feedback = this.getCurrentOption("feedBack");
        /**
     * 取错误消息进行反馈, 顺序为:
     * 1. 根据messageField取服务器返回的错误提示消息
     * 2. 根据statusCode生成错误消息
     * 3. Error.message
     * 4. 未知错误
     * */ var errMessage = error1.message;
        /** 从服务器返回中取出的msg */ var serverMsg = "";
        /** 根据服务器返回状态码获取的msg */ var statusMsg = "";
        /** 包含response的内部错误 */ if (error1.response) {
            var response = error1.response;
            var messageField = this.getCurrentOption("messageField");
            if (response) {
                var data = response.data;
                if (data) {
                    serverMsg = data[messageField];
                }
                statusMsg = error1.response.message;
            }
        }
        var finalMsg = pickValid(serverMsg, errMessage, statusMsg);
        // 将Error对象的msg改为与反馈的msg一致
        error1.message = finalMsg;
        var errorHook = this.getCurrentOption("error");
        errorHook === null || errorHook === void 0 ? void 0 : errorHook(error1, this.options);
        if (!this.options.extraOption.quiet && feedback) {
            feedback(finalMsg, false, this.options, error1.response);
        }
    };
    _proto.pipe = function pipe(response) {
        var ref;
        var checkStatus = this.getCurrentOption("checkStatus");
        var serverMsgField = this.getCurrentOption("messageField");
        /**
     * 提示消息, 取值顺序为:
     * 1. 如果请求未失败, 且配置了extraOption.successMessage则直接使用
     * 2. 通过serverMsgField拿到的服务器响应
     * 3. 通过状态码匹配到的错误消息
     * 4. 默认错误信息
     * */ var message = pickValid((ref = response.data) === null || ref === void 0 ? void 0 : ref[serverMsgField], response.message, "".concat(response.code ? "".concat(response.code, ": ") : "", "请求异常"));
        this.ctx._corePlugin.message = message;
        /** 如果包含status，将其视为http状态码并进行检查 */ if (!checkResponseStatus(response.code)) {
            throw new ResponseError(message, response);
        }
        /** 通过配置的`checkStatus`检测服务器返回是否符合用户预期, 检测为false时抛出异常 */ if (checkStatus && response.data && !checkStatus(response.data)) {
            throw new ResponseError(message, response);
        }
        var successMessage = this.options.extraOption.successMessage;
        if (successMessage) {
            this.ctx._corePlugin.message = successMessage;
        }
        return response;
    };
    _proto.success = function success(data, response) {
        var extra = this.options.extraOption;
        var success1 = this.getCurrentOption("success");
        /** 请求成功，且设置了feedback和useServeFeedBack，使用message进行反馈 */ if (!extra.quiet && (extra.useServeFeedBack || extra.successMessage)) {
            var message = this.ctx._corePlugin.message;
            var feedback = this.getCurrentOption("feedBack");
            feedback === null || feedback === void 0 ? void 0 : feedback(message, true, this.options, response);
        }
        success1 === null || success1 === void 0 ? void 0 : success1(data, response, this.options);
    };
    return CorePlugin;
}(_wrap_native_super(Plugin));
