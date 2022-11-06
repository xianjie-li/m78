import create from "@m78/render-api";
import { WineInstance, WineState } from "./types";
import { keypressAndClick } from "@m78/utils";
import { renderBuiltInHeader } from "./render";

import { DEFAULT_PROPS, NAME_SPACE } from "./consts";
import WineImpl from "./wine-impl";

import "./style.css";

const Wine = create<WineState, WineInstance>({
  component: WineImpl,
  defaultState: DEFAULT_PROPS,
  namespace: NAME_SPACE,
});

export { keypressAndClick, renderBuiltInHeader };
export * from "./types";
export default Wine;
