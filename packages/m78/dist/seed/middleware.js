import { _createUseState } from "./create-use-state";
import { _createState } from "./create-state";
export var insideMiddleware = function(bonus) {
    if (bonus.init) {
        return bonus.config;
    }
    var useState = _createUseState(bonus.apis);
    bonus.apis.useState = useState;
    bonus.apis.State = _createState(bonus.apis, useState);
};
