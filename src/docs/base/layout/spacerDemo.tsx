import React from 'react';
import { Divider, Spacer } from 'm78/layout';
import Button from 'm78/button';

const SpacerDemo = () => {
  return (
    <div>
      <h3>用法1</h3>
      <div className="color-second mb-16">
        传入width和height作为占位空白显示,
        传入width时，为内联模式，横向填充间距。传入height时，为块模式，纵向填充间距
      </div>

      <div>
        Lorem ipsum <Spacer width={80} /> dolor sit amet, consectetur <Spacer width={16} />
        adipisicing elit. Ad aliquid aperiam aspernatur debitis eaque earum, est et impedit sint
        <Spacer />
        tempore. Alias at aut corporis eligendi enim
        <Spacer height={40} />
        excepturi explicabo labore. Similique.
      </div>

      <Divider margin={50} />

      <h3>用法2</h3>
      <div className="color-second mb-16">
        传入一组子元素，在它们之间填充Spacer, width和height的传入规则与用法1一致
      </div>

      <Spacer width={12}>
        <Button>按钮</Button>
        <Button>按钮</Button>
        <Button>按钮</Button>
        <Button>按钮</Button>
      </Spacer>

      <Spacer height={12}>
        <Button>按钮</Button>
        <Button>按钮</Button>
        <Button>按钮</Button>
        <Button>按钮</Button>
      </Spacer>
    </div>
  );
};

export default SpacerDemo;
