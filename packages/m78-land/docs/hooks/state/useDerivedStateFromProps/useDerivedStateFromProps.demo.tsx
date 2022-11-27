import React, { useState } from 'react';
import { useDerivedStateFromProps } from '@m78/hooks';

function Demo({ num }: any) {
  const [insideNum, setInsideNum] = useDerivedStateFromProps(num);

  return (
    <div style={{ margin: '20px 0' }}>
      <h3>基本类型 - </h3>
      <div>传入prop: {num}</div>
      <div>派生state: {insideNum}</div>
      <button onClick={() => setInsideNum(Math.random)}>改变派生状态</button>
    </div>
  );
}

function Demo2({ obj }: any) {
  const [insideObj, setInsideObj] = useDerivedStateFromProps(obj);

  return (
    <div style={{ margin: '20px 0' }}>
      <h3>引用类型 - </h3>
      <div>传入prop: {JSON.stringify(obj, null, 4)}</div>
      <div>派生state: {JSON.stringify(insideObj, null, 4)}</div>
      <button onClick={() => setInsideObj({ id: 1008 })}>改变派生状态</button>
    </div>
  );
}

const useDerivedStateFromPropsDemo = () => {
  const [number, setNumber] = useState(5);
  const [obj, setObj] = useState({ id: 2008 });

  return (
    <div>
      <button onClick={() => setNumber(Math.random())}>改变prop</button>
      <div>
        <Demo num={number} />
      </div>

      <hr />

      <button onClick={() => setObj({ id: Math.random() })}>改变引用</button>
      <div>
        <Demo2 obj={obj} />
      </div>
    </div>
  );
};

export default useDerivedStateFromPropsDemo;
