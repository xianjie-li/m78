import * as React from 'react';

export const stopPropagation = {
  onClick(e: React.SyntheticEvent) {
    e.stopPropagation();
  },
};

/* 占位函数 */
export const dumpFn = (...arg: any[]): any => undefined;
