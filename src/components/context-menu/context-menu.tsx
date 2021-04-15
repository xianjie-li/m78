import React from 'react';
import Button from 'm78/button';
import Popper from 'm78/popper';

const XxContextMenu = () => {
  return (
    <Popper
      show
      type="popper"
      content={
        <div>
          <div>呵呵哒</div>
          <div>呵呵哒</div>
          <div>呵呵哒</div>
        </div>
      }
      onChange={e => console.log(e)}
    >
      <Button
        onContextMenu={e => {
          e.preventDefault();
          console.log(e);

          return false;
        }}
      >
        click
      </Button>
    </Popper>
  );
};

export default XxContextMenu;
