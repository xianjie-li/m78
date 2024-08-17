<h1 align="center" style="color: #61dafb;">Animate tools</h1>

<br>

<p align="center" style="color:#666">Tools related to animation</p>

<br>


## Getting Started

1. Install package

```bash
npm install @m78/smooth-scroll
```

2. Import APIs

```js
import { 
  // 用于在滚动边缘执行拖拽等操作时执行自动滚动以显示遮挡内容
  createAutoScroll,
  // 根据传入的持续时间和曲线, 在持续时间内的每一个渲染帧触发onChange并传入当前值(0~1)
  curveRun,
  // 与css三次贝塞尔曲线入参相同的(x1, y1, x2, y2)三次贝塞尔曲线值计算
  cubicBezier,
  // 实现拖拽平滑滚动, 支持touch/鼠标操作
  DragScroll, 
  // requestAnimationFrame的简单兼容性包装，返回一个清理函数而不是一个清理标记
  raf,
  // 用于将requestAnimationFrame使用在指令式用法中, 比如拖拽移动dom的场景, rafCaller能确保每帧只会对最新一次回调进行调用, 其他回调会被直接忽略
  rafCaller,
  // 提供平滑处理的 onwheel 事件, 在鼠标/触控板等方式触发wheel时均能增强滚动体验
  SmoothWheel, 
  // 接收每次x/y轴的偏移, 根据触发的区间进行补帧后平滑的触发trigger, 使用者可在trigger事件中更新实际的位置, 它是DragScroll和SmoothWheel的底层实现
	SmoothTrigger,
} from "@m78/animated-tools";
```


