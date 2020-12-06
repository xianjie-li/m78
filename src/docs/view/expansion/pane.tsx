import React from 'react';
import { ExpansionPane } from 'm78/expansion';
import { Spacer } from 'm78/layout';
import { ExpandIconPosition } from 'm78/expansion/types';
import Button from 'm78/button';
import data1 from '@/mock/data1';

const listSmall = data1.slice(0, 4);

const Pane = () => {
  return (
    <div>
      <ExpansionPane header="单独使用的Pane">{listSmall[0].text}</ExpansionPane>

      <Spacer />

      <ExpansionPane
        style={{ border: '1px solid #eee' }}
        header="单独使用的Pane"
        expandIconPosition={ExpandIconPosition.bottom}
        expandIcon={open => <Button text>{open ? '折叠' : '展开'}</Button>}
      >
        {listSmall[1].text}
      </ExpansionPane>
    </div>
  );
};

export default Pane;
