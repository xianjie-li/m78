import React from 'react';

import Check from 'm78/check';

const Demo = () => (
  <div>
    <h3>选择你最爱的水果</h3>
    <Check.Group>
      <Check label="🍉西瓜" />
      <Check label="🍌香蕉" />
      <Check disabled label="🍎苹果(缺货)" />
      <Check label="🍇葡萄" />
      <Check partial label="🍓草莓" />
    </Check.Group>

    <h3 className="mt-32">选择你的职业</h3>
    <Check.Group>
      <Check type="radio" label="🎅圣诞老人‍" />
      <Check type="radio" label="🕵️侦探" />
      <Check type="radio" label="🧟‍♀️僵尸" />
      <Check type="radio" label="🧛‍♀️‍吸血鬼" />
    </Check.Group>

    <h3 className="mt-32">点击开灯</h3>
    <Check.Group>
      <Check disabled type="switch" label="卧室‍" />
      <Check type="switch" label="厨房" />
      <Check type="switch" label="客厅" />
      <Check type="switch" label="走廊" />
    </Check.Group>

    <h3 className="mt-32">定制文本</h3>
    <Check.Group>
      <Check disabled defaultChecked type="switch" label="我同意‍" beforeLabel="我不同意" />

      <Check type="switch" switchOff="关" switchOn="开" />

      <Check type="switch" switchOff="off" switchOn="on" />
    </Check.Group>

    <h3 className="mt-32">block模式</h3>
    <div>
      <Check label="🍉西瓜" block />
      <Check label="🍌香蕉" block />
      <Check disabled label="🍎苹果(缺货)" block />
      <Check label="🍇葡萄" block />
    </div>
  </div>
);

export default Demo;
