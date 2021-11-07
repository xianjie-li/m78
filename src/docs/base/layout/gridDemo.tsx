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
import './style.scss';

const GridDemo = () => {
  return (
    <div>
      <h3>示例1</h3>

      <Grid style={{ fontSize: 32 }} complete={false}>
        <Center>
          <span className="tc">
            <QqOutlined />
            <div className="fs color-second" style={{ color: '#ed1f24' }}>
              QQ
            </div>
          </span>
        </Center>
        <Center>
          <span className="tc">
            <WechatOutlined />
            <div className="fs color-second" style={{ color: '#03d669' }}>
              Wechat
            </div>
          </span>
        </Center>
        <Center>
          <span className="tc">
            <TwitterOutlined />
            <div className="fs color-second" style={{ color: '#1da1f2' }}>
              Twitter
            </div>
          </span>
        </Center>
        <Center>
          <span className="tc">
            <AlipayCircleOutlined />
            <div className="fs color-second" style={{ color: '#1476fe' }}>
              Alipay
            </div>
          </span>
        </Center>
        <Center>
          <span className="tc">
            <TaobaoCircleOutlined />
            <div className="fs color-second" style={{ color: '#ff4900' }}>
              Taobao
            </div>
          </span>
        </Center>
        <Center>
          <span className="tc">
            <ZhihuOutlined />
            <div className="fs color-second" style={{ color: '#1992f5' }}>
              Zhihu
            </div>
          </span>
        </Center>
        <Center>
          <span className="tc">
            <InstagramOutlined />
            <div className="fs color-second" style={{ color: '#694bc8' }}>
              Instagram
            </div>
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

      <Grid
        count={4}
        style={{ width: 300 }}
        contClassName="d-layout-box2"
        border={false}
        spacing={12}
      >
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
