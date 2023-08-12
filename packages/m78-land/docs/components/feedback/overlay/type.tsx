import React from "react";
import {
  Overlay,
  OverlayDirection,
  Button,
  TriggerType,
  Divider,
  Size,
} from "m78";

const TypeExample = () => {
  return (
    <div>
      <div className="mt-32">
        <p>触发类型:</p>
        <Overlay
          direction={OverlayDirection.top}
          content={<div style={{ padding: 8, fontSize: 14 }}>通过点击触发</div>}
          childrenAsTarget
        >
          <Button>click</Button>
        </Overlay>

        <Overlay
          triggerType={TriggerType.active}
          direction={OverlayDirection.top}
          content={
            <div style={{ padding: 8, fontSize: 14 }}>
              hover触发, 移动端按住并轻微移动触发
            </div>
          }
          childrenAsTarget
        >
          <Button>active</Button>
        </Overlay>

        <Overlay
          triggerType={TriggerType.focus}
          direction={OverlayDirection.top}
          content={
            <div style={{ padding: 8, fontSize: 14 }}>
              聚焦时出现, 失焦时关闭
            </div>
          }
          childrenAsTarget
        >
          <Button>focus</Button>
        </Overlay>

        <Overlay
          triggerType={TriggerType.contextMenu}
          direction={OverlayDirection.rightStart}
          content={
            <div style={{ padding: 8, fontSize: 14 }}>
              右键触发, 移动端通过长按触发
            </div>
          }
          childrenAsTarget
        >
          <Button>contextMenu(右键)</Button>
        </Overlay>

        <Overlay
          triggerType={TriggerType.move}
          offset={8}
          direction={OverlayDirection.top}
          content={
            <div style={{ padding: 8, fontSize: 14 }}>光标在目标上方移动时</div>
          }
          childrenAsTarget
        >
          <Button size={Size.large} style={{ width: 160 }}>
            move
          </Button>
        </Overlay>

        <p className="mt-32">复合事件:</p>

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
      </div>
    </div>
  );
};

export default TypeExample;
