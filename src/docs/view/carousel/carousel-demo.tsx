import React from 'react';
import Carousel from 'm78/carousel';
import 'm78/carousel/style';

import img1 from '../../../mock/img/1.jpg';
import img2 from '../../../mock/img/2.jpg';
import img3 from '../../../mock/img/3.jpg';

const Demo = () => (
  <div>
    <p>支持通过滚轮、drag、控制器等方式进行操作</p>
    <Carousel width={320}>
      <img src={img1} alt="" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
      <img src={img2} alt="" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
      <img src={img3} alt="" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
    </Carousel>

    <p className="mt-32">关闭loop模式。当子项过多时会显示数字分页器</p>
    <Carousel loop={false} width={320}>
      <img src={img1} alt="" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
      <img src={img2} alt="" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
      <img src={img3} alt="" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
      <img src={img1} alt="" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
      <img src={img2} alt="" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
      <img src={img3} alt="" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
      <img src={img1} alt="" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
      <img src={img2} alt="" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
      <img src={img3} alt="" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
    </Carousel>

    <p className="mt-32">关闭分页控制器</p>
    <Carousel control={false} width={320}>
      <img src={img1} alt="" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
      <img src={img2} alt="" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
      <img src={img3} alt="" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
    </Carousel>

    <p className="mt-32">自动轮播</p>
    <Carousel autoplay={2000} style={{ width: 320 }}>
      <img src={img1} alt="" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
      <img src={img2} alt="" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
      <img src={img3} alt="" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
    </Carousel>
  </div>
);

export default Demo;
