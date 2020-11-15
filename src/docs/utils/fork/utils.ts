export const listItemStyle = {
  padding: '4px 12px',
  border: '1px solid #eee',
};

// 模拟一个有一定几率成功、失败、超时、无数据的请求接口
export const mockData = () =>
  new Promise((res, rej) => {
    setTimeout(() => {
      const rand = Math.random();
      if (rand < 0.3) {
        rej(new Error('加载异常'));
        return;
      }
      // 模拟有无数据
      const data = Array.from({ length: Math.random() > 0.5 ? 0 : 8 }).map(() => Math.random());
      res(data);
    }, 1000);
  });
