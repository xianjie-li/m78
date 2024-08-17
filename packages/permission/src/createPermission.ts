import { PermissionCreator } from "./types.js";
import { permissionImpl } from "./common.js";

const _createPermission = ((conf) => permissionImpl(conf)) as PermissionCreator;

export { _createPermission };
