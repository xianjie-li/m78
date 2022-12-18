import "../common/init/index.js";
import "./index.scss";
import { _notify, _loading, _quickers } from "./notify.js";
export var notify = Object.assign(_notify, {
    loading: _loading
}, _quickers);
export * from "./types.js";
