---
title: Picture - 图片
group:
    title: 展示组件
    path: /view
    order: 4000
---

# Picture 图片

用于代替img元素使用，在图片加载失败时，会生成一张友好的占位图片, 并在图片加载过程中增加加载提示

## 示例
<code src="./demo.tsx" />

⚠ Picture必须包含正常的宽高，可通过className或style设置

## API
**`props`**
```tsx | pure
interface PictureProps extends ComponentBaseProps, React.PropsWithoutRef<JSX.IntrinsicElements['span']> {
  /** 图片的地址 */
  src?: string;
  /** 同 img alt */
  alt?: string;
  /** 使用指定的图片替换默认的错误占位图 */
  errorImg?: string;
  /** 挂载到生成的img上的className */
  imgClassName?: string;
  /** 挂载到生成的img上的style */
  imgStyle?: React.CSSProperties;
  /** 默认提供了imgClassName、imgStyle、alt、src几个最常用的参数，其他需要直接传递给图片的props通过此项传递 */
  imgProps?: React.PropsWithRef<JSX.IntrinsicElements['img']>;
}
```

**`相关接口`**
```tsx | pure
interface ComponentBaseProps {
  /** 包裹元素的类名 */
  className?: string;
  /** 包裹元素样式 */
  style?: React.CSSProperties;
}
```
