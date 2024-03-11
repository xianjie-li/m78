import { _ as _to_consumable_array } from "@swc/helpers/_/_to_consumable_array";
import { ensureArray, getNamePathValue, isArray, isEmpty, isFunction, isObject, stringifyNamePath } from "@m78/utils";
export function _implSchema(ctx) {
    var instance = ctx.instance;
    instance.getSchemas = function() {
        if (ctx.cacheSchema) return ctx.cacheSchema;
        // 所有invalid项的name
        var invalidNames = [];
        var schemasFlat = new Map();
        var ret = {
            schemas: {},
            invalidNames: invalidNames,
            schemasFlat: schemasFlat
        };
        // 提前设置, 部分场景会需要在dynamic中提前访问缓存
        ctx.cacheSchema = ret;
        ret.schemas = recursionHandleSchemas({
            schema: ctx.schema,
            parentNames: [],
            invalidCB: function(name) {
                return invalidNames.push(name);
            },
            eachCB: function(name, sc) {
                var sName = stringifyNamePath(name);
                schemasFlat.set(sName, sc);
            },
            isRoot: true
        });
        return ret;
    };
    instance.getSchema = function(name) {
        var schemasFlat = instance.getSchemas().schemasFlat;
        return schemasFlat.get(stringifyNamePath(name)) || null;
    };
    instance.setSchemas = function(schema) {
        ctx.schema = isArray(schema) ? {
            schemas: schema
        } : schema;
        ctx.cacheSchema = null;
        if (!ctx.verifyOnly && !ctx.lockNotify) {
            instance.events.update.emit();
        }
    };
    /**
   * 对Schema上的dynamic/eachSchema/validator进行处理, namePath为当前schema的name, skipEachSchema为true时, 不处理eachSchema
   *
   * 处理流程:
   * - 处理当前 schema 的 dynamic 选项, 并用 dynamic 返回的选项合并到当前schema
   * - 处理eachSchema, 根据当前对应值的类型(数组/对象)为当前schema生成schema子配置
   * - 克隆validator, 并确保其为一个数组
   *
   * 该方法直接对原对象进行读写, 处理后的schema不再包含dynamic/eachSchema配置
   * */ var schemaSpecialPropsHandle = function(schema, namePath, skipEachSchema) {
        // # 处理dynamic, 若包含eachSchema处理则跳过, 应交于生成后的.schema处理
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
        if (!skipEachSchema && !isEmpty(eachSchema)) {
            var curValue = getNamePathValue(ctx.values, namePath);
            // 作为数组且有对应项时
            if (isArray(curValue) && curValue.length) {
                schema.schemas = curValue.map(function(i, ind) {
                    return Object.assign({
                        name: ind
                    }, eachSchema);
                });
            }
            // 作为对象且不为空对象时
            if (isObject(curValue) && !isEmpty(curValue)) {
                schema.schemas = Object.keys(curValue).map(function(key) {
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
        var schema = args.schema, parentNames = args.parentNames, invalidCB = args.invalidCB, eachCB = args.eachCB, _args_isRoot = args.isRoot, isRoot = _args_isRoot === void 0 ? false : _args_isRoot, skipChildren = args.skipChildren;
        // 复制
        var combine = Object.assign({}, schema);
        var hasName = "name" in combine;
        var names = ensureArray(parentNames).slice();
        if (!isRoot) {
            // 非根选项且不包含name的项忽略
            // 无name的情况:
            // - eachSchema 项经过处理前不会直接传入当前函数, 可直接忽略
            if (!hasName) return combine;
            else names.push(combine.name);
        }
        // 处理dynamic / eachSchema 等
        schemaSpecialPropsHandle(combine, names, skipChildren);
        // 对处理后的combine执行 eachCB
        if (!isRoot) eachCB === null || eachCB === void 0 ? void 0 : eachCB(names, combine);
        if (combine.valid === false) {
            invalidCB === null || invalidCB === void 0 ? void 0 : invalidCB(names);
        //  return returnInvalid ? combine : undefined; // update: 添加schema缓存机制后, 不再跳过invalid项的子项
        }
        // 包含schema子项时, 对子项进行相同的处理
        if (!skipChildren && combine.schemas && combine.schemas.length) {
            combine.schemas = combine.schemas.map(function(s) {
                return recursionHandleSchemas({
                    schema: s,
                    parentNames: names,
                    invalidCB: invalidCB,
                    eachCB: eachCB
                });
            }).filter(function(i) {
                return !!i;
            });
            // 处理后无有效选项时直接移除
            if (!combine.schemas.length) {
                delete combine.schemas;
            }
        }
        return combine;
    }
}
