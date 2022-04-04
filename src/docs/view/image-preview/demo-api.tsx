import React from 'react';
import { ImagePreview } from 'm78/image-preview';

import { Button } from 'm78/button';
import 'm78/button/style';

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

const Demo = () => (
  <div>
    <Button
      onClick={() => {
        const [ref, id] = ImagePreview.api({
          images: option,
          page: 5,
        });

        console.log(ref, id);
      }}
    >
      toggle
    </Button>
  </div>
);

export default Demo;
