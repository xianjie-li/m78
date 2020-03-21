---
title: Scroll - 滚动
group:
    title: 集成组件
    path: /integration
    order: 7500
---

# Scroll 滚动

创建一个滚动区域，提供便捷的滚动控制能力以及上拉加载、下拉刷新等常见业务功能。

## 基础示例

<code src="./demo.tsx" />

## 流程解析
### 下拉刷新
开启下拉刷新，你需要完成以下步骤  

1. 注册组件, `pullDown`选项传入`true`  

2. 编写并传入`onPullDown(pullDownFinish)`回调, 此时用户已经可以进行下拉操作  

3. 用户下拉后，会触发`onPullDown(pullDownFinish)`回调并执行其中的刷新逻辑  

4. 在完成刷新逻辑的最后，调用作为参数传入的`pullDownFinish(success?: boolean)`通知刷新完成并关闭动画  

5. 如果刷新发生错误，为`pullDownFinish(success?: boolean)`传入false给予用户反馈  

### 上拉加载
开启上拉，你需要完成以下步骤  

1. 注册组件, `pullUp`选项传入`true`  

2. 声明组件数据初始状态，一般为`{ data: [], page: 0 }`  

2. 编写并传入`onPullUp(pullUpFinish, skip)`回调, 此时用户已经可以进行上拉操作  

3. 用户上拉后，会执行到`onPullUp`，此时，判断skip是否为true， 为true时作数据并更新合并，不执行页码增加等操作，为false时增加页码并更新请求数据和合并，(组件内部只在发生错误和触发重试时会传入skip)  

4. 加载操作完成后，执行作为参数传入的`pullUpFinish(dataLength?: number, hasError?: boolean)`，dataLength为当次请求获取到的数据总量，hasError为是否发生错误，传入hasError: true时，参数1无效 
 
5. (可选) 为组件传入配置`hasData={data.length}`, 可以帮助组件提供更友好的初始化加载空数据提示  

## API
**`props`**
```tsx | pure
interface ScrollProps extends ComponentBaseProps {
  /** 下拉刷新开关, 默认关闭 */
  pullDown?: boolean;
  /** 下拉刷新触发回调 */
  onPullDown?: (pullDownFinish: ScrollRef['pullDownFinish']) => void;
  /** 上拉加载开关, 默认关闭 */
  pullUp?: boolean;
  /** 上拉事件触发回调, 当skip为true，说明该操作由内部触发(失败、空数据重试等), 并且不期望执行增加页码等操作，应仅仅执行数据更新 */
  onPullUp?: (pullUpFinish: ScrollRef['pullUpFinish'], skip?: boolean) => void;
  /** 触发上拉加载的距离， 默认160 */
  threshold?: number;
  /** 滚动事件 TODO: 引入正确类型 */
  onScroll?: (meta: any) => void;
  /** 指定onScroll的防抖时间 */
  throttleTime?: number;
  /**
   * hasData 当前是否有数据. 通常会传入data.length。用于实现更好的首次加载、无数据时的反馈等。
   * 因为Scroll内部是不知道数据总量的， */
  hasData?: boolean;
  /** 是否显示返回顶部按钮 */
  backTop?: boolean;
  /** 包裹组件样式 */

  children: React.ReactNode;
}
```



**`ref`**
```tsx | pure
interface ScrollRef {
  /** 结束下拉刷新，将刷新是否成功作为第一个参数传入, 默认成功 */
  pullDownFinish(isSuccess?: boolean): void;
  /** 手动触发下拉刷新，当正在进行下拉或上拉中的任意操作时，调用无效 */
  triggerPullDown(): void;
  /** 结束下拉加载，请求到数据时，将数据长度作为第一个参数传入(用于更友好的反馈，默认为0), 发生错误时，传入参数二, 此时第一个参数会被忽略 */
  pullUpFinish(dataLength?: number, hasError?: boolean): void;
  /** 重置上拉加载, 当没有数据时，上拉加载会被禁用，通过此方法可重新开启 */
  resetPullUp(): void;
  /** 手动触发加载，一般用于首次进入时在合适的时机调用加载数据。
   * skip会传入onPullUp函数用于识别是否需要执行增加页码等操作，在
   * 组件内部，当进行重试、初始化onPullUp调用等操作时会传入true
   * */
  triggerPullUp(skip?: boolean): void;
  /** 滚动到指定位置, 传immediate则跳过动画 */
  scrollTo(to: number, immediate?: boolean): void;
  /** 根据当前位置滚动指定距离, 正数或负数, 传immediate则跳过动画  */
  scrollBy(offset: number, immediate?: boolean): void;
  /** 滚动到指定元素位置，如果是字符，会调用querySelector进行获取，没有找到时不会执行任何操作 */
  scrollToElement(el: HTMLElement | string): void;
  /** 对滚动节点的引用 */
  el: HTMLDivElement;
}
```


**相关接口**
```tsx | pure
interface ComponentBaseProps {
  /** 包裹元素的类名 */
  className?: string;
  /** 包裹元素样式 */
  style?: React.CSSProperties;
}
```











