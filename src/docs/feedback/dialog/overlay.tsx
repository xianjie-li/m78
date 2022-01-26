import React from 'react';
import { Dialog } from 'm78/dialog';
import { OverlayDirectionEnum } from 'm78/overlay';
import { Button } from 'm78/button';
import { TransitionTypeEnum } from 'm78/transition';

const Overlay = () => {
  return (
    <div>
      <Dialog
        content={<div>在触发位置出现的dialog</div>}
        childrenAsTarget
        direction={OverlayDirectionEnum.bottomStart}
      >
        <Button md>在触发位置出现的dialog</Button>
      </Dialog>

      <Dialog content={<div>通过xy控制位置</div>} xy={[150, 150]}>
        <Button>通过xy控制位置</Button>
      </Dialog>

      <Dialog content={<div>通过alignment控制位置</div>} alignment={[1, 1]}>
        <Button>通过alignment控制位置</Button>
      </Dialog>

      <Dialog content={<div>动画 slideTop</div>} transitionType={TransitionTypeEnum.slideTop}>
        <Button>动画 slideTop</Button>
      </Dialog>

      <Dialog content={<div>动画 punch</div>} transitionType={TransitionTypeEnum.punch}>
        <Button>动画 punch</Button>
      </Dialog>
    </div>
  );
};

export default Overlay;
