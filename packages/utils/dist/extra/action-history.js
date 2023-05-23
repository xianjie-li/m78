/** implement action history */ import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
export var ActionHistory = /*#__PURE__*/ function() {
    "use strict";
    function ActionHistory() {
        _class_call_check(this, ActionHistory);
        /** 最大记录长度 */ this.maxLength = 500;
        /** 操作历史 */ this.history = [];
        /** 当前所在记录游标 */ this.cursor = -1;
    }
    var _proto = ActionHistory.prototype;
    _proto.redo = function redo(arg) {
        if (!arg) {
            var next = this.cursor + 1;
            var cur = this.history[next];
            if (!cur) return;
            cur.redo();
            this.cursor++;
            return;
        }
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
    };
    /** 撤销一项操作 */ _proto.undo = function undo() {
        if (this.cursor === -1) return;
        var prev = this.cursor;
        var cur = this.history[prev];
        if (!cur) return;
        cur.undo();
        this.cursor--;
    };
    _proto.reset = function reset() {
        this.history = [];
        this.cursor = -1;
    };
    return ActionHistory;
}();
