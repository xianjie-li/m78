import Select, {SelectOptionItem} from '@lxjx/fr/lib/select';
import React, {useState, useRef} from 'react';

const data: SelectOptionItem[] = [
  {
    label: '标题一',
    type: 'title',
  },
  {
    label: '选项一',
    value: 1,
  },
  {
    label: '选项二',
    value: 2,
  },
  {
    label: '选项三',
    value: 3,
  },
  {
    type: 'divider',
  },
  {
    label: '选项四',
    value: 4,
  },
  {
    label: '选项五',
    value: 5,
  },
  {
    label: '选项六',
    value: 6,
  },
];

const Demo = () => (
  <div>
    <div>
      <Select options={data} multiple listMaxHeight={200}/>
    </div>
  </div>
);

export default Demo;
