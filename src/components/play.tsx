import React from 'react';
import Button from 'm78/button';
import Popper from 'm78/popper';

const Play = () => {
  return (
    <div>
      {Array.from({ length: 10 }).map((_, ind) => (
        <Popper key={ind} content={<div>这是一段提示</div>}>
          <Button key={ind}>按钮{ind}</Button>
        </Popper>
      ))}
    </div>
  );
};

export default Play;
