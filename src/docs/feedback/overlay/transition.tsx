import React from 'react';
import { Overlay, OverlayDirectionEnum } from 'm78/overlay';
import { TransitionTypeEnum } from 'm78/transition';
import { Button } from 'm78/button';
import { config } from 'react-spring';

const Transition = () => {
  return (
    <div>
      <div>
        <Overlay
          transitionType={TransitionTypeEnum.fade}
          direction={OverlayDirectionEnum.top}
          childrenAsTarget
          content={<div style={{ padding: 32, fontSize: 32 }}>气泡内容</div>}
        >
          <Button>fade</Button>
        </Overlay>

        <Overlay
          transitionType={TransitionTypeEnum.zoom}
          direction={OverlayDirectionEnum.top}
          childrenAsTarget
          content={<div style={{ padding: 32, fontSize: 32 }}>气泡内容</div>}
        >
          <Button>zoom</Button>
        </Overlay>

        <Overlay
          transitionType={TransitionTypeEnum.punch}
          direction={OverlayDirectionEnum.top}
          childrenAsTarget
          content={<div style={{ padding: 32, fontSize: 32 }}>气泡内容</div>}
        >
          <Button>punch</Button>
        </Overlay>

        <Overlay
          transitionType={TransitionTypeEnum.slideLeft}
          direction={OverlayDirectionEnum.top}
          childrenAsTarget
          content={<div style={{ padding: 32, fontSize: 32 }}>气泡内容</div>}
        >
          <Button>slideLeft</Button>
        </Overlay>

        <Overlay
          transitionType={TransitionTypeEnum.slideRight}
          direction={OverlayDirectionEnum.top}
          childrenAsTarget
          content={<div style={{ padding: 32, fontSize: 32 }}>气泡内容</div>}
        >
          <Button>slideRight</Button>
        </Overlay>

        <Overlay
          transitionType={TransitionTypeEnum.slideTop}
          direction={OverlayDirectionEnum.top}
          childrenAsTarget
          content={<div style={{ padding: 32, fontSize: 32 }}>气泡内容</div>}
        >
          <Button>slideTop</Button>
        </Overlay>

        <Overlay
          transitionType={TransitionTypeEnum.slideBottom}
          direction={OverlayDirectionEnum.top}
          childrenAsTarget
          content={<div style={{ padding: 32, fontSize: 32 }}>气泡内容</div>}
        >
          <Button>slideBottom</Button>
        </Overlay>

        <Overlay
          transitionType={TransitionTypeEnum.bounce}
          direction={OverlayDirectionEnum.top}
          childrenAsTarget
          content={<div style={{ padding: 32, fontSize: 32 }}>气泡内容</div>}
        >
          <Button>bounce</Button>
        </Overlay>
      </div>

      <div className="mt-32">
        <Overlay
          springProps={{
            config: config.wobbly,
          }}
          transitionType={TransitionTypeEnum.bounce}
          direction={OverlayDirectionEnum.top}
          childrenAsTarget
          content={<div style={{ padding: 32, fontSize: 32 }}>气泡内容</div>}
        >
          <Button>自定义动画行为</Button>
        </Overlay>
      </div>
    </div>
  );
};

export default Transition;
