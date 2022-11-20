import React from "react";
import {
  TagOutlined,
  SettingOutlined,
  QuestionCircleOutlined,
  SearchOutlined,
  BellOutlined,
  BulbOutlined,
} from "@ant-design/icons";
import { Button } from "m78/button";

const ButtonDemoColor = () => (
  <div>
    <div className="mb-16">纯图标</div>

    <Button icon>
      <TagOutlined />
    </Button>
    <Button color="red" icon>
      <SettingOutlined />
    </Button>
    <Button color="green" icon disabled>
      <QuestionCircleOutlined />
    </Button>
    <Button color="primary" icon>
      <SearchOutlined />
    </Button>
    <Button color="orange" icon>
      <BellOutlined />
    </Button>
    <Button color="red" icon>
      李
    </Button>

    <div className="mt-16">
      <Button color="green" icon size="small">
        <SettingOutlined />
      </Button>
      <Button color="primary" icon>
        <SettingOutlined />
      </Button>
      <Button color="red" icon size="large">
        <SettingOutlined />
      </Button>
    </div>

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
      <Button color="primary">
        <BellOutlined />
        按钮
      </Button>
      <Button color="orange">
        <BulbOutlined />
        按钮
      </Button>
      <Button color="primary">
        <BellOutlined />
        文本
        <BellOutlined />
        文本
        <SettingOutlined />
      </Button>
    </div>
  </div>
);

export default ButtonDemoColor;
