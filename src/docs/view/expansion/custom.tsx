import React from 'react';
import Expansion, { ExpansionPane } from 'm78/expansion';
import { ExpandIconPosition } from 'm78/expansion/types';
import { Spacer } from 'm78/layout';
import Button from 'm78/button';
import data1 from '@/mock/data1';

const listSmall = data1.slice(0, 4);

const Custom = () => {
  return (
    <div>
      <h3>无样式</h3>
      <div>如果需要高度定制，可通过noStyle关闭所有非必要样式</div>

      <Spacer height={12} />

      <Expansion noStyle>
        {listSmall.map(item => (
          <ExpansionPane key={item.label} name={item.label} header={item.label}>
            {item.text}
          </ExpansionPane>
        ))}
      </Expansion>

      <Spacer height={60} />

      <h3>右侧放置展开标识</h3>

      <Expansion expandIconPosition={ExpandIconPosition.right}>
        {listSmall.map(item => (
          <ExpansionPane key={item.label} name={item.label} header={item.label}>
            {item.text}
          </ExpansionPane>
        ))}
      </Expansion>

      <Spacer height={60} />

      <h3>下方放置展开标识</h3>

      <Expansion expandIconPosition={ExpandIconPosition.bottom}>
        {listSmall.map(item => (
          <ExpansionPane key={item.label} name={item.label} header={item.label}>
            {item.text}
          </ExpansionPane>
        ))}
      </Expansion>

      <Spacer height={60} />

      <h3>自定义提示内容</h3>

      <Expansion
        expandIcon={_open => (
          <Button text color="primary">
            {_open ? '点击关闭' : '点击展开'}
          </Button>
        )}
        expandIconPosition={ExpandIconPosition.bottom}
      >
        {listSmall.map(item => (
          <ExpansionPane key={item.label} name={item.label} header={item.label}>
            {item.text}
          </ExpansionPane>
        ))}
      </Expansion>

      <Spacer height={60} />

      <h3>顶部完全定制</h3>
      <Expansion>
        {listSmall.map(item => (
          <ExpansionPane
            key={item.label}
            name={item.label}
            header={item.label}
            headerNode={
              <div
                style={{
                  backgroundColor: 'pink',
                  height: 36,
                  lineHeight: '36px',
                  textAlign: 'center',
                  border: '1px dashed blue',
                }}
              >
                这是一个完全自定义的顶部
              </div>
            }
          >
            {item.text}
          </ExpansionPane>
        ))}
      </Expansion>
    </div>
  );
};

export default Custom;
