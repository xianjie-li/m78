import { _ as _assert_this_initialized } from "@swc/helpers/_/_assert_this_initialized";
import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
import { _ as _wrap_native_super } from "@swc/helpers/_/_wrap_native_super";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
import { Plugin } from "./plugin.js";
import { ResponseError } from "./response-error.js";
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
        var _this;
        _this = _super.apply(this, arguments);
        _define_property(_assert_this_initialized(_this), "store", void 0);
        // 标记当前插件实例为batch起始实例
        _define_property(_assert_this_initialized(_this), "batchFlag", void 0);
        return _this;
    }
    _create_class(CorePlugin, [
        {
            key: "before",
            value: function before() {
                var _this = this;
                return _async_to_generator(function() {
                    var key, keyBuilder, _this_getCurrentBatchObj, batchData;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                if (!_this.store.batch) _this.store.batch = {};
                                // 用于缓存/batch等操作的key
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
                                // 包含正在执行的batch任务时, 等待其完成
                                _this_getCurrentBatchObj = _sliced_to_array(_this.getCurrentBatchObj(), 1), batchData = _this_getCurrentBatchObj[0];
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
            }
        },
        {
            key: "start",
            value: function start(currentTask) {
                var start = this.getCurrentOption("start");
                var batchInterval = this.getCurrentOption("batchInterval");
                this.ctx._corePlugin.startFlag = start === null || start === void 0 ? void 0 : start(this.options);
                // 若batch data未初始化对其进行初始化
                var _this_getCurrentBatchObj = _sliced_to_array(this.getCurrentBatchObj(), 2), batchData = _this_getCurrentBatchObj[0], key = _this_getCurrentBatchObj[1];
                if (key && !batchData && batchInterval) {
                    this.batchFlag = true;
                    this.store.batch[key] = {
                        currentBatch: currentTask
                    };
                }
            }
        },
        {
            key: "finish",
            value: function finish() {
                var _this = this;
                var finish = this.getCurrentOption("finish");
                var batchInterval = this.getCurrentOption("batchInterval");
                finish === null || finish === void 0 ? void 0 : finish(this.options, this.ctx._corePlugin.startFlag);
                // 清理batch data
                if (this.batchFlag) {
                    var _this_getCurrentBatchObj = _sliced_to_array(this.getCurrentBatchObj(), 2), key = _this_getCurrentBatchObj[1];
                    if (key) {
                        setTimeout(function() {
                            delete _this.store.batch[key];
                            _this.batchFlag = false;
                        }, batchInterval || 0);
                    }
                }
            }
        },
        {
            key: "error",
            value: function error(error) {
                // 记录完成请求后的error信息
                var _this_getCurrentBatchObj = _sliced_to_array(this.getCurrentBatchObj(), 1), batchData = _this_getCurrentBatchObj[0];
                if (this.batchFlag && batchData && !batchData.responseError) {
                    batchData.responseError = error;
                }
                var feedback = this.getCurrentOption("feedBack");
                /**
     * 取错误消息进行反馈, 顺序为:
     * 1. 根据messageField取服务器返回的错误提示消息
     * 2. 根据statusCode生成错误消息
     * 3. Error.message
     * 4. 未知错误
     * */ var errMessage = error.message;
                /** 从服务器返回中取出的msg */ var serverMsg = "";
                /** 根据服务器返回状态码获取的msg */ var statusMsg = "";
                /** 包含response的内部错误 */ if (error.response) {
                    var response = error.response;
                    var messageField = this.getCurrentOption("messageField");
                    if (response) {
                        var data = response.data;
                        if (data) {
                            serverMsg = data[messageField];
                        }
                        statusMsg = error.response.message;
                    }
                }
                var finalMsg = pickValid(serverMsg, errMessage, statusMsg);
                // 将Error对象的msg改为与反馈的msg一致
                error.message = finalMsg;
                var errorHook = this.getCurrentOption("error");
                errorHook === null || errorHook === void 0 ? void 0 : errorHook(error, this.options);
                if (this.options.extraOption.feedbackMode !== FeedbackMode.none && feedback) {
                    feedback(finalMsg, false, this.options, error.response);
                }
            }
        },
        {
            key: "pipe",
            value: function pipe(response) {
                var _response_data;
                // 记录完成请求后的初始response
                var _this_getCurrentBatchObj = _sliced_to_array(this.getCurrentBatchObj(), 1), batchData = _this_getCurrentBatchObj[0];
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
     * */ var message = pickValid((_response_data = response.data) === null || _response_data === void 0 ? void 0 : _response_data[serverMsgField], response.message, "".concat(response.code ? "".concat(response.code, ": ") : "", "请求异常"));
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
            }
        },
        {
            key: "success",
            value: function success(data, response) {
                var extra = this.options.extraOption;
                var success = this.getCurrentOption("success");
                /** 请求成功且配置了需要成功反馈时，使用message进行反馈 */ if (extra.feedbackMode !== FeedbackMode.none && (extra.feedbackMode === FeedbackMode.all || extra.successMessage)) {
                    var message = this.ctx._corePlugin.message;
                    var feedback = this.getCurrentOption("feedBack");
                    feedback === null || feedback === void 0 ? void 0 : feedback(message, true, this.options, response);
                }
                success === null || success === void 0 ? void 0 : success(data, response, this.options);
            }
        },
        {
            key: "getCurrentBatchObj",
            value: // 获取当前请求的batch配置对象和key
            function getCurrentBatchObj() {
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
            }
        }
    ]);
    return CorePlugin;
}(_wrap_native_super(Plugin));
