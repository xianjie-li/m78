import React, { ReactElement, useState } from "react";
import { Button } from "../../src/button/index.js";
import {
  OverlayDragHandle,
  Overlay,
  OverlayDirection,
  OverlayInstance,
} from "../../src/overlay/index.js";
import { getRandRange } from "@m78/utils";
import { TriggerType } from "@m78/trigger";
import { Trigger } from "@m78/trigger/react/trigger.js";
import { Divider } from "../../src/layout/index.js";

const OverlayExample = () => {
  const [overlay, setOverlay] = useState<OverlayInstance | null>(null);

  const [bound, setBound] = useState({
    left: 300,
    top: 300,
    width: 50,
    height: 50,
  });

  const [singleCont, setSingleCont] = useState<ReactElement | null>(null);

  return (
    <div>
      <div className="pb-24">
        <Overlay
          triggerType={[TriggerType.click, TriggerType.focus]}
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
          triggerType={TriggerType.click}
          childrenAsTarget
          direction="bottom"
          content={<div className="p-24">内容内容</div>}
        >
          <Button>click</Button>
        </Overlay>

        <Overlay
          triggerType={TriggerType.click}
          // childrenAsTarget
          // direction="bottom"
          content={
            <div className="p-24">
              内容内容
              <OverlayDragHandle>
                {(bind) => <button {...bind()}>drag me</button>}
              </OverlayDragHandle>
            </div>
          }
        >
          <Button>drag</Button>
        </Overlay>

        <Overlay
          triggerType={TriggerType.click}
          childrenAsTarget
          direction="bottom"
          content={
            <div className="p-24">
              内容内容
              <OverlayDragHandle>
                {(bind) => <button {...bind()}>drag me</button>}
              </OverlayDragHandle>
            </div>
          }
        >
          <Button>drag + direction</Button>
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
          <Button>随机位置</Button>
        </Overlay>

        <Overlay
          triggerType={TriggerType.contextMenu}
          childrenAsTarget
          direction="rightStart"
          content={<div className="p-24">内容内容</div>}
        >
          <Button>contextMenu</Button>
        </Overlay>

        <Overlay
          triggerType={TriggerType.active}
          childrenAsTarget
          direction="topStart"
          content={<div className="p-24">内容内容</div>}
          offset={8}
        >
          <Button style={{ width: 160 }} size="large">
            active
          </Button>
        </Overlay>

        <Overlay
          triggerType={TriggerType.move}
          childrenAsTarget
          direction="topStart"
          content={<div className="p-24">内容内容</div>}
          offset={8}
        >
          <Button style={{ width: 160 }} size="large">
            move
          </Button>
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
        instanceRef={setOverlay}
        content={<span className="plr-12 ptb-8">{singleCont}</span>}
        direction="top"
        autoFocus={false}
        transitionType="fade"
        offset={6}
        onOpenTrigger={(e) => {
          setSingleCont(e.data.content);
        }}
      />

      <Divider>单实例</Divider>

      {overlay && (
        <div className="mt-12">
          <Trigger
            type={[TriggerType.click]}
            onTrigger={overlay!.trigger}
            data={{
              content: <span>这是内容1111</span>,
            }}
          >
            <Button>
              <span>click</span>44
            </Button>
          </Trigger>
          <Trigger
            type={[TriggerType.active]}
            onTrigger={overlay!.trigger}
            data={{
              content: <span>这是内容22</span>,
            }}
          >
            <Button>active</Button>
          </Trigger>
          <Trigger
            type={[TriggerType.active]}
            onTrigger={overlay!.trigger}
            data={{
              content: <span>这是内容3333</span>,
            }}
          >
            <Button>active</Button>
          </Trigger>
          <Trigger
            type={[TriggerType.focus]}
            onTrigger={overlay!.trigger}
            data={{
              content: <span>这是内容44</span>,
            }}
          >
            <Button>focus</Button>
          </Trigger>
          <Trigger
            type={[TriggerType.focus, TriggerType.click]}
            onTrigger={overlay!.trigger}
            data={{
              content: <span>这是内容5555</span>,
            }}
          >
            <Button>focus + click</Button>
          </Trigger>

          <Trigger
            type={[TriggerType.contextMenu]}
            onTrigger={overlay!.trigger}
            data={{
              content: <span>这是内容66</span>,
            }}
          >
            <Button>contextMenu</Button>
          </Trigger>

          <Trigger
            type={[TriggerType.move]}
            onTrigger={overlay!.trigger}
            data={{
              content: <span>这是内容7777</span>,
            }}
          >
            <Button size="large">move</Button>
          </Trigger>

          <Trigger
            type={[TriggerType.move]}
            onTrigger={overlay!.trigger}
            data={{
              content: <span>这是内容88</span>,
            }}
          >
            <Button size="large">move2</Button>
          </Trigger>

          <Trigger
            type={[TriggerType.move]}
            onTrigger={overlay!.trigger}
            data={{
              content: <span>这是内容9999</span>,
            }}
          >
            <Button size="large">move3</Button>
          </Trigger>
        </div>
      )}

      <Divider />

      <div className="mt-12">
        <Overlay
          triggerType={TriggerType.focus}
          childrenAsTarget
          direction="bottom"
          content={<div className="p-24">内容内容</div>}
        >
          <Button>focus</Button>
        </Overlay>
        <Overlay
          triggerType={TriggerType.click}
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
