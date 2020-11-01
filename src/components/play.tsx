import React, { useState } from 'react';
import Expansion, { ExpansionPane } from 'm78/expansion';
import { Divider } from 'm78/layout';
import { SettingOutlined, ArrowDownOutlined } from 'm78/icon';

const Play = () => {
  return (
    <div>
      <Expansion defaultOpens={['pane2', 'pane3']} expandIconPosition="bottom">
        <ExpansionPane name="pane1" header="这是一段标题" actions={<SettingOutlined />}>
          <div>这是内容这是内容这是内容</div>
          <div>这是内容这是内容这是内容</div>
          <div>这是内容这是内容这是内容</div>
          <div>这是内容这是内容这是内容</div>
          <div>这是内容这是内容这是内容</div>
          <div>这是内容这是内容这是内容</div>
          <div>这是内容这是内容这是内容</div>
        </ExpansionPane>
        <ExpansionPane name="pane2" header="这是一段标题" actions={<SettingOutlined />}>
          <div>这是内容这是内容这是内容</div>
          <div>这是内容这是内容这是内容</div>
          <div>这是内容这是内容这是内容</div>
          <div>这是内容这是内容这是内容</div>
          <div>这是内容这是内容这是内容</div>
          <div>这是内容这是内容这是内容</div>
          <div>这是内容这是内容这是内容</div>
        </ExpansionPane>
        <ExpansionPane name="pane3" header="这是一段标题" actions={<SettingOutlined />}>
          <div>这是内容这是内容这是内容</div>
          <div>这是内容这是内容这是内容</div>
          <div>这是内容这是内容这是内容</div>
          <div>这是内容这是内容这是内容</div>
          <div>这是内容这是内容这是内容</div>
          <div>这是内容这是内容这是内容</div>
          <div>这是内容这是内容这是内容</div>
        </ExpansionPane>
      </Expansion>

      <Divider margin={50} />

      <Expansion />
    </div>
  );
};

export default Play;
