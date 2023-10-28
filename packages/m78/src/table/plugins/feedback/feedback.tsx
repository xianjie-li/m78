import { RCTablePlugin } from "../../plugin.js";
import React from "react";
import { _Feedback } from "./feedback-component.js";

export class _FeedBackPlugin extends RCTablePlugin {
  rcExtraRender(): React.ReactNode {
    return <_Feedback />;
  }
}
