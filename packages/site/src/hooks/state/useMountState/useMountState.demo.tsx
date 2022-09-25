import React, { useEffect, useState } from 'react';
import { useMountState } from '@m78/hooks';

const useMountStateDemo = () => {
  const [toggle, setToggle] = useState(false);
  const [mount, unmount] = useMountState(toggle, {
    mountOnEnter: true,
    unmountOnExit: false,
  });

  useEffect(() => {
    if (!toggle) unmount();
  }, [toggle]);

  return (
    <div>
      <button onClick={() => setToggle((prev) => !prev)}>toggle</button>

      {mount && '渲染后, 即使toggle变为false也不会被卸载'}
    </div>
  );
};

export default useMountStateDemo;
