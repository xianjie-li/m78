---
title: Scroller - 滚动容器
group:
  title: 展示组件
  path: /view
  order: 4000
---

# Scroller 滚动容器

一个可滚动容器, 用作`better-scroll`、`iScroll`等库的替代, 与这些库相比, 它:

- 使用原生滚动, 只在滚动到达边界时提供橡皮筋效果，搭配移动设备自带的拖动滚动可以'大体'完成这些库的交互需求。
- 由于使用原生滚动，性能必然也比通过`transform`模拟的滚动更高, 这也是这个组件存在的意义。
- 提供了很多滚动便利配置，如： 返回顶部、滚动条定制/隐藏、可滚动标识、进度条、滚动到指定位置、滚动到指定元素、滚动动画、上拉刷新、下拉加载等。

## 示例

在滚动到达边缘时开启弹动效果(通常结合移动端的拖动滚动使用)

<code src="./scroller-demo.tsx" />

## 滚动指示

滚动进度条、可滚动标识器

<code src="./flags.tsx" />

## 滚动条

_适用于 pc 版_, 默认会在支持的浏览器上通过`-webkit-`私有前缀定制滚动条样式，也可以选择关闭定制、隐藏滚动条、控制显示时机等

<code src="./bar.tsx" />

## 滚动控制

通过 ref 实例来便捷的控制滚动位置

<code src="./ctrl.tsx" />

## 上拉加载/下拉刷新

下面是一个上拉加载和下拉刷新的结合示例

- 在滚动到最顶部时，可以通过下拉来刷新所有状态
- 滚动到内容底部时会自动加载一些新的数据
- mock 函数会随机模拟错误
- 可以通过下拉刷新来清空列表、错误、无数等状态

<code src="./pull.tsx" />

## 下拉刷新进阶

<code src="./pulldown.tsx" />

## props

**`props`**

```tsx | pure
interface ScrollerProps extends ComponentBaseProps {
  /** Direction.vertical | 滚动方向 */
  direction?: DirectionEnum;
  /** 内容, 是否可滚动的依据是滚动内容尺寸大于滚动容器尺寸 */
  children?: React.ReactNode;
  /** 滚动时触发 */
  onScroll?: (meta: UseScrollMeta) => void;
  /** 禁止滚动(仍可通过ref api控制滚动) */
  disableScroll?: boolean;

  /* ############# 下拉配置 ############# */

  /** 启用下拉并在触发时通知, 根据Promise的解析结果决定成功或失败 */
  onPullDown?: (triggerPullDown: ScrollerRef['triggerPullUp']) => Promise<void>;
  /** true | 是否在刷新结束后根据结果进行提示 */
  pullDownTips?: boolean;
  /** 自定义下拉指示器 */
  pullDownIndicator?: React.ReactNode;
  /** 完全替换下拉区域的内容, 可以通过threshold调整下拉距离 */
  pullDownNode?: React.ReactNode;

  /* ############# 上拉配置 ############# */

  /**
   * 启用上拉加载并在触发时通知
   * - 如果Promise resolve, 应解析 每页条数 / 当前条数, 用于帮助判断是否还可加载
   * - 如果Promise reject, 会发出一个加载失败通知
   * - onPullUp有3种方式触发，组件初始化时(isRefresh为true)、上拉到触发点时、调用triggerPullUp(组件内/外)
   *
   * 上拉加载与下拉刷新有以下关联行为
   * - 开始刷新时，上拉状态会被还原
   * - 如果列表包含依赖状态，页码、查询等，应在下拉刷新时将其重置
   * */
  onPullUp?: (args: {
    /** 由组件内部触发(点击重试、triggerPullUp(true)、初始化执行)等方式触发, 为true时应该调过增加页码等操作，仅做数据更新 */
    isRefresh?: boolean;
  }) => Promise<number>;
  /** 120 | 触发上拉加载的距离 */
  pullUpThreshold?: number;

  /* ############# 上下拉相关配置 ############# */

  /** 80 | 各方向到达顶部或底部后可拖动的最大距离(不包含rubber产生的额外拖动距离), 此距离也是下拉刷新的触发距离 */
  threshold?: number;
  /** 0.5 | 肥皂力，值越大则越顺滑, 拖动每px移动的距离也更大 */
  soap?: number;
  /** 40 | 触发橡皮筋效果的阈值, 会在 threshold 的 -rubber 位置开始逐渐减小soap, 并在拖动到+rubber位置时完全停止 */
  rubber?: number;

  /* ############# 定制配置 ############# */

  /** 拖动层下层的背景色 */
  bgColor?: string;
  /** 显示滚动进度条, 为number时当可滚动区域大于此值时才出现progressBar, 若传入true，滚动区域大于500时出现进度条 */
  progressBar?: boolean | number;
  /** 0 ~ 1 手动控制x轴进度条进度 */
  xProgress?: number;
  /** 0 ~ 1 手动控制y轴进度条进度 */
  yProgress?: number;
  /** 对应方向包含可滚动区域时显示可滚动阴影标识 */
  scrollFlag?: boolean;
  /** false | 是否显示滚动条 */
  hideScrollbar?: boolean;
  /** true | 在支持::-webkit-scrollbar且非移动端的情况下，使用其定制滚动条 */
  webkitScrollBar?: boolean;
  /** false | 仅在鼠标悬停在滚动容器上时显示webkitScrollBar */
  hoverWebkitScrollBar?: boolean;
  /** 继承配置 */
  // className: string;
  // style: React.CSSProperties;

  /* ############# 扩展 ############# */

  /** 是否显示返回顶部按钮 */
  backTop?: boolean;
  /** 滚动容器外层额外的内容, 和滚动提示等组件一级，用于扩展其他滚动配件 */
  extraNode?: React.ReactNode;
}
```

**`ref`**

```tsx | pure
interface ScrollerRef extends UseScrollReturns {
  /** 手动触发onPullDown，可用于刷新上拉加载的状态，当正在进行下拉或上拉中的任意操作时，调用无效 */
  triggerPullDown(): void;
  /** 手动触发onPullUp，参数细节见props.onPullUp ，当正在进行下拉或上拉中的任意操作时，调用无效 */
  triggerPullUp(isRefresh?: boolean): void;
  // 向上滚动整页(不需要开启slide)
  slidePrev(): void;
  // 向下滚动整页(不需要开启slide)
  slideNext(): void;
}
```
