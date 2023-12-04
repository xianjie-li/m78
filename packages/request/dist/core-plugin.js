import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import _wrap_native_super from "@swc/helpers/src/_wrap_native_super.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
import { Plugin } from "./plugin";
import { ResponseError } from "./response-error";
import { pickValid } from "@m78/utils";
import { FeedbackMode } from "./interfaces.js";
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
        var _this = this;
        return _async_to_generator(function() {
            var key, keyBuilder, ref, batchData;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        if (!_this.store.batch) _this.store.batch = {};
                        key = "";
                        keyBuilder = _this.getCurrentOption("keyBuilder");
                        if (keyBuilder) {
                            key = keyBuilder(_this.options) || "";
                        }
                        _this.ctx._corePlugin = {
                            // 从返回、配置等提取出来的反馈信息
                            message: "",
                            key: key
                        };
                        ref = _sliced_to_array(_this.getCurrentBatchObj(), 1), batchData = ref[0];
                        if (!(batchData && batchData.currentBatch)) return [
                            3,
                            2
                        ];
                        return [
                            4,
                            batchData.currentBatch
                        ];
                    case 1:
                        _state.sent();
                        if (batchData.response) return [
                            2,
                            batchData.response
                        ];
                        if (batchData.responseError) return [
                            2,
                            batchData.responseError
                        ];
                        _state.label = 2;
                    case 2:
                        return [
                            2
                        ];
                }
            });
        })();
    };
    _proto.start = function start(currentTask) {
        var start1 = this.getCurrentOption("start");
        var batchInterval = this.getCurrentOption("batchInterval");
        this.ctx._corePlugin.startFlag = start1 === null || start1 === void 0 ? void 0 : start1(this.options);
        // 若batch data未初始化对其进行初始化
        var ref = _sliced_to_array(this.getCurrentBatchObj(), 2), batchData = ref[0], key = ref[1];
        if (key && !batchData && batchInterval) {
            this.batchFlag = true;
            this.store.batch[key] = {
                currentBatch: currentTask
            };
        }
    };
    _proto.finish = function finish() {
        var _this = this;
        var finish1 = this.getCurrentOption("finish");
        var batchInterval = this.getCurrentOption("batchInterval");
        finish1 === null || finish1 === void 0 ? void 0 : finish1(this.options, this.ctx._corePlugin.startFlag);
        // 清理batch data
        if (this.batchFlag) {
            var ref = _sliced_to_array(this.getCurrentBatchObj(), 2), key = ref[1];
            if (key) {
                setTimeout(function() {
                    delete _this.store.batch[key];
                    _this.batchFlag = false;
                }, batchInterval || 0);
            }
        }
    };
    _proto.error = function error(error1) {
        // 记录完成请求后的error信息
        var ref = _sliced_to_array(this.getCurrentBatchObj(), 1), batchData = ref[0];
        if (this.batchFlag && batchData && !batchData.responseError) {
            batchData.responseError = error1;
        }
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
        if (this.options.extraOption.feedbackMode !== FeedbackMode.none && feedback) {
            feedback(finalMsg, false, this.options, error1.response);
        }
    };
    _proto.pipe = function pipe(response) {
        var ref;
        // 记录完成请求后的初始response
        var ref1 = _sliced_to_array(this.getCurrentBatchObj(), 2), batchData = ref1[0], key = ref1[1];
        if (this.batchFlag && batchData && !batchData.response) {
            batchData.response = response.clone();
        }
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
        /** 请求成功且配置了需要成功反馈时，使用message进行反馈 */ if (extra.feedbackMode !== FeedbackMode.none && (extra.feedbackMode === FeedbackMode.all || extra.successMessage)) {
            var message = this.ctx._corePlugin.message;
            var feedback = this.getCurrentOption("feedBack");
            feedback === null || feedback === void 0 ? void 0 : feedback(message, true, this.options, response);
        }
        success1 === null || success1 === void 0 ? void 0 : success1(data, response, this.options);
    };
    // 获取当前请求的batch配置对象和key
    _proto.getCurrentBatchObj = function getCurrentBatchObj() {
        var key = this.ctx._corePlugin.key;
        // 记录完成请求后的初始response
        if (key) {
            var cur = this.store.batch[key];
            return [
                cur,
                key
            ];
        }
        return [];
    };
    return CorePlugin;
}(_wrap_native_super(Plugin));
