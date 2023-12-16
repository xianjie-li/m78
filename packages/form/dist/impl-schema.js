import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import _to_consumable_array from "@swc/helpers/src/_to_consumable_array.mjs";
import { ensureArray, isFunction, isObject } from "@m78/utils";
import { _ANY_NAME_PLACE_HOLD } from "./common.js";
export function _implSchema(ctx) {
    var instance = ctx.instance;
    instance.getSchemas = function() {
        var ref = _sliced_to_array(ctx.getFormatterSchemas(), 1), schemas = ref[0];
        return schemas;
    };
    instance.getSchema = function(name) {
        var sc = null;
        // 递归获取指定schema
        function recursionGetSchema(schema, name) {
            var ref;
            // 完成匹配
            if (!name.length) {
                sc = Object.assign({}, schema);
                return;
            }
            if ((ref = schema.schema) === null || ref === void 0 ? void 0 : ref.length) {
                var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                try {
                    for(var _iterator = schema.schema[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                        var sc1 = _step.value;
                        // 子项是否有匹配的, 有则继续向下查找
                        if (sc1.name === name[0]) {
                            recursionGetSchema(sc1, name.slice(1));
                            return;
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
            }
            // eachSchema 直接跳过当前级向下一级匹配
            if (schema.eachSchema) {
                recursionGetSchema(schema.eachSchema, name.slice(1));
                return;
            }
        }
        recursionGetSchema(ctx.schema, ensureArray(name));
        if (sc) {
            ctx.schemaBaseHandleAndClone(sc);
        }
        return sc;
    };
    if (!ctx.verifyOnly) {
        instance.setSchemas = function(schema) {
            ctx.schema = schema;
            if (!ctx.lockNotify) {
                instance.events.update.emit();
            }
        };
    }
    ctx.getFormatterSchemas = function() {
        // 所有invalid项的name
        var invalidNames = [];
        var schemas = recursionHandleSchemas({
            schema: ctx.schema,
            parentNames: [],
            invalidCB: function(name) {
                return invalidNames.push(name);
            },
            isRoot: true
        });
        return [
            schemas,
            invalidNames
        ];
    };
    ctx.schemaBaseHandleAndClone = function(schema) {
        if (isFunction(schema.dynamic)) {
            var dProps = schema.dynamic(instance);
            if (isObject(dProps)) Object.assign(schema, dProps);
        }
        // 在这这里对一些可能会被意外更改的引用值进行手动克隆
        if (schema.validator) {
            schema.validator = _to_consumable_array(ensureArray(schema.validator));
        }
    };
    /** 递归一个schema, 处理其所有项的dynamic/invalid/list并对每一项进行拷贝 */ function recursionHandleSchemas(args) {
        var schema = args.schema, parentNames = args.parentNames, invalidCB = args.invalidCB, _isRoot = args.isRoot, isRoot = _isRoot === void 0 ? false : _isRoot;
        var combine = Object.assign({}, schema);
        var hasName = "name" in combine;
        var names = _to_consumable_array(ensureArray(parentNames));
        ctx.schemaBaseHandleAndClone(combine);
        if (!isRoot) {
            if (hasName) {
                names.push(combine.name);
            } else {
                names.push(_ANY_NAME_PLACE_HOLD);
            }
        }
        if (hasName && combine.valid === false) {
            invalidCB(names);
        }
        // 无效schema的子级视为无效
        if (combine.valid === false) {
            return;
        }
        // 包含schema子项时, 对子项进行相同的处理
        if (combine.schema) {
            combine.schema = combine.schema.map(function(s) {
                return recursionHandleSchemas({
                    schema: s,
                    parentNames: names,
                    invalidCB: invalidCB
                });
            }).filter(function(i) {
                return !!i;
            });
            if (!combine.schema.length) {
                delete combine.schema;
            }
        }
        // 包含eachSchema子项时, 对子项进行相同的处理
        if (combine.eachSchema) {
            combine.eachSchema = recursionHandleSchemas({
                schema: combine.eachSchema,
                parentNames: names,
                invalidCB: invalidCB
            });
            if (!combine.eachSchema) {
                delete combine.eachSchema;
            }
        }
        return combine;
    }
}
