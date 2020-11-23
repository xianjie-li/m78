import React from 'react';
import Expansion, { ExpansionPane } from 'm78/expansion';
import { Spacer } from 'm78/layout';
import data1 from '@/mock/data1';

const listSmall = data1.slice(0, 4);

const Performance = () => {
  return (
    <div>
      <h3>关闭动画</h3>
      <Expansion transition={false}>
        {listSmall.map(item => (
          <ExpansionPane key={item.label} name={item.label} header={item.label}>
            {item.text}
          </ExpansionPane>
        ))}
      </Expansion>

      <Spacer height={60} />

      <h3>卸载隐藏内容</h3>

      <div>
        默认情况下，面板内容在初次打开时渲染，并在关闭后持续存在，配置unmountOnExit后将在面板关闭后卸载内容
      </div>

      <Expansion unmountOnExit>
        {listSmall.map(item => (
          <ExpansionPane key={item.label} name={item.label} header={item.label}>
            {item.text}
          </ExpansionPane>
        ))}
      </Expansion>
    </div>
  );
};

export default Performance;
