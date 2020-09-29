import React from 'react';
import Tab, { TabItem } from 'm78/tab';
import { Position } from 'm78/util';

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
