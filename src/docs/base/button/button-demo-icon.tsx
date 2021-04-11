import React from 'react';
import Button from 'm78/button';
import {
  TagOutlined,
  SettingOutlined,
  QuestionCircleOutlined,
  SearchOutlined,
  BellOutlined,
  BulbOutlined,
  CaretLeftOutlined,
  CaretRightOutlined,
} from 'm78/icon';
import Message from 'm78/message';

const ButtonDemoColor = () => (
  <div>
    <div>纯图标按钮</div>
    <Button icon>
      <TagOutlined />
    </Button>
    <Button color="red" icon>
      <SettingOutlined />
    </Button>
    <Button color="green" icon disabled>
      <QuestionCircleOutlined />
    </Button>
    <Button color="blue" icon>
      <SearchOutlined />
    </Button>
    <Button color="yellow" icon>
      <BellOutlined />
    </Button>
    <Button color="red" icon>
      李
    </Button>
    <Button color="primary" icon>
      周
    </Button>
    <Button color="red" icon size="large">
      <SettingOutlined />
    </Button>
    <Button color="blue" icon>
      <SettingOutlined />
    </Button>
    <Button color="green" icon size="small">
      <SettingOutlined />
    </Button>
    <Button color="yellow" icon size="mini">
      <SettingOutlined />
    </Button>

    <div className="mt-16">
      <div className="mb-16">文字图标混排</div>
      <Button>
        <TagOutlined />
        按钮
      </Button>
      <Button color="red">
        <SettingOutlined />
        按钮
      </Button>
      <Button color="green">
        <QuestionCircleOutlined />
        按钮
      </Button>
      <Button color="blue">
        <BellOutlined />
        按钮
      </Button>
      <Button color="yellow">
        <BulbOutlined />
        按钮
      </Button>
    </div>

    <div className="mt-16">
      当检测到children包含Icon组件和SvgIcon时(仅函数名匹配，防止单独使用Button时增加打包体积)，会自动为其添加适当的边距
      <div className="mt-16">
        <Button
          color="primary"
          onClick={() => Message.tips({ type: 'success', content: '恭喜您成功脱发一根!' })}
        >
          <CaretLeftOutlined />
          点我
          <BellOutlined />
          脱发
          <CaretRightOutlined />
        </Button>
      </div>
    </div>
  </div>
);

export default ButtonDemoColor;
