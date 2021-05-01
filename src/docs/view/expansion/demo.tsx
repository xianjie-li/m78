import React, { useState } from 'react';
import { Expansion, ExpansionPane } from 'm78/expansion';
import { Spacer } from 'm78/layout';
import { SettingOutlined } from 'm78/icon';
import data1 from '@/mock/data1';

const listSmall = data1.slice(0, 4);

const Demo = () => {
  const [opens, setOpens] = useState(['Dart']);

  return (
    <div>
      <h3>非受控模式</h3>

      <Expansion defaultOpens={['Vanilla JS']}>
        {listSmall.map(item => (
          <ExpansionPane key={item.label} name={item.label} header={item.label}>
            {item.text}
          </ExpansionPane>
        ))}
      </Expansion>

      <Spacer height={60} />

      <h3>受控模式</h3>

      <Expansion opens={opens} onChange={setOpens}>
        {listSmall.map(item => (
          <ExpansionPane key={item.label} name={item.label} header={item.label}>
            {item.text}
          </ExpansionPane>
        ))}
      </Expansion>

      <Spacer height={60} />

      <h3>带操作区</h3>

      <Expansion>
        {listSmall.map(item => (
          <ExpansionPane
            key={item.label}
            name={item.label}
            header={item.label}
            actions={<SettingOutlined />}
          >
            {item.text}
          </ExpansionPane>
        ))}
      </Expansion>
    </div>
  );
};

export default Demo;
