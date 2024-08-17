import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
import { Response } from "../response.js";
import { ResponseError } from "../response-error.js";
import qs from "query-string";
/** Fetch adapter */ export function fetchAdapter(opt) {
    return fetch("".concat(opt.url).concat(qs.stringify((opt === null || opt === void 0 ? void 0 : opt.query) || {})), opt).then(function() {
        var _ref = _async_to_generator(function(res) {
            var response, h, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _step_value, k, v, type;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        response = new Response();
                        response.message = res.statusText;
                        response.code = res.status;
                        h = {};
                        _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                        try {
                            for(_iterator = res.headers.entries()[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                                _step_value = _sliced_to_array(_step.value, 2), k = _step_value[0], v = _step_value[1];
                                h[k] = v;
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
                        response.headers = h;
                        type = h["content-type"] || h["Content-Type"];
                        if (!type.includes("application/json")) return [
                            3,
                            2
                        ];
                        return [
                            4,
                            res.json()
                        ];
                    case 1:
                        response.data = _state.sent();
                        _state.label = 2;
                    case 2:
                        if (!type.includes("text/")) return [
                            3,
                            4
                        ];
                        return [
                            4,
                            res.text()
                        ];
                    case 3:
                        response.data = _state.sent();
                        _state.label = 4;
                    case 4:
                        response.original = res;
                        return [
                            2,
                            response
                        ];
                }
            });
        });
        return function(res) {
            return _ref.apply(this, arguments);
        };
    }()).catch(function(err) {
        var msg = "";
        if (err.name || err.message) {
            msg = "".concat(err.name || "", ": ").concat(err.message || "");
        }
        return Promise.reject(new ResponseError(msg));
    });
}
