import { _createUseState } from "./create-use-state.js";
import { _createState } from "./create-state.js";
export var _insideMiddleware = function(bonus) {
    if (bonus.init) {
        return bonus.config;
    }
    var useState = _createUseState(bonus.apis);
    bonus.apis.useState = useState;
    bonus.apis.State = _createState(bonus.apis, useState);
};
