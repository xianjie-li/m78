import React from 'react';
import Carousel, { CarouselRef } from 'm78/carousel';
import 'm78/carousel/style';

import Button from 'm78/button';
import 'm78/button/style';

import img1 from '@/mock/img/1.jpg';
import img2 from '@/mock/img/2.jpg';
import img3 from '@/mock/img/3.jpg';

const Demo = () => {
  const ref = React.useRef<CarouselRef>(null!);

  return (
    <div>
      <Carousel ref={ref} width={320}>
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

      <div className="mt-32">
        <Button onClick={() => ref.current.prev()}>上一页</Button>
        <Button onClick={() => ref.current.next()}>下一页</Button>
        <Button onClick={() => ref.current.goTo(5)}>第5页</Button>
        <Button onClick={() => ref.current.goTo(5, true)}>第5页(无动画)</Button>
      </div>
    </div>
  );
};

export default Demo;
