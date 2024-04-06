import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _class_private_method_get } from "@swc/helpers/_/_class_private_method_get";
import { _ as _class_private_method_init } from "@swc/helpers/_/_class_private_method_init";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { dumpFn } from "../function.js";
var ACTION_IN_ACTION_WARNING = "Can't call redo() when redo() or undo() is running";
var // 执行当前所有ignoreCB并传入cb
_ignoreEmit = /*#__PURE__*/ new WeakSet();
/** implement action history */ export var ActionHistory = /*#__PURE__*/ function() {
    "use strict";
    function ActionHistory() {
        _class_call_check(this, ActionHistory);
        _class_private_method_init(this, _ignoreEmit);
        /** 最大记录长度 */ _define_property(this, "maxLength", 500);
        /** 操作历史 */ _define_property(this, "history", []);
        /** 当前所在记录游标, -1表示初始状态 */ _define_property(this, "cursor", -1);
        /** 正在执行redo(action)操作 */ _define_property(this, "isDoing", false);
        /** 正在执行undo()操作 */ _define_property(this, "isUndoing", false);
        /** 为true期间不计入历史记录 */ _define_property(this, "ignoreCB", []);
    }
    _create_class(ActionHistory, [
        {
            key: "redo",
            value: function redo(arg) {
                if (!arg) {
                    if (this.isDoing || this.isUndoing) {
                        throw Error(ACTION_IN_ACTION_WARNING);
                    }
                    // batch进行中不允许执行普通的redo
                    if (this.ignoreCB.length) {
                        throw Error("Can't call redo() inside batch() or ignore() without argument");
                    }
                    var next = this.cursor + 1;
                    var cur = this.history[next];
                    if (!cur) return;
                    this.isDoing = true;
                    cur.redo();
                    this.isDoing = false;
                    this.cursor++;
                    return;
                }
                if (_class_private_method_get(this, _ignoreEmit, ignoreEmit).call(this, arg)) {
                    arg.redo();
                    return;
                }
                if (this.isDoing || this.isUndoing) {
                    throw Error(ACTION_IN_ACTION_WARNING);
                }
                this.isDoing = true;
                // 长度超出时, 先移除最前面的记录
                if (this.history.length >= this.maxLength) {
                    this.history.shift();
                    this.cursor--;
                }
                // 游标不在末尾则直接以当前位置截断
                if (this.cursor !== this.history.length - 1) {
                    this.history = this.history.slice(0, this.cursor + 1);
                }
                arg.redo();
                this.history.push(arg);
                this.cursor++;
                this.isDoing = false;
            }
        },
        {
            /**
   * 撤销一项操作
   *
   * 在undo()执行期间内执行的redo(action)会被合并undo操作并且不计入历史
   * */ key: "undo",
            value: function undo() {
                if (this.isDoing || this.isUndoing) {
                    throw Error("Can't call undo() when redo() or undo() is running");
                }
                if (this.ignoreCB.length) {
                    throw Error("Can't call undo() inside batch() or ignore()");
                }
                if (this.cursor === -1) return;
                var prev = this.cursor;
                var cur = this.history[prev];
                if (!cur) return;
                this.isUndoing = true;
                cur.undo();
                this.cursor--;
                this.isUndoing = false;
            }
        },
        {
            /**
   * 批量执行, 在action内执行的所有redo(action)操作都会被合并为单个, batch内不可再调用其他batch
   *
   * @param action - 在action内执行的redo会被合并
   * @param title - 操作名
   * */ key: "batch",
            value: function batch(action, title) {
                var _this = this;
                if (this.ignoreCB.length) {
                    throw Error("Can't call batch() inside another batch() or ignore()");
                }
                var allAct = [];
                var actionObj = {
                    title: title,
                    redo: function() {
                        allAct.length = 0; // 防止撤销重做时取到脏数据
                        // 允许嵌套执行, 嵌套的redo直接执行, 不进行记录
                        _this.ignore(action, function(act) {
                            allAct.push(act);
                        });
                    },
                    undo: function() {
                        // 需要以相反顺序执行undo
                        allAct.slice().reverse().forEach(function(item) {
                            return item.undo();
                        });
                    }
                };
                this.redo(actionObj);
                return actionObj;
            }
        },
        {
            /**
   * 使action期间的所有redo(action)操作不计入历史, 需要自行保证这些被忽略的操作不会影响历史还原或重做
   *
   * 被忽略的action会通过 cb 回调
   * */ key: "ignore",
            value: function ignore(action, cb) {
                var curCB = cb || dumpFn;
                this.ignoreCB.push(curCB);
                action();
                this.ignoreCB.splice(this.ignoreCB.indexOf(curCB), 1);
            }
        },
        {
            /** 重置历史 */ key: "reset",
            value: function reset() {
                this.history = [];
                this.cursor = -1;
            }
        },
        {
            /** 获取下一条记录 */ key: "getNext",
            value: function getNext() {
                return this.history[this.cursor + 1] || null;
            }
        },
        {
            /** 获取前一条记录 */ key: "getPrev",
            value: function getPrev() {
                // 游标为0时, 前一项为还原初始状态, 生产一个假的操作项
                if (this.cursor === 0) return {
                    redo: function() {},
                    undo: function() {}
                };
                return this.history[this.cursor - 1] || null;
            }
        }
    ]);
    return ActionHistory;
}();
function ignoreEmit(act) {
    if (!this.ignoreCB.length) return false;
    this.ignoreCB.slice().reverse().forEach(function(f) {
        return f(act);
    });
    return true;
}
