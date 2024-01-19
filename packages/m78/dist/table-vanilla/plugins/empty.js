import { _ as _assert_this_initialized } from "@swc/helpers/_/_assert_this_initialized";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
import { TableLoadStage, TablePlugin } from "../plugin.js";
import { TableReloadLevel } from "./life.js";
import { removeNode } from "../../common/index.js";
import { _getSizeString } from "../common.js";
/** 处理无数据 */ export var _TablePluginEmpty = /*#__PURE__*/ function(TablePlugin) {
    "use strict";
    _inherits(_TablePluginEmpty, TablePlugin);
    var _super = _create_super(_TablePluginEmpty);
    function _TablePluginEmpty() {
        _class_call_check(this, _TablePluginEmpty);
        var _this;
        _this = _super.apply(this, arguments);
        _define_property(_assert_this_initialized(_this), "isEmpty", false);
        /** 空节点 */ _define_property(_assert_this_initialized(_this), "node", void 0);
        return _this;
    }
    _create_class(_TablePluginEmpty, [
        {
            /** reloadStage是在init阶段触发的, 需要确保在其之前创建了node */ key: "beforeInit",
            value: function beforeInit() {
                this.node = document.createElement("div");
                this.node.className = "m78-table_empty";
                var emptyNode = this.config.emptyNode;
                if (emptyNode) {
                    this.node.appendChild(emptyNode);
                } else {
                    this.node.innerHTML = "empty";
                }
                this.config.el.appendChild(this.node);
            }
        },
        {
            key: "beforeDestroy",
            value: function beforeDestroy() {
                removeNode(this.node);
            }
        },
        {
            key: "reload",
            value: function reload(opt) {
                // 若完全重置, 请还原isEmpty, 这样loadStage中的逻辑才能完全重新处理
                if ((opt === null || opt === void 0 ? void 0 : opt.level) === TableReloadLevel.full) {
                    this.isEmpty = false;
                }
            }
        },
        {
            /** 在index前拦截判断是否是empty, 是则注入占位数据并显示节点, 否则隐藏 */ key: "loadStage",
            value: function loadStage(stage, isBefore) {
                var ctx = this.context;
                if (stage === TableLoadStage.indexHandle && isBefore) {
                    var len = ctx.data.length;
                    // 已经是空状态, 说明已经注入了空数据, 长度需减1
                    if (this.isEmpty) {
                        len--;
                    }
                    if (ctx.yHeaderKeys.length >= len) {
                        if (!this.isEmpty) {
                            // 添加一条假数据用于empty占位, 另外也能保证getBoundItems正确运行
                            ctx.data.push(_define_property({}, this.config.primaryKey, _TablePluginEmpty.EMPTY_ROW_KEY));
                            ctx.getRowMeta(_TablePluginEmpty.EMPTY_ROW_KEY).fake = true;
                            ctx.rows[_TablePluginEmpty.EMPTY_ROW_KEY] = {
                                height: this.config.emptySize
                            };
                        }
                        this.isEmpty = true;
                        this.update();
                    } else {
                        var needClear = this.isEmpty; // 若前一个状态是empty, 需要清理占位数据
                        this.isEmpty = false;
                        this.update(needClear);
                    }
                }
            }
        },
        {
            key: "rendered",
            value: function rendered() {
                var size = this.table.getHeight() - this.context.yHeaderHeight;
                var emptyHeight = Math.max(size, this.config.emptySize);
                this.node.style.height = _getSizeString(emptyHeight);
            }
        },
        {
            key: "update",
            value: /** 更新empty节点状态, 并根据需要移除data中的占位数据 */ function update() {
                var needClear = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : false;
                if (this.isEmpty) {
                    this.node.style.visibility = "visible";
                } else {
                    if (needClear) {
                        var data = this.context.data;
                        var ind = -1;
                        for(var i = data.length - 1; i >= 0; i--){
                            var cur = data[i];
                            if (cur[this.config.primaryKey] === _TablePluginEmpty.EMPTY_ROW_KEY) {
                                ind = i;
                                break;
                            }
                        }
                        if (ind !== -1) {
                            this.context.data.splice(ind, 1);
                        }
                    }
                    this.node.style.visibility = "hidden";
                }
            }
        }
    ]);
    return _TablePluginEmpty;
}(TablePlugin);
_define_property(_TablePluginEmpty, "EMPTY_ROW_KEY", "__M78_EMPTY_ROW__");
