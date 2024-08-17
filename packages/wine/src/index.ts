import create from "@m78/render-api";
import { WineInstance, WineState } from "./types.js";
import { keypressAndClick } from "@m78/utils";
import { renderBuiltInHeader } from "./render.js";

import { DEFAULT_PROPS, NAME_SPACE } from "./consts.js";
import WineImpl from "./wine-impl.js";

import "./style.css";

const Wine = create<WineState, WineInstance>({
  component: WineImpl,
  defaultState: DEFAULT_PROPS,
  namespace: NAME_SPACE,
});

export { keypressAndClick, renderBuiltInHeader };
export * from "./types.js";
export default Wine;
