/** implement action history */ import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
export var ActionHistory = /*#__PURE__*/ function() {
    "use strict";
    function ActionHistory() {
        _class_call_check(this, ActionHistory);
        /** 最大记录长度 */ this.maxLength = 500;
        /** 操作历史 */ this.history = [];
        /** 当前所在记录游标 */ this.cursor = -1;
        /** 正在执行redo(action)操作 */ this.isDoing = false;
        /** 正在执行undo()操作 */ this.isUndoing = false;
    }
    var _proto = ActionHistory.prototype;
    _proto.redo = function redo(arg) {
        if (!arg) {
            if (this.isDoing || this.isUndoing) {
                console.warn("can't call redo() without argument when redo() or undo() is running");
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
        if (this.isDoing || this.isUndoing) {
            arg.redo();
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
    };
    /**
   * 撤销一项操作
   *
   * 在undo()执行期间内执行的redo(action)会被合并undo操作并且不计入历史
   * */ _proto.undo = function undo() {
        if (this.cursor === -1) return;
        if (this.isDoing || this.isUndoing) {
            console.warn("can't call undo() when redo() or undo() is running");
            return;
        }
        var prev = this.cursor;
        var cur = this.history[prev];
        if (!cur) return;
        this.isUndoing = true;
        cur.undo();
        this.cursor--;
        this.isUndoing = false;
    };
    /** 重置历史 */ _proto.reset = function reset() {
        this.history = [];
        this.cursor = -1;
    };
    return ActionHistory;
}();
