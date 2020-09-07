import React from 'react';
import ImagePreview from 'm78/image-preview';
import 'm78/viewer/style';

import img1 from '@/mock/img/1.png';
import img2 from '@/mock/img/2.png';
import img3 from '@/mock/img/3.png';
import img4 from '@/mock/img/4.png';
import img5 from '@/mock/img/5.png';
import img6 from '@/mock/img/6.png';
import img7 from '@/mock/img/7.png';

const option = [
  {
    img: img1,
    desc: '图片1图片1图片1图片1图片1图片1',
  },
  {
    img: img2,
  },
  {
    img: img3,
    desc:
      '图片3图片3图片3图片3图片3图片3图片3图片3图片3图片3图片3图片3图片3图片3图片3图片3图片3图片3',
  },
  {
    img: img4,
  },
  {
    img: img5,
    desc: '图片1图片1图片1图片1图片1图片1',
  },
  {
    img: img6,
  },
  {
    img: img7,
    desc:
      '图片3图片3图片3图片3图片3图片3图片3图片3图片3图片3图片3图片3图片3图片3图片3图片3图片3图片3',
  },
];

const imgStyle: React.CSSProperties = {
  width: 100,
  height: 220,
  objectFit: 'cover',
  margin: 2,
  borderRadius: '4px',
};

const Demo = () => (
  <div>
    {option.map((item, ind) => (
      <img
        key={ind}
        style={imgStyle}
        src={item.img}
        alt=""
        onClick={() => {
          ImagePreview.api({
            images: option,
            page: ind,
          });
        }}
      />
    ))}
  </div>
);

export default Demo;
