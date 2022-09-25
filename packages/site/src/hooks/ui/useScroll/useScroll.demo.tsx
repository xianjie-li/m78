import React from 'react';
import { useScroll } from '@m78/hooks';

const style2: React.CSSProperties = {
  height: 300,
  border: '1px solid red',
  overflow: 'auto',
  padding: 40,
};

const useScrollDemo = () => {
  const { set, get, scrollToElement, ref } = useScroll<HTMLDivElement>({
    onScroll(meta) {
      console.log(meta);
    },
  });

  const windowS = useScroll<HTMLDivElement>({
    onScroll(meta) {
      console.log('window: ', meta);
    },
  });

  return (
    <div>
      UseScroll
      <h3>元素滚动</h3>
      <button
        type="button"
        onClick={() => {
          set({
            x: 200,
            y: 1000,
            raise: true,
          });
        }}
      >
        +200
      </button>
      <button
        type="button"
        onClick={() => {
          console.log(get());
        }}
      >
        get
      </button>
      <button
        type="button"
        onClick={() => {
          scrollToElement('#p-5');
        }}
      >
        scrollToElement
      </button>
      <div id="testWrap" style={style2} ref={ref}>
        {Array.from({ length: 20 }).map((_, index) => (
          <p
            id={`p-${index + 1}`}
            style={{ width: 1000, border: '1px solid #eee' }}
            key={index}
          >
            {index + 1}
          </p>
        ))}
      </div>
      <hr />
      <h3>window滚动</h3>
      <button onClick={() => windowS.scrollToElement('#示例')}>
        滚动到 #示例
      </button>
      <button onClick={() => windowS.set({ x: 200, y: 200, raise: true })}>
        +200
      </button>
    </div>
  );
};

export default useScrollDemo;
