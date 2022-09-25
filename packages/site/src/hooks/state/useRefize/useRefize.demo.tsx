import React, { useState, useCallback } from 'react';
import { useRefize } from '@m78/hooks';

const useRefizeDemo = () => {
  const [count, setCount] = useState(0);
  const refState = useRefize({
    count,
  });

  const log = useCallback(() => {
    console.log(count);
    console.log(refState.count);
  }, []);

  return (
    <div>
      <h3>useRefizeDemo</h3>
      <button onClick={() => setCount((prev) => prev + 1)}>
        change {count}
      </button>
      <button onClick={log}>log</button>
    </div>
  );
};

export default useRefizeDemo;
