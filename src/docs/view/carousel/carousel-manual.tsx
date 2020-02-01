import React from 'react';
import Carousel, { CarouselRef } from '@lxjx/flicker/lib/carousel';
import '@lxjx/flicker/lib/carousel/style';

import Button from '@lxjx/flicker/lib/button';
import '@lxjx/flicker/lib/button/style';

import img1 from '@/src/mock/img/1.jpg';
import img2 from '@/src/mock/img/2.jpg';
import img3 from '@/src/mock/img/3.jpg';

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
