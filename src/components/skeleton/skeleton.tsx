import React, { useMemo } from 'react';

import cls from 'classnames';

import { SkeletonProps, SkeletonFactoryProps } from './type';

/* 获取一个以baseP为基础值的百分比宽度 */
function getRandWidth(baseP: number) {
  const rand = getRand(0, 80);
  return `${rand + baseP}%`;
}

/* 获取值区间 */
function getRand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}

const _Skeleton: React.FC<SkeletonProps> = ({
  width,
  lineNumber = 6,
  shadow = true,
  circle,
  img,
}) => {
  /* 渲染行 */
  function renderLineBox(number = 6) {
    /* 行的数量计算规则: */ /* 存在img时必须大于等于4，否则无限制 */
    const lineNum = img && (lineNumber as number) < 4 ? 4 : number;
    return Array.from({ length: lineNum }).map((val, ind) => {
      // 只在行数大于1时才减少列数量
      const last = lineNum > 1 && ind === lineNum - 1;
      return (
        <div key={ind} className="m78-skeleton_line-box">
          {Array.from({ length: last ? 3 : 5 }).map((v, i) => (
            <div
              key={i}
              className="m78-skeleton_line m78-skeleton_animate"
              style={{ width: last ? `${getRand(8, 36)}%` : getRandWidth(10) }}
            />
          ))}
        </div>
      );
    });
  } /* 防止重绘 */

  /* eslint-disable-next-line */ const lines = useMemo(() => renderLineBox(lineNumber), [
    lineNumber,
  ]);

  return (
    <div className={cls('m78-skeleton', { __shadow: shadow })} style={{ width }}>
      {img && <div className={cls('m78-skeleton_img', { __circle: !!circle })} />}
      {lines}
    </div>
  );
};

/* height属性作用于banner的高度 */
const _Banner: React.FC<Omit<SkeletonProps, 'circle' | 'img' | 'lineNumber'>> = ({
  width,
  height,
  shadow = true,
}) => (
  <div className={cls('m78-skeleton m78-skeleton_banner', { __shadow: shadow })} style={{ width }}>
    <div className="m78-skeleton_banner-main m78-skeleton_animate" style={{ height }} />
    {/* eslint-disable-next-line */}
    <_Skeleton show lineNumber={2} />
  </div>
);

/** 工厂HOC，为其包裹的骨架组件提供一些基础的props和基本的流程控制 */
function SkeletonFactory<T extends SkeletonFactoryProps = SkeletonFactoryProps>(
  Component: React.ComponentType<T>,
) {
  const SkeletonWrap: React.FC<T & SkeletonFactoryProps> = ({
    number = 1,
    show = true,
    children = null,
    ...props
  }): any => {
    const render = () =>
      Array.from({ length: number as number }).map((v: any, i: number) => (
        <Component key={i} {...(props as T)} />
      ));

    return show ? render() : children!;
  };

  return SkeletonWrap;
}

const BasedSkeleton = SkeletonFactory(_Skeleton);
const BannerSkeleton = SkeletonFactory(_Banner);

type Skeleton = typeof BasedSkeleton;

interface SkeletonWithExtra extends Skeleton {
  BannerSkeleton: typeof BannerSkeleton;
  SkeletonFactory: typeof SkeletonFactory;
}

const Skeleton: SkeletonWithExtra = Object.assign(BasedSkeleton, {
  BannerSkeleton,
  SkeletonFactory,
});

export { BannerSkeleton, SkeletonFactory };
export default Skeleton;
