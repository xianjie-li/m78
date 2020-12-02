import React from 'react';
import { SkeletonProps, SkeletonFactoryProps } from './type';
/** 工厂HOC，为其包裹的骨架组件提供一些基础的props和基本的流程控制 */
declare function SkeletonFactory<T extends SkeletonFactoryProps = SkeletonFactoryProps>(Component: React.ComponentType<T>): React.FC<T & SkeletonFactoryProps>;
declare const BasedSkeleton: React.FC<SkeletonProps & SkeletonFactoryProps>;
declare const BannerSkeleton: React.FC<Pick<SkeletonProps, "number" | "show" | "children" | "height" | "width" | "backgroundColor" | "shadow"> & SkeletonFactoryProps>;
declare type Skeleton = typeof BasedSkeleton;
interface SkeletonWithExtra extends Skeleton {
    BannerSkeleton: typeof BannerSkeleton;
    SkeletonFactory: typeof SkeletonFactory;
}
declare const Skeleton: SkeletonWithExtra;
export { BannerSkeleton, SkeletonFactory };
export default Skeleton;
