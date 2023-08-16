import React from "react";
import { Overlay } from "../../src/overlay/index.js";

import { Button } from "../../src/button/index.js";
import { TriggerType } from "../../src/index.js";

const Play = () => {
  return (
    <div>
      <Overlay
        triggerType={TriggerType.click}
        childrenAsTarget
        direction="bottom"
        content={<div className="p-24">内容内容</div>}
      >
        <Button>drag click</Button>
      </Overlay>
      <Overlay
        defaultOpen
        triggerType={TriggerType.active}
        childrenAsTarget
        direction="bottom"
        content={<div className="p-24">内容内容</div>}
      >
        <Button>active</Button>
      </Overlay>

      <Overlay
        triggerType={TriggerType.click}
        childrenAsTarget
        open
        direction="bottom"
        clickAwayClosable={false}
        content={<div className="p-24">内容内容</div>}
      >
        <Button>click</Button>
      </Overlay>
    </div>
  );
};

export default Play;
