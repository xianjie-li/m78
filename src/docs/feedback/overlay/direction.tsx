import React from 'react';
import { Overlay, OverlayDirectionEnum } from 'm78/overlay';
import { UseTriggerTypeEnum } from 'm78/hooks';
import { Button } from 'm78/button';

const Direction = () => {
  return (
    <div>
      <div style={{ position: 'relative', width: 500, height: 240 }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', textAlign: 'center' }}>
          <Overlay
            arrow
            direction={OverlayDirectionEnum.topStart}
            triggerType={UseTriggerTypeEnum.active}
            content={<div style={{ padding: 16, fontSize: 16 }}>topStart</div>}
            childrenAsTarget
          >
            <Button>topStart</Button>
          </Overlay>
          <Overlay
            arrow
            direction={OverlayDirectionEnum.top}
            triggerType={UseTriggerTypeEnum.active}
            content={<div style={{ padding: 16, fontSize: 16 }}>top</div>}
            childrenAsTarget
          >
            <Button>top</Button>
          </Overlay>
          <Overlay
            arrow
            direction={OverlayDirectionEnum.topEnd}
            triggerType={UseTriggerTypeEnum.active}
            content={<div style={{ padding: 16, fontSize: 16 }}>topEnd</div>}
            childrenAsTarget
          >
            <Button>topEnd</Button>
          </Overlay>
        </div>

        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 32,
            width: 140,
            textAlign: 'right',
            lineHeight: 3.2,
          }}
        >
          <Overlay
            arrow
            direction={OverlayDirectionEnum.rightStart}
            triggerType={UseTriggerTypeEnum.active}
            content={<div style={{ padding: 16, fontSize: 16 }}>rightStart</div>}
            childrenAsTarget
          >
            <Button>rightStart</Button>
          </Overlay>
          <Overlay
            arrow
            direction={OverlayDirectionEnum.right}
            triggerType={UseTriggerTypeEnum.active}
            content={<div style={{ padding: 16, fontSize: 16 }}>right</div>}
            childrenAsTarget
          >
            <Button>right</Button>
          </Overlay>
          <Overlay
            arrow
            direction={OverlayDirectionEnum.rightEnd}
            triggerType={UseTriggerTypeEnum.active}
            content={<div style={{ padding: 16, fontSize: 16 }}>rightEnd</div>}
            childrenAsTarget
          >
            <Button>rightEnd</Button>
          </Overlay>
        </div>

        <div
          style={{ position: 'absolute', bottom: 32, left: 0, width: '100%', textAlign: 'center' }}
        >
          <Overlay
            arrow
            direction={OverlayDirectionEnum.bottomStart}
            triggerType={UseTriggerTypeEnum.active}
            content={<div style={{ padding: 16, fontSize: 16 }}>bottomStart</div>}
            childrenAsTarget
          >
            <Button>bottomStart</Button>
          </Overlay>
          <Overlay
            arrow
            direction={OverlayDirectionEnum.bottom}
            triggerType={UseTriggerTypeEnum.active}
            content={<div style={{ padding: 16, fontSize: 16 }}>bottom</div>}
            childrenAsTarget
          >
            <Button>bottom</Button>
          </Overlay>
          <Overlay
            arrow
            direction={OverlayDirectionEnum.bottomEnd}
            triggerType={UseTriggerTypeEnum.active}
            content={<div style={{ padding: 16, fontSize: 16 }}>bottomEnd</div>}
            childrenAsTarget
          >
            <Button>bottomEnd</Button>
          </Overlay>
        </div>

        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 32,
            width: 120,
            textAlign: 'left',
            lineHeight: 3.2,
          }}
        >
          <Overlay
            arrow
            direction={OverlayDirectionEnum.leftStart}
            triggerType={UseTriggerTypeEnum.active}
            content={<div style={{ padding: 16, fontSize: 16 }}>leftStart</div>}
            childrenAsTarget
          >
            <Button>bottomStart</Button>
          </Overlay>
          <Overlay
            arrow
            direction={OverlayDirectionEnum.left}
            triggerType={UseTriggerTypeEnum.active}
            content={<div style={{ padding: 16, fontSize: 16 }}>left</div>}
            childrenAsTarget
          >
            <Button style={{ margin: 0 }}>left</Button>
          </Overlay>
          <Overlay
            arrow
            direction={OverlayDirectionEnum.leftEnd}
            triggerType={UseTriggerTypeEnum.active}
            content={<div style={{ padding: 16, fontSize: 16 }}>leftEnd</div>}
            childrenAsTarget
          >
            <Button style={{ margin: 0 }}>leftEnd</Button>
          </Overlay>
        </div>
      </div>
    </div>
  );
};

export default Direction;
