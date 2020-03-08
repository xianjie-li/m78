import * as React from 'react';

export const stopPropagation = {
  onClick(e: React.SyntheticEvent) {
    e.stopPropagation();
  },
};

/* 占位函数 */
export const dumpFn = (...arg: any[]): any => undefined;

export function getGlobal() {
  // eslint-disable-next-line no-restricted-globals
  if (typeof self !== 'undefined') { return self; }
  if (typeof window !== 'undefined') { return window; }
  if (typeof global !== 'undefined') { return global; }
  throw new Error('unable to locate global object');
}
