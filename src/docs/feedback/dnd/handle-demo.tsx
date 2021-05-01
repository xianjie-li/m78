import React from 'react';
import { DND, DNDContext } from 'm78/dnd';

const HandleDemo = () => {
  return (
    <div>
      <DNDContext>
        <DND data="DND1">
          {({ innerRef, handleRef }) => {
            return (
              <div
                ref={innerRef}
                style={{
                  width: 200,
                  height: 200,
                  border: '1px solid red',
                  padding: 12,
                  borderRadius: 2,
                }}
              >
                <span
                  ref={handleRef}
                  style={{
                    display: 'inline-block',
                    width: 70,
                    height: 30,
                    border: '1px solid red',
                    borderRadius: 2,
                  }}
                >
                  拖动这里
                </span>
              </div>
            );
          }}
        </DND>
      </DNDContext>
    </div>
  );
};

export default HandleDemo;
