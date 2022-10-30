import _define_property from "@swc/helpers/src/_define_property.mjs";
import _object_spread from "@swc/helpers/src/_object_spread.mjs";
import create from "@m78/seed";
import { create as createPermission } from "./index";
import { PERMISSION_PRO_NAME, permissionProValidatorGetter } from "./common";
var _createPermissionPro = function(config) {
    var _config = _object_spread({
        permission: {}
    }, config);
    var seed = _config.seed;
    if (!seed) seed = create();
    seed.set({
        permission: _config.permission,
        meta: _config.meta
    });
    var permission = createPermission({
        seed: seed,
        validators: _define_property({}, PERMISSION_PRO_NAME, permissionProValidatorGetter())
    });
    var pro = {
        check: function(keys) {
            var vm = permission([
                PERMISSION_PRO_NAME
            ], {
                extra: keys
            });
            return (vm === null || vm === void 0 ? void 0 : vm.length) ? vm[0] : null;
        },
        seed: seed,
        permission: permission
    };
    return pro;
};
export { _createPermissionPro };
