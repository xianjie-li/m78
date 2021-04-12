import React from 'react';
import create from 'm78/seed';
import Button from 'm78/button';

const { setState, useState, State, getState } = create({
  /* 被所有验证器依赖数据 */
  state: {
    number: 0,
    time: Date.now(),
  },
});

const GetDepsDemo = () => {
  /**
   * - 省略selector参数会直接返回整个deps
   * - hook只会在选取的值变更后更新组件、所以只获取需要的依赖值能大大减少render次数从而提升性能
   * - 如果选取了对象，请勿使用 useState(deps => ({ ...deps.obj }))语法，因为这会导致不必要的引用改变而导致组件更新
   * */
  const dNumber = useState(state => state.number);
  const dTime = useState(state => state.time);

  return (
    <div>
      <Button size="small" onClick={() => setState({ number: Math.random() })}>
        change number
      </Button>
      <Button size="small" onClick={() => setState({ time: Date.now() })}>
        change time
      </Button>
      <Button size="small" onClick={() => alert(JSON.stringify(getState(), null, 4))}>
        通过getState()获取状态
      </Button>

      <h3 className="mt-24">useState()</h3>
      <div className="fs color-second mtb-12">通过useState()选取deps，这是最推荐的用法</div>

      <div>
        <div>number: {dNumber}</div>
        <div>time: {dTime}</div>
      </div>

      <h3 className="mt-24">State</h3>
      <div className="fs color-second mtb-12">
        通过State组件获取状态，状态改变时，只有组件的render children区域更新，
        适合某个区域要显示部分deps的场景
      </div>

      <State>
        {({ number, time }) => (
          <div>
            <div>number: {number}</div>
            <div>time: {time}</div>
          </div>
        )}
      </State>
    </div>
  );
};

export default GetDepsDemo;
