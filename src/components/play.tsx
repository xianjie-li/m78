import React, { useState } from 'react';
import Expansion, { ExpansionPane } from 'm78/expansion';
import { Spacer } from 'm78/layout';
import { SettingOutlined } from 'm78/icon';
import data1 from '@/mock/data1';
import { ExpandIconPosition } from 'm78/expansion/types';
import Button from 'm78/button';

const listSmall = data1.slice(0, 4);

const Play = () => {
  const [opens, setOpens] = useState(['Dart']);

  return (
    <div>
      <h1>基本使用</h1>

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

      <h1>手风琴</h1>

      <div>只会同时打开一个</div>

      <Expansion accordion>
        {listSmall.map(item => (
          <ExpansionPane key={item.label} name={item.label} header={item.label}>
            {item.text}
          </ExpansionPane>
        ))}
      </Expansion>

      <h1>嵌套</h1>

      <Expansion accordion>
        {listSmall.map(item => (
          <ExpansionPane key={item.label} name={item.label} header={item.label}>
            <Expansion accordion>
              {listSmall.map(it => (
                <ExpansionPane key={it.label} name={it.label} header={it.label}>
                  {it.text}
                </ExpansionPane>
              ))}
            </Expansion>
          </ExpansionPane>
        ))}
      </Expansion>

      <h1>定制</h1>

      <h3>无样式</h3>
      <div>如果需要高度定制，可通过noStyle关闭所有非必要样式</div>

      <Expansion noStyle>
        {listSmall.map(item => (
          <ExpansionPane key={item.label} name={item.label} header={item.label}>
            {item.text}
          </ExpansionPane>
        ))}
      </Expansion>

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
          <Button link color="primary">
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

      <h1>性能</h1>

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

      <Expansion transition={false} unmountOnExit>
        {listSmall.map(item => (
          <ExpansionPane key={item.label} name={item.label} header={item.label}>
            {item.text}
          </ExpansionPane>
        ))}
      </Expansion>
    </div>
  );
};

export default Play;
