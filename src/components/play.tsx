import React from 'react';
import { ExpansionPane, ExpandIconPosition } from 'm78/expansion';
import Button from 'm78/button';

const Play = () => {
  return (
    <div>
      <ExpansionPane
        className="gggg"
        style={{ border: '1px solid #eee' }}
        header="单独使用的Pane"
        expandIconPosition={ExpandIconPosition.right}
        expandIcon={(open, cls) => (
          <Button className={cls} text>
            {open ? '折叠' : '展开'}
          </Button>
        )}
      >
        单独使用的Pane单独使用的Pane单独使用的Pane单独使用的Pane单独使用的Pane单独使用的Pane单独使用的Pane
      </ExpansionPane>
    </div>
  );
};

export default Play;
