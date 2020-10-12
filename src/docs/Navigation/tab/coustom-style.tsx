import React from 'react';
import 'm78/article-box/style';

import Tab, { TabItem } from 'm78/tab';

import { Position, Size } from 'm78/util';
import { Divider } from 'm78/layout';
import { AlertOutlined, HomeOutlined, RedEnvelopeOutlined, UserOutlined } from 'm78/icon';
import sty from './sty.module.scss';

const Demo = () => (
  <div>
    <h3>一个带tab描述的示例</h3>
    <Tab size={Size.large}>
      <TabItem
        label={
          <div>
            <div>Vanilla JS</div>
            <div className="fs-12 color-second">Vanilla JS的描述</div>
          </div>
        }
        value={1}
      >
        <div className={sty.H300BorderBox}>一个功能强大，使用及其广泛的框架</div>
      </TabItem>
      <TabItem
        label={
          <div>
            <div>Dart</div>
            <div className="fs-12 color-second">Dart的描述</div>
          </div>
        }
        value={2}
      >
        <div className={sty.H300BorderBox}>
          Dart是面向对象的、类定义的、单继承的语言。它的语法类似C语言，可以转译为JavaScript，支持接口(interfaces)、混入(mixins)、抽象类(abstract
          classes)、具体化泛型(reified generics)、可选类型(optional typing)和sound type system
        </div>
      </TabItem>
      <TabItem
        label={
          <div>
            <div>Node</div>
            <div className="fs-12 color-second">Node的描述</div>
          </div>
        }
        value={3}
      >
        <div className={sty.H300BorderBox}>
          Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行环境。 Node.js
          使用了一个事件驱动、非阻塞式 I/O 的模型。
        </div>
      </TabItem>
      <TabItem
        label={
          <div>
            <div>Kotlin</div>
            <div className="fs-12 color-second">Kotlin的描述</div>
          </div>
        }
        value={4}
      >
        <div className={sty.H300BorderBox}>
          Kotlin可以编译成Java字节码，也可以编译成JavaScript，方便在没有JVM的设备上运行。除此之外Kotlin还可以编译成二进制代码直接运行在机器上（例如嵌入式设备或
          iOS）。
        </div>
      </TabItem>
    </Tab>

    <Divider margin={60} />

    <h3>标签页</h3>

    <Tab
      className={sty.MyTab}
      style={{
        width: 365,
        border: '1px solid #eee',
        lineHeight: 1.3,
        boxShadow: '0 -1px 4px rgba(0,0,0,0.2)',
      }}
      size={Size.large}
      position={Position.bottom}
      flexible
      noSplitLine
    >
      <TabItem
        label={
          <div className="tc">
            <HomeOutlined className="fs-20" />
            <div>首页</div>
          </div>
        }
        value={1}
      >
        <div className={sty.TextBox} style={{ height: 400 }}>
          首页
        </div>
      </TabItem>
      <TabItem
        label={
          <div className="tc">
            <RedEnvelopeOutlined className="fs-20" />
            <div>提现</div>
          </div>
        }
        value={2}
      >
        <div className={sty.TextBox}>提现</div>
      </TabItem>
      <TabItem
        label={
          <div className="tc">
            <AlertOutlined className="fs-20" />
            <div>通知</div>
          </div>
        }
        value={3}
      >
        <div className={sty.TextBox}>通知</div>
      </TabItem>
      <TabItem
        label={
          <div className="tc">
            <UserOutlined className="fs-20" />
            <div>我的</div>
          </div>
        }
        value={4}
      >
        <div className={sty.TextBox}>我的</div>
      </TabItem>
    </Tab>
  </div>
);

export default Demo;
