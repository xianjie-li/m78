import React from 'react';
import ImagePreview from '@lxjx/fr/lib/image-preview';
import '@lxjx/fr/lib/viewer/style';

import Button from '@lxjx/fr/lib/button';
import '@lxjx/fr/lib/button/style';

import img1 from '@/mock/img/1.jpg';
import img2 from '@/mock/img/2.jpg';
import img3 from '@/mock/img/3.jpg';
import img4 from '@/mock/img/4.jpg';
import img5 from '@/mock/img/5.jpg';
import img6 from '@/mock/img/6.jpg';
import img7 from '@/mock/img/7.jpg';

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
    desc: '图片3图片3图片3图片3图片3图片3图片3图片3图片3图片3图片3图片3图片3图片3图片3图片3图片3图片3',
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
    desc: '图片3图片3图片3图片3图片3图片3图片3图片3图片3图片3图片3图片3图片3图片3图片3图片3图片3图片3',
  },
];

const Demo = () => {
  const [toggle, set] = React.useState(false);

  return (
    <div>
      <Button onClick={() => set(true)}>toggle</Button>
      <ImagePreview
        images={option}
        page={2}
        show={toggle}
        onClose={() => {
          set(false);
        }}
      />
    </div>
  );
};

export default Demo;
