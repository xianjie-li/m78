import React, { useState } from 'react';
import { _Context } from 'm78/table/types';
import clsx from 'clsx';

interface Props {
  ctx: _Context;
  rowInd: number;
}

/** 控制单元格的鼠标交互背景色，此组件的意义是减少单元格的更新 */
const _CellEffectBg = ({ ctx, rowInd }: Props) => {
  const event = ctx.states.updateBgEvent;

  const [isHover, setIsHover] = useState(false);

  event.useEvent((rowIndex, has) => {
    if (rowIndex === rowInd && isHover !== has) {
      setIsHover(has);
    }
  });

  return (
    <div
      className={clsx('m78-table_cell-effect-node', {
        __show: isHover,
      })}
    />
  );
};

export default _CellEffectBg;
