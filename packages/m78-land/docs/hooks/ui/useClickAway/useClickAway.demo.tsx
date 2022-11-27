import React, { useRef, useState } from 'react';
import { useClickAway } from '@m78/hooks';

const UseClickAwayDemo = () => {
  const [count, setCount] = useState(0);

  const b1 = useRef<HTMLButtonElement>(null!);
  const b2 = useRef<HTMLButtonElement>(null!);

  const ref = useClickAway({
    target: [b1, b2],
    onTrigger(e) {
      console.log(e);
      setCount((prev) => prev + 1);
    },
  });

  return (
    <div>
      <button ref={b1}>button1</button>
      <button ref={b2}>button2</button>
      <button ref={ref}>button3</button>

      <hr />

      <div>click away count: {count}</div>
    </div>
  );
};

export default UseClickAwayDemo;
