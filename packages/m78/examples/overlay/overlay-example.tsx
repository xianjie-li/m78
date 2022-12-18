import React, { useState } from "react";
import { Button } from "../../src/button";
import {
  DragHandle,
  Overlay,
  OverlayDirection,
  OverlayInstance,
} from "../../src/overlay/index.js";
import { Trigger, UseTriggerType } from "@m78/hooks";
import { getRandRange } from "@m78/utils";

const OverlayExample = () => {
  const [overlay, setOverlay] = useState<OverlayInstance | null>(null);

  const [bound, setBound] = useState({
    left: 300,
    top: 300,
    width: 50,
    height: 50,
  });

  return (
    <div>
      <div className="pb-24">
        <Overlay
          triggerType={[UseTriggerType.click, UseTriggerType.focus]}
          direction={OverlayDirection.top}
          content={
            <div style={{ padding: 8, fontSize: 14 }}>
              点击或聚焦, 表单控件最常用的方式
            </div>
          }
          childrenAsTarget
        >
          <Button>click + focus</Button>
        </Overlay>

        <Overlay
          triggerType={UseTriggerType.click}
          childrenAsTarget
          direction="bottom"
          content={<div className="p-24">内容内容</div>}
        >
          <Button>drag click</Button>
        </Overlay>

        <Overlay
          triggerType={UseTriggerType.click}
          childrenAsTarget
          direction="bottom"
          content={<div className="p-24">内容内容</div>}
        >
          <Button>click</Button>
        </Overlay>

        <Overlay
          triggerType={UseTriggerType.click}
          // childrenAsTarget
          // direction="bottom"
          content={
            <div className="p-24">
              内容内容
              <DragHandle>
                {(bind) => <button {...bind()}>drag me</button>}
              </DragHandle>
            </div>
          }
        >
          <Button>drag click</Button>
        </Overlay>

        <Overlay
          triggerType={UseTriggerType.click}
          childrenAsTarget
          direction="bottom"
          content={
            <div className="p-24">
              内容内容
              <DragHandle>
                {(bind) => <button {...bind()}>drag me</button>}
              </DragHandle>
            </div>
          }
        >
          <Button>drag click</Button>
        </Overlay>

        <Overlay
          target={bound}
          content={
            <div className="p-24">
              内容内容
              <Button
                onClick={() =>
                  setBound({
                    left: getRandRange(0, 500),
                    top: getRandRange(0, 500),
                    width: 50,
                    height: 50,
                  })
                }
              >
                click
              </Button>
            </div>
          }
        >
          <Button>click</Button>
        </Overlay>
      </div>

      <div
        style={{ overflow: "auto", width: 300, height: 300 }}
        className="border"
      >
        <div style={{ padding: 600 }}>
          <Overlay content={<div className="p-24">内容内容</div>}>
            <Button>click</Button>
          </Overlay>
          <Overlay
            content={<div className="p-24 bg-cyan">内容内容</div>}
            childrenAsTarget
            open
            clickAwayClosable={false}
            direction="bottom"
            transitionType="fade"
          >
            <Button>click</Button>
          </Overlay>
        </div>
      </div>

      <Overlay
        instanceRef={(ref) => {
          setOverlay(ref);
        }}
        content={<span className="p-12">hello overlay</span>}
        direction="top"
        autoFocus={false}
      />

      <div className="mt-12">
        <Trigger type={[UseTriggerType.click]} onTrigger={overlay?.trigger}>
          <Button>click</Button>
        </Trigger>
        <Trigger type={[UseTriggerType.active]} onTrigger={overlay?.trigger}>
          <Button>active</Button>
        </Trigger>
        <Trigger type={[UseTriggerType.active]} onTrigger={overlay?.trigger}>
          <Button>active</Button>
        </Trigger>
        <Trigger type={[UseTriggerType.focus]} onTrigger={overlay?.trigger}>
          <Button>focus</Button>
        </Trigger>
        <Trigger
          type={[UseTriggerType.focus, UseTriggerType.click]}
          onTrigger={overlay?.trigger}
        >
          <Button>focus + click</Button>
        </Trigger>

        {/*<Trigger*/}
        {/*  type={[UseTriggerType.focus, UseTriggerType.click]}*/}
        {/*  onTrigger={triggerHandle}*/}
        {/*>*/}
        {/*  <Button>focus + click</Button>*/}
        {/*</Trigger>*/}

        <Trigger
          type={[UseTriggerType.contextMenu]}
          onTrigger={overlay?.trigger}
        >
          <Button>contextMenu</Button>
        </Trigger>

        {/*<Trigger*/}
        {/*  type={[UseTriggerType.focus]}*/}
        {/*  onTrigger={(e) => {*/}
        {/*    console.log(e);*/}
        {/*  }}*/}
        {/*>*/}
        {/*  <Button>test</Button>*/}
        {/*</Trigger>*/}
      </div>

      <div className="mt-12">
        <Overlay
          triggerType={UseTriggerType.focus}
          childrenAsTarget
          direction="bottom"
          content={<div className="p-24">内容内容</div>}
        >
          <Button>focus</Button>
        </Overlay>
        <Overlay
          triggerType={UseTriggerType.click}
          childrenAsTarget
          direction="bottom"
          content={<div className="p-24">内容内容</div>}
        >
          <Button>click</Button>
        </Overlay>
      </div>

      <div className="mt-24">
        <Overlay
          content={<div className="p-24">内容内容</div>}
          childrenAsTarget
          direction="top"
        >
          {({ open }) => <Button>click {open.toString()}</Button>}
        </Overlay>
      </div>
    </div>
  );
};

export default OverlayExample;
