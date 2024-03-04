import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
import { M78Worker } from "@m78/worker";
/** 在内部组件中共享的worker, 用于执行某些可能导致阻塞的耗时操作 */ var __worker = new M78Worker({
    url: import.meta.url,
    workerNum: 2,
    handleLoader: function handleLoader() {
        return _async_to_generator(function() {
            var _ref, tableHandles;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        return [
                            4,
                            Promise.all([
                                import("../../table-vanilla/worker-handlers.js")
                            ])
                        ];
                    case 1:
                        _ref = _sliced_to_array.apply(void 0, [
                            _state.sent(),
                            1
                        ]), tableHandles = _ref[0];
                        console.log(tableHandles);
                        return [
                            2,
                            Object.assign({}, tableHandles)
                        ];
                }
            });
        })();
    },
    name: "m78-component-worker"
});
export { __worker };
