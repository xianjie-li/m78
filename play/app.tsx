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

      <Grids className={sty.layoutWrap} gutter={8}>
        <GridsItem col={6}>
          <div className={sty.box}>6</div>
        </GridsItem>
        <GridsItem col={6}>
          <div className={sty.box}>6</div>
        </GridsItem>

        <GridsItem col={12}>
          <div className={sty.box}>12</div>
        </GridsItem>

        <GridsItem col={4}>
          <div className={sty.box}>4</div>
        </GridsItem>
        <GridsItem col={4}>
          <div className={sty.box}>4</div>
        </GridsItem>
        <GridsItem col={4}>
          <div className={sty.box}>4</div>
        </GridsItem>

        <GridsItem col={2.4}>
          <div className={sty.box}>2.4</div>
        </GridsItem>
        <GridsItem col={2.4}>
          <div className={sty.box}>2.4</div>
        </GridsItem>
        <GridsItem col={2.4}>
          <div className={sty.box}>2.4</div>
        </GridsItem>
        <GridsItem col={2.4}>
          <div className={sty.box}>2.4</div>
        </GridsItem>
        <GridsItem col={2.4}>
          <div className={sty.box}>2.4</div>
        </GridsItem>

        <GridsItem col={3}>
          <div className={sty.box}>3</div>
        </GridsItem>
        <GridsItem col={3}>
          <div className={sty.box}>3</div>
        </GridsItem>
        <GridsItem col={3}>
          <div className={sty.box}>3</div>
        </GridsItem>
        <GridsItem col={3}>
          <div className={sty.box}>3</div>
        </GridsItem>
      </Grids>

      <h2>offset</h2>
      <div className="fs-12 color-second">通过`offset`来为格设置左（负数）右偏移</div>

      <Grids className={sty.layoutWrap} gutter={8}>
        <GridsItem col={5}>
          <div className={sty.box}>5</div>
        </GridsItem>
        <GridsItem col={5} offset={2}>
          <div className={sty.box}>5 / 2</div>
        </GridsItem>

        <GridsItem col={3}>
          <div className={sty.box}>3</div>
        </GridsItem>
        <GridsItem col={3} offset={1.5}>
          <div className={sty.box}>3 / 1.5</div>
        </GridsItem>
        <GridsItem col={3} offset={1.5}>
          <div className={sty.box}>3 / 1.5</div>
        </GridsItem>

        <GridsItem col={6} offset={3}>
          <div className={sty.box}>6 / 3</div>
        </GridsItem>
        <GridsItem col={2} offset={-2}>
          <div className={sty.box}>2 / -2</div>
        </GridsItem>
      </Grids>

      <h2>排序</h2>
      <div className="fs-12 color-second">
        通过`move`来在不影响格布局流的情况下移动子项进行排序, 也可以通过order来进行排序(支持负数)
      </div>

      <Grids className={sty.layoutWrap} gutter={8}>
        <GridsItem col={8} move={4}>
          <div className={sty.box}>8</div>
        </GridsItem>
        <GridsItem col={4} move={-8}>
          <div className={sty.box}>4</div>
        </GridsItem>
      </Grids>

      <Grids className={sty.layoutWrap} gutter={8}>
        <GridsItem col={7}>
          <div className={sty.box}>7</div>
        </GridsItem>
        <GridsItem col={5} order={-1}>
          <div className={sty.box}>5</div>
        </GridsItem>
      </Grids>

      <h2>子项排列</h2>
      <div className="fs-12 color-second">
        通过`mainAlign`和`crossAlign`来分别控制子项在主轴和交叉轴上的排列方式
      </div>

      <Grids className={sty.layoutWrap} gutter={8} mainAlign="between">
        <GridsItem col={2}>
          <div className={sty.box}>2</div>
        </GridsItem>
        <GridsItem col={2}>
          <div className={sty.box}>2</div>
        </GridsItem>
        <GridsItem col={2}>
          <div className={sty.box}>2</div>
        </GridsItem>
        <GridsItem col={2}>
          <div className={sty.box}>2</div>
        </GridsItem>
      </Grids>

      <Grids className={sty.layoutWrap} gutter={8} mainAlign="evenly">
        <GridsItem col={2}>
          <div className={sty.box}>2</div>
        </GridsItem>
        <GridsItem col={2}>
          <div className={sty.box}>2</div>
        </GridsItem>
        <GridsItem col={2}>
          <div className={sty.box}>2</div>
        </GridsItem>
        <GridsItem col={2}>
          <div className={sty.box}>2</div>
        </GridsItem>
      </Grids>

      <Grids className={sty.layoutWrap} gutter={8} mainAlign="around">
        <GridsItem col={2}>
          <div className={sty.box}>2</div>
        </GridsItem>
        <GridsItem col={2}>
          <div className={sty.box}>2</div>
        </GridsItem>
        <GridsItem col={2}>
          <div className={sty.box}>2</div>
        </GridsItem>
        <GridsItem col={2}>
          <div className={sty.box}>2</div>
        </GridsItem>
      </Grids>

      <Grids className={sty.layoutWrap} gutter={8} mainAlign="center">
        <GridsItem col={2}>
          <div className={sty.box}>2</div>
        </GridsItem>
        <GridsItem col={2}>
          <div className={sty.box}>2</div>
        </GridsItem>
        <GridsItem col={2}>
          <div className={sty.box}>2</div>
        </GridsItem>
        <GridsItem col={2}>
          <div className={sty.box}>2</div>
        </GridsItem>
      </Grids>

      <Grids className={sty.layoutWrap} gutter={8} mainAlign="start">
        <GridsItem col={2}>
          <div className={sty.box}>2</div>
        </GridsItem>
        <GridsItem col={2}>
          <div className={sty.box}>2</div>
        </GridsItem>
        <GridsItem col={2}>
          <div className={sty.box}>2</div>
        </GridsItem>
        <GridsItem col={2}>
          <div className={sty.box}>2</div>
        </GridsItem>
      </Grids>

      <Grids className={sty.layoutWrap} gutter={8} mainAlign="end">
        <GridsItem col={2}>
          <div className={sty.box}>2</div>
        </GridsItem>
        <GridsItem col={2}>
          <div className={sty.box}>2</div>
        </GridsItem>
        <GridsItem col={2}>
          <div className={sty.box}>2</div>
        </GridsItem>
        <GridsItem col={2}>
          <div className={sty.box}>2</div>
        </GridsItem>
      </Grids>

      <Grids
        className={sty.layoutWrap}
        style={{ height: 120 }}
        gutter={8}
        mainAlign="center"
        crossAlign="start"
      >
        <GridsItem col={2}>
          <div className={sty.box}>2</div>
        </GridsItem>
        <GridsItem col={2}>
          <div className={sty.box}>2</div>
        </GridsItem>
        <GridsItem col={2}>
          <div className={sty.box}>2</div>
        </GridsItem>
        <GridsItem col={2}>
          <div className={sty.box}>2</div>
        </GridsItem>
      </Grids>
      <Grids
        className={sty.layoutWrap}
        style={{ height: 120 }}
        gutter={8}
        mainAlign="center"
        crossAlign="center"
      >
        <GridsItem col={2} align="end">
          <div className={sty.box}>end</div>
        </GridsItem>
        <GridsItem col={2}>
          <div className={sty.box}>2</div>
        </GridsItem>
        <GridsItem col={2}>
          <div className={sty.box}>2</div>
        </GridsItem>
        <GridsItem col={2} align="start">
          <div className={sty.box}>start</div>
        </GridsItem>
      </Grids>
      <Grids
        className={sty.layoutWrap}
        style={{ height: 120 }}
        gutter={8}
        mainAlign="center"
        crossAlign="end"
      >
        <GridsItem col={2}>
          <div className={sty.box}>2</div>
        </GridsItem>
        <GridsItem col={2}>
          <div className={sty.box}>2</div>
        </GridsItem>
        <GridsItem col={2}>
          <div className={sty.box}>2</div>
        </GridsItem>
        <GridsItem col={2}>
          <div className={sty.box}>2</div>
        </GridsItem>
      </Grids>

      <h2>flex</h2>
      <div className="fs-12 color-second">`GridsItem`支持传入flex设置弹性系数</div>

      <Grids className={sty.layoutWrap} gutter={8} mainAlign="center" crossAlign="end">
        <GridsItem flex={1}>
          <div className={sty.box}>1</div>
        </GridsItem>
        <GridsItem flex={1}>
          <div className={sty.box}>1</div>
        </GridsItem>
        <GridsItem flex={2}>
          <div className={sty.box}>2</div>
        </GridsItem>
        <GridsItem flex={1}>
          <div className={sty.box}>1</div>
        </GridsItem>
      </Grids>

      <Grids className={sty.layoutWrap} gutter={8} mainAlign="center" crossAlign="end">
        <GridsItem>
          <div className={sty.box} style={{ width: 150 }}>
            150px
          </div>
        </GridsItem>
        <GridsItem flex={1}>
          <div className={sty.box}>1</div>
        </GridsItem>
        <GridsItem>
          <div className={sty.box} style={{ width: 150 }}>
            150px
          </div>
        </GridsItem>
      </Grids>

      <h2>响应式</h2>
      <div className="fs-12 color-second">预设6种响应尺寸 `xs` `sm` `md` `lg` `xl` `xxl`</div>
      <div>
        <div>
          * 断点具有继承性，较大的断点会继承较小断点的配置，比如，在未设置`md`但设置了`xs`时,
          `md`会继承`xs`的配置
        </div>
        <div>* hidden的继承顺序与其他属性是相反的</div>
      </div>

      <Grids className={sty.layoutWrap} gutter={8} mainAlign="center" crossAlign="end">
        <GridsItem xs={12} md={6} xl={4}>
          <div className={sty.box}>1</div>
        </GridsItem>
        <GridsItem xs={12} md={6} xl={4}>
          <div className={sty.box}>1</div>
        </GridsItem>
        <GridsItem xs={12} md={12} xl={4}>
          <div className={sty.box}>2</div>
        </GridsItem>
      </Grids>

      <div className="fs-12 color-second">
        GridsItem的布局属性几乎都支持响应式设置，可以通过传入一个配置对象来设置他们!
      </div>
      <Grids className={sty.layoutWrap} gutter={8} mainAlign="center" crossAlign="end">
        <GridsItem
          md={{
            col: 6,
            hidden: true,
          }}
          xl={{
            col: 4,
          }}
        >
          <div className={sty.box}>1</div>
        </GridsItem>
        <GridsItem xs={12} md={6} xl={4}>
          <div className={sty.box}>2</div>
        </GridsItem>
        <GridsItem xs={12} md={12} xl={4}>
          <div className={sty.box}>3</div>
        </GridsItem>
      </Grids>
    </div>
  );
};

/*
 * 分割线
 * */

export default App;
