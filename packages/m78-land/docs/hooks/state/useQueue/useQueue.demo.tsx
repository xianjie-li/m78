import React from 'react';
import { useQueue } from '@m78/hooks';

let count = 0;

const UseQueueDemo = () => {
  const queue = useQueue<{ text: string }>({
    onChange(c) {
      console.log(222, c);
    },
  });

  return (
    <div style={{ lineHeight: 2 }}>
      <div style={{ marginTop: 50 }}>
        <button
          onClick={() => {
            const ind = ++count;
            queue.push({
              text: `这是第${ind}条消息`,
              duration: 2000,
              id: ind,
            });
          }}
        >
          push
        </button>
        <button disabled={queue.index === 0} onClick={queue.prev}>
          prev
        </button>
        <button disabled={!queue.hasNext()} onClick={queue.next}>
          next
        </button>
        <button onClick={queue.clear}>clear</button>
        <button disabled={queue.isManual} onClick={queue.manual}>
          manual
        </button>
        <button disabled={!queue.isManual} onClick={queue.auto}>
          auto
        </button>
        <button onClick={() => queue.remove([3, 4, 5])}>remove</button>
      </div>

      <div style={{ display: 'flex', textAlign: 'center' }}>
        <div
          style={{
            width: 140,
            border: '1px solid #eee',
          }}
        >
          <h3>所有消息</h3>
          {queue.list.map((item) => (
            <div
              key={item.id}
              onClick={() => queue.jump(item.id)}
              style={{
                padding: '4px 12px',
                border:
                  item === queue.current ? '1px solid red' : '1px solid #ccc',
              }}
            >
              {item.text}-{item.id}
            </div>
          ))}
        </div>
        <div
          style={{
            width: 140,
            border: '1px solid #eee',
          }}
        >
          <h3>已使用消息</h3>
          {queue.leftList.map((item) => (
            <div
              key={item.id}
              style={{
                padding: '4px 12px',
                border:
                  item === queue.current ? '1px solid red' : '1px solid #ccc',
              }}
            >
              {item.text}-{item.id}
            </div>
          ))}
        </div>
        <div
          style={{
            width: 140,
            border: '1px solid #eee',
          }}
        >
          <h3>未使用消息</h3>
          {queue.rightList.map((item) => (
            <div
              key={item.id}
              style={{
                padding: '4px 12px',
                border:
                  item === queue.current ? '1px solid red' : '1px solid #ccc',
              }}
            >
              {item.text}-{item.id}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UseQueueDemo;
