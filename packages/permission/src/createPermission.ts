import { PermissionCreator } from "./types";
import { permissionImpl } from "./common";

const _createPermission = ((conf) => permissionImpl(conf)) as PermissionCreator;

export { _createPermission };
