import React, { useState } from 'react';

import Ellipsis from '@lxjx/fr/ellipsis';

import Button from '@lxjx/fr/button';

const style: React.CSSProperties = { border: '1px solid #ccc', fontSize: 20, padding: 12 };

const Demo = () => {
  const [disabled, set] = useState(false);

  return (
    <div>
      <Button onClick={() => set(prev => !prev)}>toggle</Button>
      <h2 className="mt-24">CSS模式</h2>
      <p>单行超出, 使用text-overflow</p>
      <Ellipsis style={style} disabled={disabled}>
        文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本
        文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本
      </Ellipsis>

      <p className="mt-32">多行文本超出，使用webkit-line-clamp</p>
      <Ellipsis line={3} style={style} disabled={disabled}>
        A dicta libero maiores minima nihil omnis rem rerum temporibus, totam? Alias assumenda,
        dignissimos. Eligendi, eos fugiat, ipsa ipsum laborum nostrum numquam saepe sequi sint
        temporibus ut, velit voluptate voluptatem? A dicta libero maiores minima nihil omnis rem
        rerum temporibus, totam? Alias assumenda, dignissimos. Eligendi, eos fugiat, ipsa ipsum
        laborum nostrum numquam saepe sequi sint temporibus ut, velit voluptate voluptatem? A dicta
        libero maiores minima nihil omnis rem rerum temporibus, totam? Alias assumenda, dignissimos.
        Eligendi, eos fugiat, ipsa ipsum laborum nostrum numquam saepe sequi sint temporibus ut,
        velit voluptate voluptatem?
      </Ellipsis>

      <h2 className="mt-32">兼容模式</h2>
      <p>当多行且不兼容webkit-line-clamp时，会自动启用兼容模式，也可以传递forceCompat强制开启</p>
      <Ellipsis forceCompat style={style} disabled={disabled}>
        <div>
          文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本
        </div>
        <div>
          文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本
        </div>
      </Ellipsis>

      <p className="mt-32">
        支持单行与多行、动态fontSize和lineHeight(出于性能考虑，只在初始化时读取行高和字号进行计算)
      </p>
      <Ellipsis line={3} forceCompat style={style} disabled={disabled}>
        <div>
          文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本
        </div>
        <div>
          文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本
        </div>
      </Ellipsis>
    </div>
  );
};

export default Demo;
