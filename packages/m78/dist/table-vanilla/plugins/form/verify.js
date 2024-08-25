import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
import { createVerify } from "@m78/form";
import { isTruthyOrZero } from "@m78/utils";
import { throwError } from "../../../common/index.js";
import { FORM_LANG_PACK_NS, i18n } from "../../../i18n/index.js";
export var _MixinVerify = /*#__PURE__*/ function() {
    "use strict";
    function _MixinVerify() {
        _class_call_check(this, _MixinVerify);
    }
    _create_class(_MixinVerify, [
        {
            /** 获取单元格invalid状态 */ key: "validCheck",
            value: function validCheck(cell) {
                var invalid = this.getSchemas(cell.row).invalid;
                if (!invalid) return true;
                return !invalid.get(cell.column.key);
            }
        },
        {
            /** 初始化verify实例 */ key: "initVerify",
            value: function initVerify() {
                var _this_config_schemas;
                this.verifyInstance = createVerify({
                    schemas: ((_this_config_schemas = this.config.schemas) === null || _this_config_schemas === void 0 ? void 0 : _this_config_schemas.length) ? {
                        schemas: this.config.schemas
                    } : {},
                    autoVerify: false,
                    languagePack: i18n.getResourceBundle(i18n.language, FORM_LANG_PACK_NS)
                });
            }
        },
        {
            key: "verify",
            value: function verify() {
                return this.verifyCommon(false);
            }
        },
        {
            key: "verifyUpdated",
            value: function verifyUpdated() {
                return this.verifyCommon(true);
            }
        },
        {
            key: "verifyRow",
            value: function verifyRow(rowKey) {
                var row = this.table.getRow(rowKey);
                var data = this.getFmtData(row, row.data);
                var schemas = this.getSchemas(row);
                return this.innerCheck({
                    row: row,
                    values: data,
                    schemas: schemas
                });
            }
        },
        {
            key: "verifyCommon",
            value: // verify/verifyChanged 验证通用逻辑, 逐行验证数据, 发生错误时停止并返回
            function verifyCommon(onlyUpdated) {
                var _this = this;
                return _async_to_generator(function() {
                    var curError, res;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                curError = null;
                                return [
                                    4,
                                    _this.innerGetData(function() {
                                        var _ref = _async_to_generator(function(i, key, status) {
                                            var row, schema, _ref, rejects;
                                            return _ts_generator(this, function(_state) {
                                                switch(_state.label){
                                                    case 0:
                                                        if (onlyUpdated && !status.update) return [
                                                            2,
                                                            false
                                                        ];
                                                        row = _this.table.getRow(key);
                                                        schema = _this.getSchemas(row);
                                                        return [
                                                            4,
                                                            _this.innerCheck({
                                                                row: row,
                                                                values: i,
                                                                schemas: schema
                                                            })
                                                        ];
                                                    case 1:
                                                        _ref = _sliced_to_array.apply(void 0, [
                                                            _state.sent(),
                                                            1
                                                        ]), rejects = _ref[0];
                                                        // 包含错误时, 中断循环
                                                        if (rejects) {
                                                            curError = rejects;
                                                            return [
                                                                2,
                                                                0
                                                            ];
                                                        }
                                                        return [
                                                            2
                                                        ];
                                                }
                                            });
                                        });
                                        return function(i, key, status) {
                                            return _ref.apply(this, arguments);
                                        };
                                    }())
                                ];
                            case 1:
                                res = _state.sent();
                                if (curError) {
                                    return [
                                        2,
                                        [
                                            curError,
                                            null
                                        ]
                                    ];
                                }
                                return [
                                    2,
                                    [
                                        null,
                                        res
                                    ]
                                ];
                        }
                    });
                })();
            }
        },
        {
            // 接收处理后的values和schemas进行验证, 并更新行或单元格的错误信息, 包含错误时, 会选中并高亮首个错误单元格
            key: "innerCheck",
            value: function innerCheck(arg) {
                var _this = this;
                var _row = arg.row, cell = arg.cell, values = arg.values, schemas = arg.schemas;
                var row;
                if (cell) {
                    row = cell.row;
                } else if (isTruthyOrZero(_row)) {
                    row = this.table.isRowLike(_row) ? _row : this.table.getRow(_row);
                }
                if (!row) throwError("Unable to get row");
                var verify = this.getVerify();
                var cellError = this.cellErrors.get(row.key);
                if (!cellError) {
                    cellError = new Map();
                    this.cellErrors.set(row.key, cellError);
                }
                return verify.staticCheck(values, schemas).then(function(res) {
                    var _res = _sliced_to_array(res, 1), errors = _res[0];
                    // 需要高亮的列
                    var highlightColumn;
                    var existCheck = {};
                    // errors顺序可能与实际显示不符, 需要存储后通过当前顺序查出需要高亮的首个列
                    var errColumuKeys = {};
                    if (errors) {
                        var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                        try {
                            for(var _iterator = errors[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                                var e = _step.value;
                                // 对单元格验证和行验证采用不同的行为, cell验证仅写入对应列的错误
                                if (cell) {
                                    // 单元格验证时, 只读取与单元格有关的第一条错误进行显示
                                    if (cell.column.key === e.name) {
                                        highlightColumn = cell.column.key;
                                        cellError.set(e.name, e);
                                        break;
                                    }
                                } else {
                                    // 每列只取第一条错误
                                    if (!existCheck[e.name]) {
                                        cellError.set(e.name, e);
                                        existCheck[e.name] = true;
                                        errColumuKeys[e.name] = true;
                                    }
                                }
                            }
                        } catch (err) {
                            _didIteratorError = true;
                            _iteratorError = err;
                        } finally{
                            try {
                                if (!_iteratorNormalCompletion && _iterator.return != null) {
                                    _iterator.return();
                                }
                            } finally{
                                if (_didIteratorError) {
                                    throw _iteratorError;
                                }
                            }
                        }
                        if (!cell) {
                            highlightColumn = _this.context.allColumnKeys.find(function(k) {
                                return !!errColumuKeys[k];
                            });
                        }
                    }
                    // 没有任意列被标记为错误, 单元格验证时, 清理单元格错误,  行验证时, 清理行错误
                    if (!highlightColumn) {
                        if (cell) {
                            cellError.delete(cell.column.key);
                        } else if (!errors) {
                            cellError.clear();
                        }
                    }
                    if (isTruthyOrZero(highlightColumn)) {
                        var highlightCell = cell || _this.table.getCell(row.key, highlightColumn);
                        _this.table.highlight(highlightCell.key);
                        _this.table.selectCells(highlightCell.key);
                    }
                    return res;
                });
            }
        }
    ]);
    return _MixinVerify;
}();
