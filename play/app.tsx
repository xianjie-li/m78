import React, { useEffect, useRef } from 'react';
import { m78Config } from 'm78/config';
import { Divider, MediaQuery, Grids, GridsItem } from 'm78/layout';
import { Button } from 'm78/button';

import './style.scss';

import sty from './style.module.scss';

const App = () => {
  const dark = m78Config.useState(state => state.darkMode);

  return (
    <div className="p-32">
      <Button onClick={() => m78Config.setState({ darkMode: !m78Config.getState().darkMode })}>
        {dark ? 'dark' : 'light'}
      </Button>

      <Divider />

      <MediaQuery>
        {meta => {
          return <div>{JSON.stringify(meta)}</div>;
        }}
      </MediaQuery>

      <div>
        一个类似bootstrap的栅格系统，由于是
        <div>* 核心计算通过js实现，所以比传统的静态css栅格拥有更强的能力, 比如小数位的栅格</div>
        <div>
          * 采用12格的栅格系统(相比24格心算更简单),
          但是得益于小数位栅格的支持，同样可以实现灵活的布局。 6 / 4 / 3 / 2.4 / 2
        </div>
        <div>* 通过flex布局实现，可以灵活的控制栅格定位行为</div>
        <div>* 超出当前行的栅格会换行显示</div>
      </div>

      <h2>基础栅格</h2>

      <div className="fs-12 color-second">
        使用`Grids`和`GridsItem`来进行栅格布局, 传入`col`来控制栅格数
      </div>

      <h2>offset</h2>
      <div className="fs-12 color-second">通过`offset`来为格设置左（负数）右偏移</div>

      <h2>排序</h2>
      <div className="fs-12 color-second">
        通过`move`来在不影响格布局流的情况下移动子项进行排序, 也可以通过order来进行排序(支持负数)
      </div>

      <h2>子项排列</h2>
      <div className="fs-12 color-second">
        通过`mainAlign`和`crossAlign`来分别控制子项在主轴和交叉轴上的排列方式
      </div>

      <h2>flex</h2>
      <div className="fs-12 color-second">`GridsItem`支持传入flex设置弹性系数</div>

      <h2>响应式</h2>
      <div className="fs-12 color-second">预设6种响应尺寸 `xs` `sm` `md` `lg` `xl` `xxl`</div>
      <div>
        <div>
          * 实际使用时不可能为每一个断点都设置值，所有断点遵循一套继承机制，以减少编码量: *
          断点会影响其后所有未设置值的断点，比如，设置了`xs`时,
          `xs`之后的所有断点都会继承`xs`的配置,
          如果`xs`后任意一个断点也设置了值，则后续断点会改为继承该断点
        </div>
        <div>* hidden的继承顺序与其他属性是相反的，也就是从大到小</div>
      </div>

      <Grids className={sty.layoutWrap} gutter={8} mainAlign="center" crossAlign="end">
        <GridsItem xs={12} md={6} xl={4}>
          <div className={sty.box}>xs:12 md:6 xl:4</div>
        </GridsItem>
        <GridsItem xs={12} md={6} xl={4}>
          <div className={sty.box}>xs:12 md:6 xl:4</div>
        </GridsItem>
        <GridsItem xs={12} md={12} xl={4}>
          <div className={sty.box}>xs:12 md:12 xl:4</div>
        </GridsItem>
      </Grids>

      <div className="fs-12 color-second">
        GridsItem的布局属性几乎都支持响应式设置，可以通过传入一个配置对象来设置他们!
        目前支持的属性为`col` `offset` `move` `order` `flex` `hidden` `align` `className` `style`
      </div>
      <Grids className={sty.layoutWrap} gutter={8}>
        <GridsItem
          xs={{ hidden: true }}
          sm={{ col: 12, className: 'border' }}
          md={{ col: 6, style: { backgroundColor: 'pink', height: 120 } }}
          xl={{ col: 4, offset: 2 }}
        >
          <div className={sty.box}>xs:hidden sm:12 md:6 xl:4:offset2</div>
        </GridsItem>
        <GridsItem xs={12} md={6} xl={4}>
          <div className={sty.box}>xs:12 md:6 xl:4</div>
        </GridsItem>
      </Grids>
    </div>
  );
};

/*
 * 分割线
 * */

export default App;
