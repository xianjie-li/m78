import React, { useState } from "react";
import { Button } from "../../src/button/index.js";
import { Overlay } from "../../src/overlay/index.js";
import { TriggerType } from "@m78/trigger";

const OverlayExample = () => {
  const [type, setType] = useState<TriggerType>(TriggerType.click);

  return (
    <div>
      <Overlay
        triggerType={type}
        transitionType="fade"
        onChange={(open) => {
          const next = open ? "active" : "click";
          if (next === type) return;
          setType(next as any);
        }}
        content={
          <div style={{ width: 100, background: "#fff" }} className="p-12">
            内容
            <div>
              <Overlay
                triggerType={TriggerType.active}
                transitionType="fade"
                content={
                  <div
                    style={{ width: 100, height: 80, background: "#fff" }}
                    className="p-12"
                  >
                    内容2
                  </div>
                }
                direction="rightStart"
                childrenAsTarget
              >
                <Button>btn2</Button>
              </Overlay>
            </div>
            <div>
              <Overlay
                triggerType={TriggerType.active}
                transitionType="fade"
                content={
                  <div
                    style={{ width: 100, background: "#fff" }}
                    className="p-12"
                  >
                    内容2
                    <div>
                      <Overlay
                        triggerType={TriggerType.active}
                        transitionType="fade"
                        content={
                          <div
                            style={{
                              width: 100,
                              height: 80,
                              background: "#fff",
                            }}
                            className="p-12"
                          >
                            内容2-1
                          </div>
                        }
                        direction="rightStart"
                        childrenAsTarget
                      >
                        <Button>btn2</Button>
                      </Overlay>
                    </div>
                    <div>
                      <Overlay
                        triggerType={TriggerType.active}
                        transitionType="fade"
                        content={
                          <div
                            style={{
                              width: 100,
                              height: 80,
                              background: "#fff",
                            }}
                            className="p-12"
                          >
                            内容2-2
                          </div>
                        }
                        direction="rightStart"
                        childrenAsTarget
                      >
                        <Button>btn3</Button>
                      </Overlay>
                    </div>
                  </div>
                }
                direction="rightStart"
                childrenAsTarget
              >
                <Button>btn3</Button>
              </Overlay>
            </div>
          </div>
        }
        direction="rightStart"
        childrenAsTarget
      >
        <Button>btn1 {type}</Button>
      </Overlay>
    </div>
  );
};

export default OverlayExample;
