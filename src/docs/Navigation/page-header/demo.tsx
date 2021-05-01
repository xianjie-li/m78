import React from 'react';
import { PageHeader } from 'm78/page-header';
import { Spacer } from 'm78/layout';
import { Button } from 'm78/button';
import { HeartOutlined, LeftOutlined, SettingOutlined } from 'm78/icon';

const Demo = () => (
  <div>
    <h3>最基本的使用</h3>

    <PageHeader title="这是标题" desc="这是一段描述~" />

    <Spacer height={50} />

    <h3>带操作区</h3>

    <PageHeader
      title="这是标题"
      desc="这是一段描述~"
      actions={
        <Button icon>
          <SettingOutlined />
        </Button>
      }
    />

    <Spacer height={16} />

    <PageHeader
      title="这是标题"
      desc="这是一段描述~"
      actions={
        <>
          <Button icon>
            <SettingOutlined />
          </Button>
          <Button icon color="red">
            <HeartOutlined />
          </Button>
        </>
      }
    />

    <Spacer height={50} />

    <h3>居中标题</h3>

    <PageHeader
      centerTitle
      title="这是标题"
      desc="这是一段描述~"
      actions={
        <Button icon>
          <SettingOutlined />
        </Button>
      }
    />

    <Spacer height={16} />

    <PageHeader
      centerTitle
      title="这是标题"
      actions={
        <Button icon>
          <SettingOutlined />
        </Button>
      }
    />

    <Spacer height={50} />

    <h3>带颜色</h3>

    <PageHeader
      color
      title="这是标题"
      desc="这是一段描述~"
      actions={
        <Button icon>
          <SettingOutlined />
        </Button>
      }
    />

    <Spacer height={16} />

    <PageHeader
      color="#1890ff"
      white
      title="这是标题"
      desc="这是一段描述~"
      actions={
        <Button icon>
          <SettingOutlined />
        </Button>
      }
    />

    <Spacer height={50} />

    <h3>定制</h3>

    <PageHeader
      border
      title="边框模式"
      desc="这是一段描述~"
      actions={
        <Button icon>
          <SettingOutlined />
        </Button>
      }
    />

    <Spacer height={16} />

    <PageHeader
      title="底部放置内容"
      desc="这是一段描述~"
      actions={
        <Button icon>
          <SettingOutlined />
        </Button>
      }
      bottom={
        <div>
          <div>底部文本内容, 底部文本内容底部文本内容底部文本内容底部文本内容</div>
          <div>底部文本内容, 底部文本内容底部文</div>
        </div>
      }
    />

    <Spacer height={16} />

    <PageHeader title="定制返回图标" desc="这是一段描述~" backIcon={<LeftOutlined />} />
  </div>
);

export default Demo;
