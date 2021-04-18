import * as React from 'react';
import ThemeCtl from './docs/common-demo/theme-ctl';

export function rootContainer(container: any) {
  return (
    <>
      {container} <ThemeCtl />
    </>
  );
}
