import React from 'react';

import { Tab, TabItem } from 'm78/tab';

import sty from './sty.module.scss';

const Demo = () => (
  <div>
    <Tab flexible>
      <TabItem label="Vanilla JS" value={1}>
        <div className={sty.H300BorderBox}>一个功能强大，使用及其广泛的框架</div>
      </TabItem>
      <TabItem label="Dart" value={2}>
        <div className={sty.H300BorderBox}>
          Dart是面向对象的、类定义的、单继承的语言。它的语法类似C语言，可以转译为JavaScript，支持接口(interfaces)、混入(mixins)、抽象类(abstract
          classes)、具体化泛型(reified generics)、可选类型(optional typing)和sound type system
        </div>
      </TabItem>
      <TabItem label="Node" value={3}>
        <div className={sty.H300BorderBox}>
          Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行环境。 Node.js
          使用了一个事件驱动、非阻塞式 I/O 的模型。
        </div>
      </TabItem>
      <TabItem label="Kotlin" value={4}>
        <div className={sty.H300BorderBox}>
          Kotlin可以编译成Java字节码，也可以编译成JavaScript，方便在没有JVM的设备上运行。除此之外Kotlin还可以编译成二进制代码直接运行在机器上（例如嵌入式设备或
          iOS）。
        </div>
      </TabItem>
    </Tab>
  </div>
);

export default Demo;
