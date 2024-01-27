import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
import { _ as _to_consumable_array } from "@swc/helpers/_/_to_consumable_array";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
import { createPromise, createTempID, deleteNamePathValue, getNamePathValue, isEmpty, isObject, isWorker, throwError } from "@m78/utils";
// 使用兼容库来实现对浏览器和node的同时支持
import Worker from "web-worker";
import { _InnerHandlers, _ErrorCode, _ErrorMessages } from "./types.js";
/**
 * 一个让你能更轻松使用Web Worker的库, 支持浏览器和nodejs
 *
 * - 更简单的worker创建流程
 * - 它允许你注册多个不同的handle, 并在后续通过和使用异步函数相同的方式使用这些handle, 这让你避免了通过消息通讯来进行线程通讯的糟糕方式
 * - handle在独立的线程中运行, 如果浏览器不支持Web Worker, 将回退到使用浏览器主线程
 * - 自动调度任务到空闲线程
 * - 类型安全, 所有invoke()调用都包含对应handle的入参和返回类型提示
 *
 * 注意事项:
 * - 请将new M78Worker()放到单独的脚本文件中执行, 该脚本会在主线程和子线程分别执行并创建各自线程内的的M78Worker实例, 这些实例在不同的线程中会有不同的职责
 *    - 创建脚本和其导入的模块不应包含和创建worker无关的内容或副作用代码, 因为这些内容(脚本/导入模块)会根据创建的线程数量被执行多次
 *    - 在当前脚本访问worker实例是不正确的, 必须在其他脚本中导入后使用
 * - 并不是所有任务都适合分配到独立线程执行, 当需要传输大量数据, 甚至包含编解码时, 多线程计算带来的收益可能会不足以填补线程之间传送数据的损耗.
 *
 * 其他:
 * - 一些类似的库提供 instance.run((a, b) => a + b) 的方式来之间在子线程中运行给定函数, 由于线程通讯序列化的限制,  这些函数其实是通过字符串形式传输的, 不能包含任何对函数外内容的访问, 这在实际开发中意义不大, 故不会提供.
 * */ export var M78Worker = /*#__PURE__*/ function() {
    "use strict";
    function M78Worker(config) {
        var _this = this;
        _class_call_check(this, M78Worker);
        _define_property(this, "config", void 0);
        /** 是否已初始化 */ _define_property(this, "initialized", void 0);
        /** 初始化进行中, 可通过该promise等待完成 */ _define_property(this, "initializeTask", void 0);
        /** 是否是工作线程 */ _define_property(this, "isWorker", void 0);
        /** 存放线程对象及其信息 */ _define_property(this, "worker", void 0);
        /** 注册的handle, 以handleName为key, 无论主线程, 子线程都会对当前handle进行注册 */ _define_property(this, "handleMap", void 0);
        /** 执行中的invoke, key为执行id, promise会返回执行结果, 也有可能抛出错误, main/sub线程的执行任务均存储在此 */ _define_property(this, "invokingMap", void 0);
        /** handle是否应强制在主线程执行 */ _define_property(this, "forceUseMainThread", void 0);
        /** 默认的子线程数量 */ _define_property(this, "defaultWorkerNum", void 0);
        _define_property(this, "defaultWorkerName", void 0);
        /**
   * 初始化并创建线程, 默认会在首次执行invoke时自动初始化, 此方法可重复调用, 但后续调用会直接忽略
   *
   * 由于会涉及到加载线程脚本等异步操作, 可以在确定会使用到工作线程时提前触发来提升首次执行的速度 */ _define_property(this, "init", void 0);
        _define_property(this, "onMessage", void 0);
        this.config = config;
        this.initialized = false;
        this.isWorker = isWorker();
        this.worker = [];
        this.handleMap = new Map();
        this.invokingMap = new Map();
        this.forceUseMainThread = false;
        this.defaultWorkerNum = 1;
        this.defaultWorkerName = "m78-worker";
        var _this1 = this;
        this.init = /*#__PURE__*/ _async_to_generator(function() {
            var num, _$name, i, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, w, err, e;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        if (_this1.initialized) return [
                            2
                        ];
                        if (_this1.initializeTask) return [
                            2,
                            _this1.initializeTask.promise
                        ];
                        if (!_this1.isWorker) return [
                            3,
                            2
                        ];
                        _this1.initialized = true;
                        return [
                            4,
                            _this1.processLoader()
                        ];
                    case 1:
                        _state.sent();
                        return [
                            2
                        ];
                    case 2:
                        /* # # # # # # # 主进程初始化 # # # # # # # */ _this1.initializeTask = createPromise();
                        _state.label = 3;
                    case 3:
                        _state.trys.push([
                            3,
                            13,
                            14,
                            15
                        ]);
                        // 主线程预先加载好所有loader并在本身进行注册, 防止包含import()加载时, 子进程重复加载
                        return [
                            4,
                            _this1.processLoader()
                        ];
                    case 4:
                        _state.sent();
                        if (_this1.forceUseMainThread) return [
                            2
                        ];
                        num = _this1.config.workerNum || _this1.defaultWorkerNum;
                        _$name = _this1.config.name || _this1.defaultWorkerName;
                        for(i = 0; i < num; i++){
                            _this1.worker.push({
                                worker: new Worker(_this1.config.url, {
                                    type: _this1.config.type || "module",
                                    name: "".concat(_$name, "-").concat(i)
                                }),
                                taskNum: 0
                            });
                        }
                        _this1.addListeners();
                        _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                        _state.label = 5;
                    case 5:
                        _state.trys.push([
                            5,
                            10,
                            11,
                            12
                        ]);
                        _iterator = _this1.worker[Symbol.iterator]();
                        _state.label = 6;
                    case 6:
                        if (!!(_iteratorNormalCompletion = (_step = _iterator.next()).done)) return [
                            3,
                            9
                        ];
                        w = _step.value;
                        return [
                            4,
                            _this1.invokeInner(w, _InnerHandlers.init)
                        ];
                    case 7:
                        _state.sent();
                        _state.label = 8;
                    case 8:
                        _iteratorNormalCompletion = true;
                        return [
                            3,
                            6
                        ];
                    case 9:
                        return [
                            3,
                            12
                        ];
                    case 10:
                        err = _state.sent();
                        _didIteratorError = true;
                        _iteratorError = err;
                        return [
                            3,
                            12
                        ];
                    case 11:
                        try {
                            if (!_iteratorNormalCompletion && _iterator.return != null) {
                                _iterator.return();
                            }
                        } finally{
                            if (_didIteratorError) {
                                throw _iteratorError;
                            }
                        }
                        return [
                            7
                        ];
                    case 12:
                        return [
                            3,
                            15
                        ];
                    case 13:
                        e = _state.sent();
                        // 创建worker失败时, 改为主线程执行
                        _this1.forceUseMainThread = true;
                        console.warn("".concat(_this1.getErrorText(_ErrorCode.CREATE_WORKER_FAIL), ": ").concat(e));
                        return [
                            3,
                            15
                        ];
                    case 14:
                        _this1.initialized = true;
                        _this1.initializeTask.resolve();
                        _this1.initializeTask = null;
                        return [
                            7
                        ];
                    case 15:
                        return [
                            2
                        ];
                }
            });
        });
        this.onMessage = function(param) {
            var data = param.data;
            if (!isObject(data)) return;
            var id = getNamePathValue(data, M78Worker.ID_KEY);
            if (!id) return;
            _this.isWorker ? _this.workerMessageHandle(id, data) : _this.mainMessageHandle(id, data);
        };
        // 非worker线程 且 不支持worker, 在主进程执行handle
        if (!this.isWorker && typeof Worker === "undefined") {
            this.forceUseMainThread = true;
        }
        console.log("isWorker", this.isWorker, name);
        if (this.isWorker) {
            this.addListeners();
            this.processInnerHandler();
        }
    }
    _create_class(M78Worker, [
        {
            /** 销毁 */ key: "destroy",
            value: function destroy() {
                this.removeListeners();
                if (this.worker.length) {
                    this.worker.forEach(function(w) {
                        w.worker.terminate();
                    });
                }
                this.worker = [];
                deleteNamePathValue(this, "handleMap");
                deleteNamePathValue(this, "invokingMap");
            }
        },
        {
            key: "invoke",
            value: /**
   * 执行指定的handle
   * */ function invoke(handleName) {
                for(var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
                    args[_key - 1] = arguments[_key];
                }
                var _this = this;
                return _async_to_generator(function() {
                    var handleData, current;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                if (!!_this.initialized) return [
                                    3,
                                    2
                                ];
                                return [
                                    4,
                                    _this.init()
                                ];
                            case 1:
                                _state.sent();
                                _state.label = 2;
                            case 2:
                                if (!_this.initializeTask) return [
                                    3,
                                    4
                                ];
                                return [
                                    4,
                                    _this.initializeTask.promise
                                ];
                            case 3:
                                _state.sent();
                                _state.label = 4;
                            case 4:
                                if (_this.isWorker) _this.throwError(_ErrorCode.ONLY_MAIN);
                                handleData = _this.handleMap.get(handleName);
                                if (!handleData) _this.throwError(_ErrorCode.HANDLE_NOT_REGISTER);
                                if (_this.forceUseMainThread) {
                                    return [
                                        2,
                                        handleData.apply(void 0, _to_consumable_array(args))
                                    ];
                                }
                                if (!_this.worker.length) _this.throwError(_ErrorCode.NOT_WORKER);
                                current = _this.pickWorker();
                                if (!current) return [
                                    2,
                                    _this.throwError(_ErrorCode.NOT_WORKER)
                                ];
                                return [
                                    2,
                                    _this.invokeInner.apply(_this, [
                                        current,
                                        handleName
                                    ].concat(_to_consumable_array(args)))
                                ];
                        }
                    });
                })();
            }
        },
        {
            key: "invokeInner",
            value: /** invoke的主要实现, 也用于内部handle调用 */ function invokeInner(wd, handleName) {
                for(var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++){
                    args[_key - 2] = arguments[_key];
                }
                var _this = this;
                return _async_to_generator(function() {
                    var id, invokingData, task;
                    return _ts_generator(this, function(_state) {
                        id = createTempID();
                        invokingData = {
                            workerData: wd
                        };
                        task = new Promise(function(resolve, reject) {
                            invokingData.resolve = resolve;
                            invokingData.reject = reject;
                        }).finally(function() {
                            _this.invokingMap.delete(id);
                        });
                        invokingData.task = task;
                        _this.invokingMap.set(id, invokingData);
                        wd.taskNum++;
                        wd.worker.postMessage(_this.buildMessage(id, handleName, {
                            args: args
                        }));
                        return [
                            2,
                            task
                        ];
                    });
                })();
            }
        },
        {
            key: "processLoader",
            value: /** 根据当前handleLoader配置加载handler, 此函数不会抛出异常 */ function processLoader() {
                var _this = this;
                return _async_to_generator(function() {
                    var handleRecord;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    _this.config.handleLoader().catch(function(e) {
                                        // loader包含错误时, 进行提示, 无需中断
                                        console.warn("".concat(_this.getErrorText(_ErrorCode.HAS_LOADER_ERROR), ": ").concat(e));
                                    })
                                ];
                            case 1:
                                handleRecord = _state.sent();
                                if (isEmpty(handleRecord)) return [
                                    2
                                ];
                                Object.entries(handleRecord).forEach(function(param) {
                                    var _param = _sliced_to_array(param, 2), k = _param[0], v = _param[1];
                                    _this.handleMap.set(k, v);
                                });
                                return [
                                    2
                                ];
                        }
                    });
                })();
            }
        },
        {
            key: "pickWorker",
            value: /** 从当前的worker列表中挑选出一个空闲或任务数量最少的worker, 若没有获取到worker则返回null(通常是由于没有任何worker创建) */ function pickWorker() {
                var _Math;
                var min = (_Math = Math).min.apply(_Math, _to_consumable_array(this.worker.map(function(i) {
                    return i.taskNum;
                })));
                var current = null;
                this.worker.forEach(function(w) {
                    if (w.taskNum === min) {
                        current = w;
                    }
                });
                return current;
            }
        },
        {
            key: "processInnerHandler",
            value: /** 注册内部使用的handle */ function processInnerHandler() {
                this.handleMap.set(_InnerHandlers.init, this.init);
            }
        },
        {
            key: "mainMessageHandle",
            value: // 主线程事件监听
            function mainMessageHandle(id, data) {
                var taskData = this.invokingMap.get(id);
                if (!taskData) return;
                taskData.workerData.taskNum--;
                this.invokingMap.delete(id);
                if (data.error !== undefined) {
                    taskData.reject(data.error);
                    return;
                }
                taskData.resolve(data.payload);
            }
        },
        {
            key: "workerMessageHandle",
            value: // 子线程事件监听
            function workerMessageHandle(id, data) {
                var _this = this;
                return _async_to_generator(function() {
                    var handle, message, e;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                handle = _this.handleMap.get(data.handleName);
                                message = _this.buildMessage(id, data.handleName);
                                if (!handle) return [
                                    3,
                                    5
                                ];
                                _state.label = 1;
                            case 1:
                                _state.trys.push([
                                    1,
                                    3,
                                    ,
                                    4
                                ]);
                                return [
                                    4,
                                    handle.apply(void 0, _to_consumable_array(data.args || []))
                                ];
                            case 2:
                                message.payload = _state.sent();
                                return [
                                    3,
                                    4
                                ];
                            case 3:
                                e = _state.sent();
                                message.error = e.message || _this.getErrorText(_ErrorCode.HANDLE_INVOKE_FAIL);
                                return [
                                    3,
                                    4
                                ];
                            case 4:
                                return [
                                    3,
                                    6
                                ];
                            case 5:
                                message.error = "".concat(_this.getErrorText(_ErrorCode.HANDLE_NOT_REGISTER), ": ").concat(data.handleName);
                                _state.label = 6;
                            case 6:
                                console.log(data.handleName, name);
                                postMessage(message);
                                return [
                                    2
                                ];
                        }
                    });
                })();
            }
        },
        {
            key: "addListeners",
            value: // 事件监听
            function addListeners() {
                var _this = this;
                if (this.isWorker) {
                    addEventListener("message", this.onMessage);
                } else {
                    this.worker.length && this.worker.forEach(function(w) {
                        w.worker.addEventListener("message", _this.onMessage);
                    });
                }
            }
        },
        {
            key: "removeListeners",
            value: // 移除监听器
            function removeListeners() {
                var _this = this;
                if (this.isWorker) {
                    removeEventListener("message", this.onMessage);
                } else {
                    this.worker.length && this.worker.forEach(function(w) {
                        w.worker.removeEventListener("message", _this.onMessage);
                    });
                }
            }
        },
        {
            key: "throwError",
            value: // 抛出指定code的错误
            function throwError1(code) {
                throwError(_ErrorMessages[code]);
            }
        },
        {
            key: "getErrorText",
            value: // 获取指定错误信息
            function getErrorText(code) {
                return _ErrorMessages[code];
            }
        },
        {
            key: "buildMessage",
            value: // 构造专用传输结构
            function buildMessage(id, handleName, msg) {
                var _obj;
                return _object_spread((_obj = {}, _define_property(_obj, M78Worker.ID_KEY, id), _define_property(_obj, "handleName", handleName), _obj), msg);
            }
        }
    ]);
    return M78Worker;
}();
/** invoke id 的key */ _define_property(M78Worker, "ID_KEY", "__M78_WORKER_ID_KEY");
