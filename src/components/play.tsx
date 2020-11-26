import React from 'react';
import Button from 'm78/button';
import Popper from 'm78/popper';
import DND from 'm78/dnd';
import { Spacer } from 'm78/layout';

import cls from 'classnames';

const style = {
  width: 100,
  height: 100,
  border: '1px solid red',
};

const Play = () => {
  return (
    <div>
      <DND>
        {({ innerRef, status }) => {
          return (
            <div
              ref={innerRef}
              className={cls('dndBox', {
                __left: status.dragLeft,
                __right: status.dragRight,
                __bottom: status.dragBottom,
                __top: status.dragTop,
                __active: status.dragCenter,
              })}
            >
              <h3>title</h3>
              <span className="color-second">hehe</span>
            </div>
          );
        }}
      </DND>

      <Spacer height={100} />

      <DND
        onDrag={() => {
          console.log('onDrag');
        }}
      >
        {({ innerRef }) => {
          return (
            <div ref={innerRef} className={cls('dndBox')}>
              <h3>title2</h3>
              <span className="color-second">hehe2</span>
            </div>
          );
        }}
      </DND>
    </div>
  );
};

export default Play;
