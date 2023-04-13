import "../common/init/index.js";
import "./index.scss";

import { _Overlay as Overlay } from "./overlay.js";
import { _DragHandle as OverlayDragHandle } from "./drag-handle.js";
import {
  useOverlaysClickAway,
  useOverlaysMask,
  overlayTransitionConfig,
  getOverlayApiProps,
} from "./common.js";

export * from "./types.js";

export {
  Overlay,
  useOverlaysClickAway,
  useOverlaysMask,
  overlayTransitionConfig,
  getOverlayApiProps,
  OverlayDragHandle,
};
