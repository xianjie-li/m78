import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _define_property } from "@swc/helpers/_/_define_property";
var ACTION_IN_ACTION_WARNING = "can't call redo() when redo() or undo() is running";
/** implement action history */ export var ActionHistory = /*#__PURE__*/ function() {
    "use strict";
    function ActionHistory() {
        _class_call_check(this, ActionHistory);
        /** 最大记录长度 */ _define_property(this, "maxLength", 500);
        /** 操作历史 */ _define_property(this, "history", []);
        /** 当前所在记录游标, -1表示初始状态 */ _define_property(this, "cursor", -1);
        /** 正在执行redo(action)操作 */ _define_property(this, "isDoing", false);
        /** 正在执行undo()操作 */ _define_property(this, "isUndoing", false);
        /** batch操作期间缓冲的所有action */ _define_property(this, "batchActionList", void 0);
        /** 为true期间不计入历史记录 */ _define_property(this, "ignoreFlag", false);
    }
    _create_class(ActionHistory, [
        {
            key: "redo",
            value: function redo(arg) {
                if (!arg) {
                    if (this.isDoing || this.isUndoing) {
                        console.warn(ACTION_IN_ACTION_WARNING);
                        return;
                    }
                    if (this.batchActionList) {
                        console.warn("can't call redo() without argument when batch() is running");
                        return;
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
                if (this.ignoreFlag) {
                    arg.redo();
                    return;
                }
                if (this.isDoing || this.isUndoing) {
                    console.warn(ACTION_IN_ACTION_WARNING);
                    return;
                }
                if (this.batchActionList) {
                    this.batchActionList.push(arg);
                    return;
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
                    console.warn("can't call undo() when redo() or undo() is running");
                    return;
                }
                if (this.batchActionList) {
                    console.warn("can't call undo() when batch() is running");
                    return;
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
   * 批量执行, 在action内执行的所有redo(action)操作都会被合并为单个
   * */ key: "batch",
            value: function batch(action) {
                if (this.batchActionList) return;
                this.batchActionList = [];
                action();
                var list = this.batchActionList.slice();
                this.batchActionList = undefined;
                this.redo({
                    redo: function() {
                        list.forEach(function(item) {
                            return item.redo();
                        });
                    },
                    undo: function() {
                        // 需要以相反顺序执行undo
                        list.slice().reverse().forEach(function(item) {
                            return item.undo();
                        });
                    }
                });
            }
        },
        {
            /**
   * 使action期间的所有redo(action)操作不计入历史, 需要自行保证这些被忽略的操作不会影响历史还原或重做
   * */ key: "ignore",
            value: function ignore(action) {
                this.ignoreFlag = true;
                action();
                this.ignoreFlag = false;
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
