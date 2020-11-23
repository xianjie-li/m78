import React from 'react';
import { Center, Divider, Grid } from 'm78/layout';
import {
  AlipayCircleOutlined,
  InstagramOutlined,
  QqOutlined,
  TaobaoCircleOutlined,
  TwitterOutlined,
  WechatOutlined,
  ZhihuOutlined,
} from 'm78/icon';

const boxSty: React.CSSProperties = {
  borderRadius: 4,
  background: 'rgba(0, 0, 0, 0.1)',
  padding: 12,
};

const GridDemo = () => {
  return (
    <div>
      <h3>示例1</h3>

      <Grid style={{ fontSize: 32 }} complete={false}>
        <Center>
          <span className="tc">
            <QqOutlined />
            <div className="fs-14 color-second">QQ</div>
          </span>
        </Center>
        <Center>
          <span className="tc">
            <WechatOutlined />
            <div className="fs-14 color-second">Wechat</div>
          </span>
        </Center>
        <Center>
          <span className="tc">
            <TwitterOutlined />
            <div className="fs-14 color-second">Twitter</div>
          </span>
        </Center>
        <Center>
          <span className="tc">
            <AlipayCircleOutlined />
            <div className="fs-14 color-second">Alipay</div>
          </span>
        </Center>
        <Center>
          <span className="tc">
            <TaobaoCircleOutlined />
            <div className="fs-14 color-second">Taobao</div>
          </span>
        </Center>
        <Center>
          <span className="tc">
            <ZhihuOutlined />
            <div className="fs-14 color-second">Zhihu</div>
          </span>
        </Center>
        <Center>
          <span className="tc">
            <InstagramOutlined />
            <div className="fs-14 color-second">Instagram</div>
          </span>
        </Center>
      </Grid>

      <Divider />

      <h3>示例2</h3>

      <Grid count={4} style={{ width: 300 }}>
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
      </Grid>

      <Divider />

      <h3>示例3</h3>

      <Grid count={4} style={{ width: 300 }} spacing={12}>
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
      </Grid>

      <Divider />

      <h3>示例4</h3>

      <Grid count={4} style={{ width: 300 }} contStyle={boxSty} border={false} spacing={12}>
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
      </Grid>
    </div>
  );
};

export default GridDemo;
