import React from 'react';
import Button from 'm78/button';
import Popper from 'm78/popper';
import DND from 'm78/dnd';
import { Spacer } from 'm78/layout';

const style = {
  width: 100,
  height: 100,
  border: '1px solid red',
};

const Play = () => {
  return (
    <div>
      <DND>
        {({ innerRef }) => {
          return (
            <div ref={innerRef} style={style}>
              <h3>title</h3>
              <span className="color-second">hehe</span>
            </div>
          );
        }}
      </DND>

      <Spacer height={100} />

      <DND>
        {({ innerRef }) => {
          return (
            <div ref={innerRef} style={style}>
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
