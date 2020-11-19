import React from 'react';
import Carousel, { CarouselRef } from 'm78/carousel';
import 'm78/carousel/style';

import 'm78/button/style';

import img1 from '@/mock/img/11.jpg';
import img2 from '@/mock/img/22.jpg';
import img3 from '@/mock/img/33.jpg';
import img4 from '@/mock/img/44.jpg';
import img5 from '@/mock/img/55.jpg';

const DemoPerformance = () => {
  const ref = React.useRef<CarouselRef>(null!);

  return (
    <div>
      <h3>卸载不可见项</h3>
      <Carousel ref={ref} width={320} invisibleUnmount loop={false}>
        <img src={img1} alt="" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
        <img src={img2} alt="" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
        <img src={img3} alt="" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
        <img src={img4} alt="" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
        <img src={img5} alt="" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
        <img src={img1} alt="" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
        <img src={img2} alt="" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
        <img src={img3} alt="" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
        <img src={img4} alt="" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
      </Carousel>
      <h3 className="mt-24">卸载不可见项(带loop)</h3>
      <Carousel ref={ref} width={320} invisibleUnmount>
        <img src={img1} alt="" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
        <img src={img2} alt="" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
        <img src={img3} alt="" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
        <img src={img4} alt="" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
        <img src={img5} alt="" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
        <img src={img1} alt="" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
        <img src={img2} alt="" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
        <img src={img3} alt="" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
        <img src={img4} alt="" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
      </Carousel>

      <h3 className="mt-32">隐藏不可见项</h3>
      <Carousel ref={ref} width={320} invisibleHidden loop={false}>
        <img src={img1} alt="" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
        <img src={img2} alt="" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
        <img src={img3} alt="" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
        <img src={img4} alt="" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
        <img src={img5} alt="" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
        <img src={img1} alt="" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
        <img src={img2} alt="" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
        <img src={img3} alt="" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
        <img src={img4} alt="" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
      </Carousel>
      <h3 className="mt-24">隐藏不可见项(带loop)</h3>
      <Carousel ref={ref} width={320} invisibleHidden>
        <img src={img1} alt="" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
        <img src={img2} alt="" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
        <img src={img3} alt="" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
        <img src={img4} alt="" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
        <img src={img5} alt="" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
        <img src={img1} alt="" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
        <img src={img2} alt="" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
        <img src={img3} alt="" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
        <img src={img4} alt="" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
      </Carousel>
    </div>
  );
};

export default DemoPerformance;
