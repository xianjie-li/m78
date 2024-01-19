import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
import { _ as _to_consumable_array } from "@swc/helpers/_/_to_consumable_array";
import { ensureArray, getNamePathValue, isArray, isEmpty, isFunction, isObject, setNamePathValue } from "@m78/utils";
export function _implSchema(ctx) {
    var instance = ctx.instance;
    instance.getSchemas = function() {
        var _ctx_getFormatterSchemas = _sliced_to_array(ctx.getFormatterSchemas(), 1), schemas = _ctx_getFormatterSchemas[0];
        return schemas;
    };
    instance.getSchema = function(name) {
        var opt = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        var _ctx_getFormatterSchema = _sliced_to_array(ctx.getFormatterSchema(name, opt.skipChildren, opt.withoutProcess), 1), schema = _ctx_getFormatterSchema[0];
        return schema;
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
    ctx.schemaSpecialPropsHandle = function(schema, namePath, skipEachSchema) {
        // # 处理dynamic, 若包含eachSchema处理这跳过, 应交于生成后的.schema处理
        if (isFunction(schema.dynamic)) {
            var dProps = schema.dynamic({
                form: instance,
                namePath: namePath
            });
            if (isObject(dProps)) Object.assign(schema, dProps);
        }
        var eachSchema = schema.eachSchema;
        // # 处理eachSchema
        // 通过当前值遍历生成 schema list
        // schema.valid 为 false 或主动不处理时跳过
        if (!skipEachSchema && schema.valid !== false && !isEmpty(eachSchema)) {
            var curValue = getNamePathValue(ctx.values, namePath);
            // 作为数组且有对应项时
            if (isArray(curValue) && curValue.length) {
                schema.schema = curValue.map(function(i, ind) {
                    return Object.assign({
                        name: ind
                    }, eachSchema);
                });
            }
            // 作为对象且不为空对象时
            if (isObject(curValue) && !isEmpty(curValue)) {
                schema.schema = Object.keys(curValue).map(function(key) {
                    return Object.assign({
                        name: key
                    }, eachSchema);
                });
            }
        }
        // 在这这里对一些可能会被意外更改的引用值进行手动克隆,
        if (schema.validator) {
            schema.validator = _to_consumable_array(ensureArray(schema.validator));
        }
        // 清理特殊处理后的项
        delete schema.dynamic;
        delete schema.eachSchema;
    };
    /** 递归一个schema, 处理其所有项的dynamic/eachSchema/invalid/list并对每一项进行拷贝 */ function recursionHandleSchemas(args) {
        var schema = args.schema, parentNames = args.parentNames, invalidCB = args.invalidCB, _args_isRoot = args.isRoot, isRoot = _args_isRoot === void 0 ? false : _args_isRoot, returnInvalid = args.returnInvalid, skipChildren = args.skipChildren;
        // 复制
        var combine = Object.assign({}, schema);
        var hasName = "name" in combine;
        var names = ensureArray(parentNames).slice();
        // 非根选项且不包含name的项忽略
        // 无name的情况:
        // - eachSchema 项经过处理前不会直接传入当前函数
        if (!isRoot && !hasName) return;
        // 添加当前name
        hasName && names.push(combine.name);
        // 处理dynamic / eachSchema 等
        ctx.schemaSpecialPropsHandle(combine, names, skipChildren);
        // 无效schema的子级视为无效, 不再做处理
        if (combine.valid === false) {
            invalidCB === null || invalidCB === void 0 ? void 0 : invalidCB(names);
            return returnInvalid ? combine : undefined;
        }
        // 包含schema子项时, 对子项进行相同的处理
        if (!skipChildren && combine.schema && combine.schema.length) {
            combine.schema = combine.schema.map(function(s) {
                return recursionHandleSchemas({
                    schema: s,
                    parentNames: names,
                    invalidCB: invalidCB
                });
            }).filter(function(i) {
                return !!i;
            });
            // 处理后无有效选项时直接移除
            if (!combine.schema.length) {
                delete combine.schema;
            }
        }
        return combine;
    }
    ctx.getFormatterSchema = function(name) {
        var skipChildren = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true, withoutProcess = arguments.length > 2 ? arguments[2] : void 0;
        // 所有invalid项的name
        var invalidNames = [];
        var sc = undefined;
        var arrName = ensureArray(name).slice();
        if (!arrName.length) return [
            null,
            invalidNames
        ];
        // 递归获取指定schema
        function recursionGetSchema(schema, na) {
            var _schema_schema;
            // 长度用尽, 完成匹配
            if (!na.length) {
                sc = Object.assign({}, schema);
                return;
            }
            // 从schema子项查找
            if ((_schema_schema = schema.schema) === null || _schema_schema === void 0 ? void 0 : _schema_schema.length) {
                var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                try {
                    for(var _iterator = schema.schema[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                        var sc1 = _step.value;
                        // 子项是否有匹配的, 有则继续向下查找
                        if (sc1.name === na[0]) {
                            recursionGetSchema(sc1, na.slice(1));
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
            // 从eachSchema子项查找
            if (schema.eachSchema) {
                recursionGetSchema(schema.eachSchema, na.slice(1));
                return;
            }
        // 无匹配
        }
        recursionGetSchema(ctx.schema, arrName);
        if (sc === undefined) return [
            null,
            invalidNames
        ];
        var existSc = sc;
        // 当前名称
        var curName = arrName.pop();
        if (!("name" in sc)) setNamePathValue(existSc, "name", curName);
        if (withoutProcess) return [
            sc,
            invalidNames
        ];
        var processed = recursionHandleSchemas({
            schema: sc,
            parentNames: arrName,
            invalidCB: function invalidCB(n) {
                invalidNames.push(n);
            },
            returnInvalid: true,
            skipChildren: skipChildren
        });
        return [
            processed || null,
            invalidNames
        ];
    };
}
