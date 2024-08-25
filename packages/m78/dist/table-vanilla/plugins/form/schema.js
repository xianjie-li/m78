import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { stringifyNamePath } from "@m78/utils";
export var _MixinSchema = /*#__PURE__*/ function() {
    "use strict";
    function _MixinSchema() {
        _class_call_check(this, _MixinSchema);
    }
    _create_class(_MixinSchema, [
        {
            // 获取指定行的schemas信息, 没有则创建, 可传入update来主动更新
            key: "getSchemas",
            value: function getSchemas(row) {
                var _this = this;
                var update = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
                var _row = this.table.isRowLike(row) ? row : this.table.getRow(row);
                if (!update) {
                    var cache = this.schemaDatas.get(_row.key);
                    if (cache) return cache;
                }
                var verify = this.getVerify();
                return verify.withValues(_row.data, function() {
                    var _verify_getSchemas = verify.getSchemas(), schemas = _verify_getSchemas.schemas, invalidNames = _verify_getSchemas.invalidNames, schemasFlat = _verify_getSchemas.schemasFlat;
                    var invalid = new Map();
                    invalidNames.forEach(function(k) {
                        return invalid.set(stringifyNamePath(k), true);
                    });
                    var data = {
                        schemas: schemas.schemas || [],
                        rootSchema: schemas,
                        invalid: invalid,
                        invalidNames: invalidNames,
                        schemasFlat: schemasFlat
                    };
                    _this.schemaDatas.set(_row.key, data);
                    return data;
                });
            }
        }
    ]);
    return _MixinSchema;
}();
