import React from 'react';
import { Size, SizeEnum } from 'm78/types';

/**
 * 传入onClick时, 会附加点击反馈效果
 * */
interface TileProps extends Omit<React.PropsWithoutRef<JSX.IntrinsicElements['div']>, 'title'> {
  /** 主要内容 */
  title: React.ReactNode;
  /** 次要内容 */
  subTitle: React.ReactNode;
  /** 前导内容 */
  leading: React.ReactNode;
  /** 尾随内容 */
  trailing: React.ReactNode;
  /** 布局的空白区域尺寸 */
  spaceSize?: SizeEnum | Size;
}

const Tile = (props: TileProps) => {
  return (
    <div>
      <div>123</div>
    </div>
  );
};

export default Tile;
