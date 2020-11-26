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
      <DND
        data="A"
        // onSourceEnter={e => console.log('onSourceEnter', JSON.stringify(e))}
        // onSourceLeave={e => console.log('onSourceLeave', JSON.stringify(e))}
        // onSourceMove={e => console.log('onSourceMove', JSON.stringify(e))}
        // onSourceAccept={e => console.log('onSourceAccept', JSON.stringify(e))}
      >
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
        data="B"
        // onDrag={e => {
        //   console.log('onDrag', e);
        // }}
        // onMove={e => {
        //   console.log('onMove', JSON.stringify(e));
        // }}
        // onDrop={e => {
        //   console.log('onDrop', JSON.stringify(e));
        // }}
        // onCancel={e => {
        //   console.log('onCancel', JSON.stringify(e));
        // }}
      >
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
