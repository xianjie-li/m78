import React from 'react';
import './style.scss';

import {
  HomeOutlined,
  SettingFilled,
  SmileOutlined,
  SyncOutlined,
  LoadingOutlined,
  SmileTwoTone,
  HeartTwoTone,
  CheckCircleTwoTone,
  SuccessIcon,
} from '@lxjx/fr/lib/icon2';

const IconDemo = () => (
  <div className="d-antd-icons-demo">
    <HomeOutlined />
    <SettingFilled />
    <SmileOutlined />
    <SyncOutlined spin />
    <SmileOutlined rotate={180} />
    <LoadingOutlined />
    <SmileTwoTone />
    <HeartTwoTone twoToneColor="#eb2f96" />
    <CheckCircleTwoTone twoToneColor="#52c41a" />
    <SuccessIcon />
  </div>
);

export default IconDemo;
