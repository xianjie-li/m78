import Portal from '@lxjx/fr/lib/portal';
import React, { useEffect, useRef, useState } from 'react';
import { getPopperMetas } from './getPopperMetas';

const Popper = () => {
  const [state, setState] = useState<any>({});
  const wrap = useRef<any>(null);
  const ref = useRef<any>(null);
  const ref2 = useRef<any>(null);

  useEffect(() => {
    wrap.current.addEventListener('scroll', () => {
      const res = getPopperMetas(ref2.current, ref.current, {
        wrap: wrap.current,
      });
      setState(res);
    });

    // window.addEventListener('scroll', () => {
    //   // getBoundMetas(ref2.current, ref.current, document.body);
    //   const res = getPopperMetas(ref2.current, ref.current);
    //   setState(res);
    //   console.log(res);
    // });

    wrap.current.scrollTop = 400;
    wrap.current.scrollBottom = 400;
  }, []);

  return (
    <div>
      <div
        ref={wrap}
        style={{
          display: 'inline-block',
          border: '1px solid red',
          position: 'relative',
          zIndex: 99999,
          height: 400,
          width: 400,
          // height: 2000,
          // width: 2000,
          overflow: 'auto',
        }}
      >
        <div style={{ width: 2000, height: 2000 }}>
          <Portal namespace="popper">
            <span
              className="boxx2 boxxTopStart"
              style={{
                backgroundColor: state.topStart?.safe ? '' : 'rgba(0, 0, 0, 0.15)',
                left: state.topStart?.x,
                top: state.topStart?.y,
              }}
            >
              TStart
            </span>
          </Portal>
          <Portal namespace="popper">
            <span
              className="boxx2 boxxTop"
              style={{
                backgroundColor: state.top?.safe ? '' : 'rgba(0, 0, 0, 0.15)',
                left: state.top?.x,
                top: state.top?.y,
              }}
            >
              Top
            </span>
          </Portal>
          <Portal namespace="popper">
            <span
              className="boxx2 boxxTopEnd"
              style={{
                backgroundColor: state.topEnd?.safe ? '' : 'rgba(0, 0, 0, 0.15)',
                left: state.topEnd?.x,
                top: state.topEnd?.y,
              }}
            >
              TEnd
            </span>
          </Portal>
          <Portal namespace="popper">
            <span
              className="boxx2 boxxBottomEnd"
              style={{
                backgroundColor: state.bottomEnd?.safe ? '' : 'rgba(0, 0, 0, 0.15)',
                left: state.bottomEnd?.x,
                top: state.bottomEnd?.y,
              }}
            >
              BEnd
            </span>
          </Portal>
          <Portal namespace="popper">
            <span
              className="boxx2 boxxBottomStart"
              style={{
                backgroundColor: state.bottomStart?.safe ? '' : 'rgba(0, 0, 0, 0.15)',
                left: state.bottomStart?.x,
                top: state.bottomStart?.y,
              }}
            >
              BStart
            </span>
          </Portal>
          <Portal namespace="popper">
            <span
              className="boxx2 boxxBottom"
              style={{
                backgroundColor: state.bottom?.safe ? '' : 'rgba(0, 0, 0, 0.15)',
                left: state.bottom?.x,
                top: state.bottom?.y,
              }}
            >
              Bottom
            </span>
          </Portal>
          <Portal namespace="popper">
            <span
              className="boxx2 boxxLeft"
              style={{
                backgroundColor: state.left?.safe ? '' : 'rgba(0, 0, 0, 0.15)',
                left: state.left?.x,
                top: state.left?.y,
              }}
            >
              Left
            </span>
          </Portal>
          <Portal namespace="popper">
            <span
              className="boxx2 boxxLeftStart"
              style={{
                backgroundColor: state.leftStart?.safe ? '' : 'rgba(0, 0, 0, 0.15)',
                left: state.leftStart?.x,
                top: state.leftStart?.y,
              }}
            >
              LStart
            </span>
          </Portal>
          <Portal namespace="popper">
            <span
              className="boxx2 boxxLeftEnd"
              style={{
                backgroundColor: state.leftEnd?.safe ? '' : 'rgba(0, 0, 0, 0.15)',
                left: state.leftEnd?.x,
                top: state.leftEnd?.y,
              }}
            >
              LEnd
            </span>
          </Portal>
          <Portal namespace="popper">
            <span
              className="boxx2 boxxRight"
              style={{
                backgroundColor: state.right?.safe ? '' : 'rgba(0, 0, 0, 0.15)',
                left: state.right?.x,
                top: state.right?.y,
              }}
            >
              Right
            </span>
          </Portal>
          <Portal namespace="popper">
            <span
              className="boxx2 boxxRightStart"
              style={{
                backgroundColor: state.rightStart?.safe ? '' : 'rgba(0, 0, 0, 0.15)',
                left: state.rightStart?.x,
                top: state.rightStart?.y,
              }}
            >
              RStart
            </span>
          </Portal>
          <Portal namespace="popper">
            <span
              className="boxx2 boxxRightEnd"
              style={{
                backgroundColor: state.rightEnd?.safe ? '' : 'rgba(0, 0, 0, 0.15)',
                left: state.rightEnd?.x,
                top: state.rightEnd?.y,
              }}
            >
              REnd
            </span>
          </Portal>
          <span ref={ref} className="boxx" style={{ position: 'relative', left: 200, top: 200 }} />
          <div className="ppp" ref={ref2} />
        </div>
      </div>
      <pre style={{ display: 'inline-block' }}>{JSON.stringify(state, null, 4)}</pre>
    </div>
  );
};

export default Popper;
