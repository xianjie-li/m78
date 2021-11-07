import React from 'react';
import { Picture } from 'm78/picture';
import 'm78/picture/style';

import img1 from '@/mock/img/11.jpg';
import img2 from '@/mock/img/22.jpg';
import img3 from '@/mock/img/33.jpg';
import img4 from '@/mock/img/44.jpg';
import img5 from '@/mock/img/55.jpg';
import img6 from '@/mock/img/111.jpg';
import img7 from '@/mock/img/222.jpg';

const imgs = [
  'https://img.3dmgame.com/uploads/allimg/170727/379-1FHGF517-50.jpg',
  img1,
  img2,
  '',
  img3,
  img4,
  undefined,
  img5,
  img6,
  img7,
];

const imgStyle: React.CSSProperties = {
  width: 140,
  height: 140,
  objectFit: 'cover',
  margin: 2,
  borderRadius: '4px',
};

const Demo = () => (
  <div>
    {imgs.map((item, key) => (
      <Picture key={key} style={imgStyle} src={item} />
    ))}

    <div className="mt-32">
      <h4>使用自定义文本</h4>
      <Picture style={imgStyle} src="" errorNode="出错啦!😭" />
    </div>
  </div>
);

export default Demo;
