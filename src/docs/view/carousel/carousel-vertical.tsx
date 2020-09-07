import React from 'react';
import Carousel from 'm78/carousel';

import img1 from '@/mock/img/1.png';
import img2 from '@/mock/img/2.png';
import img3 from '@/mock/img/3.png';

const Demo = () => (
  <div>
    <Carousel wheel height={500} width={320} vertical>
      <img src={img1} alt="" style={{ width: '100%', height: 500, objectFit: 'cover' }} />
      <img src={img2} alt="" style={{ width: '100%', height: 500, objectFit: 'cover' }} />
      <img src={img3} alt="" style={{ width: '100%', height: 500, objectFit: 'cover' }} />
    </Carousel>
  </div>
);

export default Demo;
