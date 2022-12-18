import "../common/init/index.js";
import "./index.scss";

import { _notify, _loading, _quickers } from "./notify.js";

export const notify = Object.assign(
  _notify,
  {
    loading: _loading,
  },
  _quickers
);

export * from "./types.js";
