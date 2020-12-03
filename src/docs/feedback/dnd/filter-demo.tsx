import React from 'react';
import DND, { DNDContext } from 'm78/dnd';

const FilterDemo = () => {
  return (
    <div>
      <DNDContext>
        <DND data="DND1">
          {({ innerRef, status }) => {
            return (
              <div
                ref={innerRef}
                style={{
                  width: 200,
                  border: '1px solid red',
                  padding: 12,
                  borderRadius: 2,
                }}
              >
                {status.dragging && <span>😫</span>}
                {status.regular && <span>🥰</span>}
                <input type="text" />

                <textarea className="mt-8" />

                <button type="button" className="mt-8">
                  button
                </button>
              </div>
            );
          }}
        </DND>
      </DNDContext>
    </div>
  );
};

export default FilterDemo;
