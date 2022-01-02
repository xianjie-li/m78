import React from 'react';
import { Overlay, OverlayDirectionEnum } from 'm78/overlay';
import { Button } from 'm78/button';
import sty from './nest.module.scss';

const Nest = () => {
  function renderNest(triggerNode: React.ReactElement, index = 1) {
    if (index >= 5) return null;

    return (
      <Overlay
        direction={OverlayDirectionEnum.rightStart}
        content={
          <div className={sty.list}>
            {renderNest(<div className={sty.listItem}>选项1</div>, index + 1)}
            <div className={sty.listItem}>选项2</div>
            {renderNest(<div className={sty.listItem}>选项3</div>, index + 1)}
            <div className={sty.listItem}>选项4</div>
          </div>
        }
        childrenAsTarget
      >
        {triggerNode}
      </Overlay>
    );
  }

  return (
    <div>
      <Overlay
        direction={OverlayDirectionEnum.top}
        content={
          <div className={sty.list}>
            {renderNest(<div className={sty.listItem}>选项1</div>)}
            <div className={sty.listItem}>选项2</div>
            <div className={sty.listItem}>选项3</div>
            <div className={sty.listItem}>选项4</div>
          </div>
        }
        childrenAsTarget
      >
        <Button>嵌套气泡</Button>
      </Overlay>
    </div>
  );
};

export default Nest;
