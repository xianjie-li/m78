import { _ as _define_property } from "@swc/helpers/_/_define_property";
export var _ErrorCode;
(function(_ErrorCode) {
    _ErrorCode[_ErrorCode["HANDLE_NOT_REGISTER"] = 0] = "HANDLE_NOT_REGISTER";
    _ErrorCode[_ErrorCode["NOT_WORKER"] = 1] = "NOT_WORKER";
    _ErrorCode[_ErrorCode["HANDLE_INVOKE_FAIL"] = 2] = "HANDLE_INVOKE_FAIL";
    _ErrorCode[_ErrorCode["CREATE_WORKER_FAIL"] = 3] = "CREATE_WORKER_FAIL";
    _ErrorCode[_ErrorCode["HAS_LOADER_ERROR"] = 4] = "HAS_LOADER_ERROR";
    _ErrorCode[_ErrorCode["ONLY_MAIN"] = 5] = "ONLY_MAIN";
})(_ErrorCode || (_ErrorCode = {}));
var _obj;
export var _ErrorMessages = (_obj = {}, _define_property(_obj, 0, "Handle not register"), _define_property(_obj, 1, "Worker not created or failed to create"), _define_property(_obj, 2, "Handle invoke fail"), _define_property(_obj, 3, "Failed to create worker, will use main thread to execute handle"), _define_property(_obj, 4, "An error occurred during the loader"), _define_property(_obj, 5, "Only allowed to use on main thread"), _obj);
export var _InnerHandlers;
(function(_InnerHandlers) {
    _InnerHandlers["init"] = "__M78_WORKER_INIT__";
})(_InnerHandlers || (_InnerHandlers = {}));
