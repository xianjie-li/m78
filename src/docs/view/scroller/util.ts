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

/* TODO: 添加到utils */
/**
 * 返回一个延迟指定时间的Promise, payload为Promise的resolve值，如果其为 Error 对象，则promise在指定延迟后reject
 * */
export function delay<T = any>(ms: number, payload?: T) {
  return new Promise<T extends Error ? void : T>((res, rej) => {
    setTimeout(() => (payload instanceof Error ? rej(payload) : res(payload as any)), ms);
  });
}
