import React from 'react';
import Tab, { TabItem } from 'm78/tab';
import { Position, Size } from 'm78/util';
import { Divider } from 'm78/layout';
import { AlertOutlined, HomeOutlined, RedEnvelopeOutlined, UserOutlined } from 'm78/icon';

import sty from './play.module.scss';

const Play = () => {
  return (
    <div>
      <Tab defaultIndex={2}>
        <TabItem label="标签1" value={1}>
          内容1
        </TabItem>
        <TabItem label="标签标签2" value={2}>
          <div style={{ height: 300 }}>内容2</div>
        </TabItem>
        <TabItem label="标3" value={3}>
          内容3
        </TabItem>
        <TabItem label="标签签4" value={4}>
          内容4
        </TabItem>
      </Tab>

      <Tab position={Position.left} height={400}>
        <TabItem label="标签1" value={1}>
          内容1
        </TabItem>
        <TabItem label="标签标签2" value={2}>
          <div style={{ height: 300 }}>内容2</div>
        </TabItem>
        <TabItem label="标3" value={3}>
          内容3
        </TabItem>
        <TabItem label="标签签4" value={4}>
          内容4
        </TabItem>
      </Tab>

      <Tab position={Position.right} height={400}>
        <TabItem label="标签1" value={1}>
          内容1
        </TabItem>
        <TabItem label="标签标签2" value={2}>
          <div style={{ height: 300 }}>内容2</div>
        </TabItem>
        <TabItem label="标3" value={3}>
          内容3
        </TabItem>
        <TabItem label="标签签4" value={4}>
          内容4
        </TabItem>
      </Tab>

      <Tab position={Position.bottom}>
        <TabItem label="标签1" value={1}>
          内容1
        </TabItem>
        <TabItem label="标签标签2" value={2}>
          <div style={{ height: 300 }}>内容2</div>
        </TabItem>
        <TabItem label="标3" value={3}>
          内容3
        </TabItem>
        <TabItem label="标签签4" value={4}>
          内容4
        </TabItem>
      </Tab>

      <Divider margin={100} />
      <h3>带描述</h3>

      <Tab defaultIndex={2} size={Size.large}>
        <TabItem
          label={
            <div>
              <div>标签1</div>
              <div className="fs-12 color-second">标签1的描述</div>
            </div>
          }
          value={1}
        >
          内容1
        </TabItem>
        <TabItem
          label={
            <div>
              <div>标签标签2</div>
              <div className="fs-12 color-second">标签2的描述</div>
            </div>
          }
          value={2}
        >
          <div style={{ height: 300 }}>内容2</div>
        </TabItem>
        <TabItem
          label={
            <div>
              <div>标3</div>
              <div className="fs-12 color-second">标签3的描述</div>
            </div>
          }
          value={3}
        >
          内容3
        </TabItem>
        <TabItem
          label={
            <div>
              <div>标签标签2</div>
              <div className="fs-12 color-second">标签2的描述</div>
            </div>
          }
          value={4}
        >
          内容4
        </TabItem>
      </Tab>

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

      {/* <Divider margin={100} /> */}
      {/* <h3>大小</h3> */}

      {/* <Tab size={Size.small}> */}
      {/*  <TabItem label="标签1" value={1} /> */}
      {/*  <TabItem label="标签2" value={2} /> */}
      {/*  <TabItem label="标签3" value={3} /> */}
      {/*  <TabItem label="标签4" value={4} /> */}
      {/* </Tab> */}
      {/* <Tab> */}
      {/*  <TabItem label="标签1" value={1} /> */}
      {/*  <TabItem label="标签2" value={2} /> */}
      {/*  <TabItem label="标签3" value={3} /> */}
      {/*  <TabItem label="标签4" value={4} /> */}
      {/* </Tab> */}
      {/* <Tab size={Size.large}> */}
      {/*  <TabItem label="标签1" value={1} /> */}
      {/*  <TabItem label="标签2" value={2} /> */}
      {/*  <TabItem label="标签3" value={3} /> */}
      {/*  <TabItem label="标签4" value={4} /> */}
      {/* </Tab> */}

      {/* <Divider margin={100} /> */}
      {/* <h3>方向</h3> */}

      {/* <Tab> */}
      {/*  <TabItem label="标签1" value={1} /> */}
      {/*  <TabItem label="标签2" value={2} /> */}
      {/*  <TabItem label="标签3" value={3} /> */}
      {/*  <TabItem label="标签4" value={4} /> */}
      {/* </Tab> */}
      {/* <Divider /> */}
      {/* <Tab position={Position.left}> */}
      {/*  <TabItem label="标签1" value={1} /> */}
      {/*  <TabItem label="标签2" value={2} /> */}
      {/*  <TabItem label="标签3" value={3} /> */}
      {/*  <TabItem label="标签4" value={4} /> */}
      {/* </Tab> */}
      {/* <Divider /> */}
      {/* <Tab position={Position.right}> */}
      {/*  <TabItem label="标签1" value={1} /> */}
      {/*  <TabItem label="标签2" value={2} /> */}
      {/*  <TabItem label="标签3" value={3} /> */}
      {/*  <TabItem label="标签4" value={4} /> */}
      {/* </Tab> */}
      {/* <Divider /> */}
      {/* <Tab position={Position.bottom}> */}
      {/*  <TabItem label="标签1" value={1} /> */}
      {/*  <TabItem label="标签2" value={2} /> */}
      {/*  <TabItem label="标签3" value={3} /> */}
      {/*  <TabItem label="标签4" value={4} /> */}
      {/* </Tab> */}

      {/* <Divider margin={100} /> */}
      {/* <h3>flexible</h3> */}

      {/* <Tab flexible> */}
      {/*  <TabItem label="标签1" value={1} /> */}
      {/*  <TabItem label="标签2" value={2} /> */}
      {/*  <TabItem label="标签3" value={3} /> */}
      {/*  <TabItem label="标签4" value={4} /> */}
      {/* </Tab> */}
    </div>
  );
};

export default Play;
