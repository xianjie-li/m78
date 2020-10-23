import React, { useEffect, useRef } from 'react';
import Tips from 'm78/tips';
import { Divider } from 'm78/layout';
import Button from 'm78/button';
import { getFirstScrollParent, getStyle } from 'm78/util';
import { useScroll } from '@lxjx/hooks';

/* 用于发出轻量的提示消息
 * 轻消息提示，与Message的区别是:
 * - 可用于局部提示，Message偏向于全局提示, 此特性可用于为某些组件创建内部提示(如Scroller组件)
 * - 同样维护一个队列，但是不会同时出现多条，而是根据持续时间逐条显示
 * */

const Play = () => {
  const ref = useRef<any>(null!);

  const sc = useScroll({
    el: document.body,
  });

  useEffect(() => {
    const e = getFirstScrollParent(ref.current);

    console.log(e);
  }, []);

  return (
    <div>
      <div
        style={{
          position: 'relative',
          width: 300,
          border: '1px solid #ccc',
          overflow: 'hidden',
          padding: 12,
        }}
      >
        <button ref={ref} onClick={() => sc.set({ y: 500, raise: true })}>
          btn
        </button>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorem eum ex incidunt minus
          officia officiis perspiciatis qui sed. Amet cumque impedit, incidunt mollitia
          necessitatibus odio possimus. Autem eveniet sequi suscipit?
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorem eum ex incidunt minus
          officia officiis perspiciatis qui sed. Amet cumque impedit, incidunt mollitia
          necessitatibus odio possimus. Autem eveniet sequi suscipit? Lorem ipsum dolor sit amet,
          consectetur adipisicing elit. Dolorem eum ex incidunt minus officia officiis perspiciatis
          qui sed. Amet cumque impedit, incidunt mollitia necessitatibus odio possimus. Autem
          eveniet sequi suscipit?
        </p>
      </div>
    </div>
  );
};

export default Play;
