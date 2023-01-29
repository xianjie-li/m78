import "../common/init/index.js";
import "./index.scss";

import {
  _If as If,
  _Toggle as Toggle,
  _Switch as Switch,
  _AsyncRender as AsyncRender,
} from "./fork.js";

export * from "./types.js";
export { If, Toggle, Switch, AsyncRender };
