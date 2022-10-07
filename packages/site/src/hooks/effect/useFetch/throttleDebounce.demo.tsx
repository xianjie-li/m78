import React from "react";
import { useFetch } from "@m78/hooks";

/**
 * 模拟一个基于Promise的请求函数
 */

function mockFn(payload: string) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ code: 0, msg: `您输入的值是: ${payload}` });
    }, 300);
  });
}

const ThrottleDebounceDemo = () => {
  const {
    data: data1,
    loading: loading1,
    send: send1,
  } = useFetch(mockFn, {
    throttleInterval: 1000,
    manual: true,
  });

  const {
    data: data2,
    loading: loading2,
    send: send2,
  } = useFetch(mockFn, {
    debounceInterval: 300,
    manual: true,
  });

  return (
    <div>
      <h3>throttle</h3>
      <p style={{ fontSize: 12 }}>1s内只会执行一次请求</p>
      <div>
        输入关键词
        <input type="text" onChange={({ target }) => send1(target.value)} />
        {loading1 && "loading..."}
        <p>{data1 && JSON.stringify(data1)}</p>
      </div>

      <h3>debounce</h3>
      <p style={{ fontSize: 12 }}>停止输入300ms后触发请求</p>
      <div>
        输入关键词
        <input type="text" onChange={({ target }) => send2(target.value)} />
        {loading2 && "loading..."}
        <p>{data2 && JSON.stringify(data2)}</p>
      </div>
    </div>
  );
};

export default ThrottleDebounceDemo;
