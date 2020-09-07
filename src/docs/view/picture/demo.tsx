import React from 'react';
import Picture from 'm78/picture';
import 'm78/picture/style';

import Config from 'm78/config';

import img1 from '@/mock/img/1.jpg';
import img2 from '@/mock/img/2.jpg';
import img3 from '@/mock/img/3.jpg';
import img4 from '@/mock/img/4.jpg';
import img5 from '@/mock/img/5.jpg';
import img6 from '@/mock/img/6.jpg';
import img7 from '@/mock/img/7.jpg';

const imgs = [img1, img2, '', img3, img4, undefined, img5, img6, img7];

const imgStyle: React.CSSProperties = {
  width: 100,
  height: 100,
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

    <div className="mt-32">
      <h4>全局配置加载错误时展示的图片</h4>
      <Config.Provider
        value={{
          pictureErrorImg: img1,
        }}
      >
        <div>
          <Picture style={imgStyle} src={img2} />
          <Picture style={imgStyle} src="" />
        </div>
      </Config.Provider>
    </div>
  </div>
);

export default Demo;
