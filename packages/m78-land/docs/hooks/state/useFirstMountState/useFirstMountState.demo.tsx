import React, { useState } from 'react';

import { useFirstMountState } from '@m78/hooks';

const UseFirstMountStateDemo = () => {
  const [count, setCount] = useState(0);

  const isFirstMount = useFirstMountState();

  return (
    <div>
      <button onClick={() => setCount((prev) => prev + 1)}>
        click {count}
      </button>

      <hr />

      <div>isFirstMount: {isFirstMount.toString()}</div>
    </div>
  );
};

export default UseFirstMountStateDemo;
