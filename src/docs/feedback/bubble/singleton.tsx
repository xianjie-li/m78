import React, { SyntheticEvent, useRef, useState } from 'react';
import { Bubble } from 'm78/bubble';
import { Button } from 'm78/button';
import { OverlayInstance } from 'm78/overlay';

const SingletonDemo = () => {
  const [show, setShow] = useState(false);

  const insRef = useRef<OverlayInstance>(null!);

  function handleClick(e: SyntheticEvent) {
    insRef.current.updateTarget(e.currentTarget as HTMLElement);
    setShow(true);
  }

  return (
    <div>
      <Bubble
        instanceRef={insRef}
        show={show}
        onChange={setShow}
        content={<div>我是气泡内容~~</div>}
      />

      <Button onClick={handleClick}>按钮1</Button>
      <Button onClick={handleClick}>按钮2</Button>
      <Button onClick={handleClick}>按钮3</Button>
      <Button onClick={handleClick}>按钮4</Button>
      <Button onClick={handleClick}>按钮5</Button>
    </div>
  );
};

export default SingletonDemo;
