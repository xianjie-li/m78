import _object_spread from "@swc/helpers/src/_object_spread.mjs";
import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import _to_consumable_array from "@swc/helpers/src/_to_consumable_array.mjs";
import { ensureArray, isArray, isFunction, isObject } from "@m78/utils";
import { _ANY_NAME_PLACE_HOLD } from "./common.js";
export function _implSchema(ctx) {
    var schemaBaseClone = /** 对Schema上的dynamic进行处理, 并克隆validator */ function schemaBaseClone(schema) {
        if (isFunction(schema.dynamic)) {
            var dProps = schema.dynamic(instance);
            if (isObject(dProps)) Object.assign(schema, dProps);
        }
        // 在这这里对一些可能会被以外更改的引用值进行手动克隆
        if (schema.validator) {
            schema.validator = _to_consumable_array(ensureArray(schema.validator));
        }
    };
    var instance = ctx.instance;
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
    instance.getSchemas = function() {
        var ref = _sliced_to_array(ctx.getFormatterSchemas(), 1), schemas = ref[0];
        return schemas;
    };
    instance.getSchema = function(name) {
        var sc = null;
        function recursionGetSchema(schema, name) {
            var ref;
            if (!name.length) {
                sc = _object_spread({}, schema);
                return;
            }
            if ((ref = schema.schema) === null || ref === void 0 ? void 0 : ref.length) {
                var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                try {
                    for(var _iterator = schema.schema[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                        var sc1 = _step.value;
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
            if (schema.eachSchema) {
                recursionGetSchema(schema.eachSchema, name.slice(1));
                return;
            }
        }
        recursionGetSchema(ctx.schema, ensureArray(name));
        if (sc) {
            schemaBaseClone(sc);
        }
        return sc;
    };
    instance.setSchemas = function(schema) {
        ctx.schema = schema;
        if (!ctx.lockNotify) {
            instance.events.update.emit();
        }
        instance.verify().catch(function() {});
    };
    /** 递归一个schema, 处理其所有项的dynamic/invalid/list并对每一项进行拷贝 */ function recursionHandleSchemas(args) {
        var schema = args.schema, parentNames = args.parentNames, invalidCB = args.invalidCB, _isRoot = args.isRoot, isRoot = _isRoot === void 0 ? false : _isRoot;
        var combine = Object.assign({}, schema);
        var hasName = "name" in combine;
        if (isArray(combine.eachSchema) && hasName) {
            // @ts-ignore
            delete combine.name;
            hasName = false;
        }
        var names = _to_consumable_array(ensureArray(parentNames));
        schemaBaseClone(combine);
        if (!isRoot) {
            if (hasName) {
                names.push(combine.name);
            } else {
                names.push(_ANY_NAME_PLACE_HOLD);
            }
        }
        // let extraValid: undefined | boolean;
        // if (isFunction(config.extraValidGetter)) {
        //   const extra = config.extraValidGetter(combine);
        //   if (isBoolean(extra) && !extra) {
        //     extraValid = false;
        //   }
        // }
        if (hasName && combine.valid === false) {
            invalidCB(names);
        }
        // 无效schema的子级视为无效
        if (combine.valid === false) {
            return;
        }
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
