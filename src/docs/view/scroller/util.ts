import { createRandString } from '@lxjx/utils';

/** 返回一个组模拟数据 */
export function mockData(length = 12) {
  return Array.from({ length }).map(() => createRandString());
  // return new Promise<string[]>((res, rej) => {
  //   setTimeout(() => {
  //     Math.random() > 1 ? rej() : res(Array.from({ length }).map(() => createRandString()));
  //   }, 0);
  // });
}
