import React, { useRef, useEffect } from 'react';
import { getBoundMetas } from './getBoundMetas';

const Popper = () => {
  const wrap = useRef<any>(null);
  const ref = useRef<any>(null);
  const ref2 = useRef<any>(null);

  useEffect(() => {
    wrap.current.addEventListener('scroll', () => {
      getBoundMetas(ref2.current, ref.current, wrap.current);
    });
  }, []);

  return (
    <div
      ref={wrap}
      style={{
        height: 400,
        width: 400,
        border: '1px solid red',
        position: 'relative',
        zIndex: 99999,
        overflow: 'auto',
      }}
    >
      <div style={{ width: 2000, height: 2000, position: 'absolute', left: 400, top: 800 }}>
        <span ref={ref} className="boxx">
          popper
        </span>
        <div className="ppp" ref={ref2} />
      </div>
    </div>
  );
};

export default Popper;
