import React, { useEffect, useRef, useState } from 'react';
import Scroller, { ScrollerRef } from 'm78/scroller';
import { UndoOutlined } from 'm78/icon';
import img1 from '@/mock/img/11.jpg';
import img2 from '@/mock/img/22.jpg';
import img3 from '@/mock/img/33.jpg';
import Carousel from 'm78/carousel';
import { createRandString } from '@lxjx/utils';
import { FixedSizeList, FixedSizeListProps } from 'react-window';
import Tips from 'm78/tips';
import sty from './play.module.scss';
import testImg from '../docs/view/scroller/test.jpg';

const Play = () => {
  return (
    <div>
      <div style={{ width: 300, height: 400, border: '1px solid #ccc', position: 'relative' }}>
        <Tips />
      </div>
    </div>
  );
};

export default Play;
