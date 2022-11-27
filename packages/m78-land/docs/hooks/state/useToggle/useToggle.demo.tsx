import React from 'react';
import { useToggle } from '@m78/hooks';

const UseToggleDemo = () => {
  const [toggle, set] = useToggle(true);

  return (
    <div>
      <div>
        <button onClick={() => set()}>set()</button>
        <button onClick={() => set(true)}>set(true)</button>
        <button onClick={() => set(false)}>set(false)</button>
      </div>

      <div>toggle: {toggle.toString()}</div>
    </div>
  );
};

export default UseToggleDemo;
