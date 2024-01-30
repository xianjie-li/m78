<h1 align="center" style="color: #61dafb;">M78 Smooth Scroll</h1>

<br>

<p align="center" style="color:#666">Provide tools related to scrolling, such as drag scrolling, wheel event optimization, and automatic edge scrolling</p>

<br>



## Features

- Implement drag smooth scrolling, support touch/mouse operations

- Provide smooth processing of onwheel events, which can enhance the scrolling experience when triggered by mouse/touchpad and other scroll methods

-  Perform automatic scrolling when performing drag or other operations at the scrolling edge

  

## Getting Started

1. Install package

```bash
npm install @m78/smooth-scroll
```

2. Main APIs

```js
import { DragScroll, SmoothWheel, createAutoScroll } from "@m78/smooth-scroll";
```



## API

### DragScroll

[source code](./src/drag-scroll.ts)



### SmoothWheel

[source code](./src/smooth-wheel.ts)



### createAutoScroll

[source code](./src/auto-scroll.ts)
