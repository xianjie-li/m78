import React from 'react';
import 'm78/article-box/style';

import Tab, { TabItem } from 'm78/tab';

import { Position } from 'm78/util';
import { Spacer } from 'm78/layout';
import sty from './sty.module.scss';

const Demo = () => (
  <div>
    <Tab style={{ width: 500 }}>
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
      <TabItem label="TypeScript" value={5}>
        <div className={sty.H300BorderBox}>
          TypeScript是一种由微软开发的开源、跨平台的编程语言。它是JavaScript的超集，最终会被编译为JavaScript代码。TypeScript添加了可选的静态类型系统、很多尚未正式发布的ECMAScript新特性（如装饰器
          [1]
          ）。2012年10月，微软发布了首个公开版本的TypeScript，2013年6月19日，在经历了一个预览版之后微软正式发布了正式版TypeScript。当前最新版本为TypeScript4.0
        </div>
      </TabItem>
      <TabItem label="React" value={6}>
        <div className={sty.H300BorderBox}>
          由于
          React的设计思想极其独特，属于革命性创新，性能出众，代码逻辑却非常简单。所以，越来越多的人开始关注和使用，认为它可能是将来
          Web 开发的主流工具。
        </div>
      </TabItem>
      <TabItem label="Vue" value={7}>
        <div className={sty.H300BorderBox}>
          Vue (读音 /vjuː/，类似于 view)
          是一套用于构建用户界面的渐进式JavaScript框架。与其它大型框架不同的是，Vue
          被设计为可以自底向上逐层应用。Vue 的核心库只关注视图层，方便与第三方库或既有项目整合。
        </div>
      </TabItem>
      <TabItem label="Angular" value={8}>
        <div className={sty.H300BorderBox}>
          Angular (通常是指 "Angular 2+" 或 "Angular v2 及更高版本")。是一个基于 TypeScript 的 开源
          Web 应用框架， 由 Google 的 Angular 团队以及社区共同领导。Angular 是由 AngularJS
          的同一个开发团队完全重写的。
        </div>
      </TabItem>
      <TabItem label="Java" value={9}>
        <div className={sty.H300BorderBox}>
          Java是一门面向对象编程语言，不仅吸收了C++语言的各种优点，还摒弃了C++里难以理解的多继承、指针等概念，因此Java语言具有功能强大和简单易用两个特征。Java语言作为静态面向对象编程语言的代表，极好地实现了面向对象理论，允许程序员以优雅的思维方式进行复杂的编程
        </div>
      </TabItem>
      <TabItem label="Wasm" value={10}>
        <div className={sty.H300BorderBox}>
          WebAssembly 源于Mozilla 发起的 Asm.js 项目，设计补充而非取代 JavaScript，
          它是一个二进制格式，容易翻译到原生代码，本地解码速度比 JS 解析快得多，让高性能的 Web
          应用在浏览器上运行成为可能，比如视频游戏、计算机辅助设计、视频和图像编辑、科学可视化等等。未来，现有的生产力应用和
          JavaScript 框架都有可能使用
          WebAssembly，能显著降低加载速度，同时改进运行性能。开发者可以将针对 CPU 密集计算的
          WebAssembly 库整合到现有的 Web 应用中。
        </div>
      </TabItem>
      <TabItem label="Pwa" value={11}>
        <div className={sty.H300BorderBox}>
          PWA（Progressive Web App）是一种理念，使用多种技术来增强web
          app的功能，可以让网站的体验变得更好，能够模拟一些原生功能，比如通知推送。在移动端利用标准化框架，让网页应用呈现和原生应用相似的体验。
        </div>
      </TabItem>
    </Tab>

    <Spacer height={60} />

    <Tab position={Position.left} height={300}>
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
      <TabItem label="TypeScript" value={5}>
        <div className={sty.H300BorderBox}>
          TypeScript是一种由微软开发的开源、跨平台的编程语言。它是JavaScript的超集，最终会被编译为JavaScript代码。TypeScript添加了可选的静态类型系统、很多尚未正式发布的ECMAScript新特性（如装饰器
          [1]
          ）。2012年10月，微软发布了首个公开版本的TypeScript，2013年6月19日，在经历了一个预览版之后微软正式发布了正式版TypeScript。当前最新版本为TypeScript4.0
        </div>
      </TabItem>
      <TabItem label="React" value={6}>
        <div className={sty.H300BorderBox}>
          由于
          React的设计思想极其独特，属于革命性创新，性能出众，代码逻辑却非常简单。所以，越来越多的人开始关注和使用，认为它可能是将来
          Web 开发的主流工具。
        </div>
      </TabItem>
      <TabItem label="Vue" value={7}>
        <div className={sty.H300BorderBox}>
          Vue (读音 /vjuː/，类似于 view)
          是一套用于构建用户界面的渐进式JavaScript框架。与其它大型框架不同的是，Vue
          被设计为可以自底向上逐层应用。Vue 的核心库只关注视图层，方便与第三方库或既有项目整合。
        </div>
      </TabItem>
      <TabItem label="Angular" value={8}>
        <div className={sty.H300BorderBox}>
          Angular (通常是指 "Angular 2+" 或 "Angular v2 及更高版本")。是一个基于 TypeScript 的 开源
          Web 应用框架， 由 Google 的 Angular 团队以及社区共同领导。Angular 是由 AngularJS
          的同一个开发团队完全重写的。
        </div>
      </TabItem>
      <TabItem label="Java" value={9}>
        <div className={sty.H300BorderBox}>
          Java是一门面向对象编程语言，不仅吸收了C++语言的各种优点，还摒弃了C++里难以理解的多继承、指针等概念，因此Java语言具有功能强大和简单易用两个特征。Java语言作为静态面向对象编程语言的代表，极好地实现了面向对象理论，允许程序员以优雅的思维方式进行复杂的编程
        </div>
      </TabItem>
      <TabItem label="Wasm" value={10}>
        <div className={sty.H300BorderBox}>
          WebAssembly 源于Mozilla 发起的 Asm.js 项目，设计补充而非取代 JavaScript，
          它是一个二进制格式，容易翻译到原生代码，本地解码速度比 JS 解析快得多，让高性能的 Web
          应用在浏览器上运行成为可能，比如视频游戏、计算机辅助设计、视频和图像编辑、科学可视化等等。未来，现有的生产力应用和
          JavaScript 框架都有可能使用
          WebAssembly，能显著降低加载速度，同时改进运行性能。开发者可以将针对 CPU 密集计算的
          WebAssembly 库整合到现有的 Web 应用中。
        </div>
      </TabItem>
      <TabItem label="Pwa" value={11}>
        <div className={sty.H300BorderBox}>
          PWA（Progressive Web App）是一种理念，使用多种技术来增强web
          app的功能，可以让网站的体验变得更好，能够模拟一些原生功能，比如通知推送。在移动端利用标准化框架，让网页应用呈现和原生应用相似的体验。
        </div>
      </TabItem>
    </Tab>
  </div>
);

export default Demo;
