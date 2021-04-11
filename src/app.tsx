import * as React from 'react';
import ThemeCtl from './docs/other/theme-ctl';

export function rootContainer(container: any) {
  return (
    <>
      {container} <ThemeCtl />
    </>
  );
}
