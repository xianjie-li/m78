import React from 'react';
import { useLockBodyScroll, useToggle } from '@m78/hooks';

const UseLockBodyScrollDemo = () => {
  const [bool, set] = useToggle(false);
  const [bool2, set2] = useToggle(true);
  const [bool3, set3] = useToggle(false);

  useLockBodyScroll(bool);
  useLockBodyScroll(bool2);
  useLockBodyScroll(bool3);

  return (
    <div>
      <h3>UseLockBodyScrollDemo</h3>
      <button type="button" onClick={() => set(!bool)}>
        lock | {bool.toString()}
      </button>
      <button type="button" onClick={() => set2(!bool2)}>
        lock2 | {bool2.toString()}
      </button>
      <button type="button" onClick={() => set3(!bool3)}>
        lock3 | {bool3.toString()}
      </button>
      {(bool || bool2 || bool3) && <div>请解锁滚动条</div>}
      <div style={{ height: 1000 }} />
    </div>
  );
};

export default UseLockBodyScrollDemo;
