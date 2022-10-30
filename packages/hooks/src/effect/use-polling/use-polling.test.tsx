import { render } from "@testing-library/react";
import { usePolling } from "./use-polling";
import React from "react";

test("usePolling", (done) => {
  // jest.useFakeTimers();
  const cb = jest.fn();

  function Demo() {
    usePolling({
      trigger: cb,
      // 虚拟计时器不能很好的用于usePolling, 因为每个计时器都是前一个结束后才开始的
      // 这里用很短的间隔来缩短测试时间
      interval: 10,
      maxPollingNumber: 5,
      initTrigger: true,
    });

    return null;
  }

  render(<Demo />);

  setTimeout(() => {
    expect(cb.mock.calls.length).toBe(5);
    done();
  }, 200);
});
