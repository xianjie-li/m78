import Portal from '@lxjx/fr/lib/portal';
import React, { useEffect, useRef, useState } from 'react';
import { useFn, useSetState } from '@lxjx/hooks';
import { useSpring, animated, config } from 'react-spring';
import cls from 'classnames';
import {
  GetBoundMetasDirectionKeys,
  getPopperMetas,
  getPopperDirectionForMeta,
} from './getPopperMetas';

interface PopperProps {
  /** 直接指定目标元素 */
  targetEl?: HTMLElement;
  /** 气泡方向 */
  direction?: GetBoundMetasDirectionKeys;
  children?: React.ReactElement;
}

const Popper: React.FC<PopperProps> = ({ children, direction = 'bottomEnd' }) => {
  const popperEl = useRef<HTMLDivElement>(null!);
  const targetEl = useRef<any>(null!);
  const wrapEl = useRef<any>(null!);
  const [state, setState] = useSetState({
    direction: direction as GetBoundMetasDirectionKeys,
  });

  const [spProps, set] = useSpring(() => ({ left: 0, top: 0, config: config.stiff }));

  useEffect(() => {
    wrapEl.current.addEventListener('scroll', () => {
      const meta = getPopperMetas(popperEl.current, targetEl.current, {
        wrap: wrapEl.current,
      });
      const d = getPopperDirectionForMeta(meta, direction, state.direction);

      if (d) {
        const [currentMeta, currentDirection] = d;

        if (currentDirection !== state.direction) {
          setState({
            direction: currentDirection,
          });
        }
        console.log(d);

        set({
          left: currentMeta.x,
          top: currentMeta.y,
        });
      }
    });
  }, []);

  const clickHandle = useFn(e => {
    console.log(123123, e.target);
  });

  return (
    <div className="wrap" ref={wrapEl}>
      <div className="inner">
        <span style={{ margin: 500, display: 'inline-block' }} ref={targetEl}>
          {children}
        </span>
        {/* {children && React.cloneElement(children, { onClick: clickHandle })} */}
        <Portal namespace="popper">
          <animated.div ref={popperEl} style={spProps} className="fr-popper">
            <span className={cls('fr-popper_arrow', state.direction && `__${state.direction}`)} />
            <div className="fr-popper_content">提示一段提示</div>
          </animated.div>
        </Portal>
      </div>
    </div>
  );
};

export default Popper;
