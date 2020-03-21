import React from 'react';
import Button from '@lxjx/fr/lib/button';
import Icon from '@lxjx/fr/lib/icon';
import Message from '@lxjx/fr/lib/message';
import '@lxjx/fr/lib/button/style';
import '@lxjx/fr/lib/icon/style';

const ButtonDemoColor = () => (
  <div>
    <div>纯图标按钮</div>
    <Button icon>
      <Icon type="tag" />
    </Button>
    <Button color="red" icon>
      <Icon type="setting" />
    </Button>
    <Button color="green" icon disabled>
      <Icon type="question" />
    </Button>
    <Button color="blue" icon>
      <Icon type="search" />
    </Button>
    <Button color="yellow" icon>
      <Icon type="location" />
    </Button>
    <Button color="red" icon>
      李
    </Button>
    <Button color="red" icon size="large">
      <Icon type="setting" />
    </Button>
    <Button color="blue" icon>
      <Icon type="setting" />
    </Button>
    <Button color="green" icon size="small">
      <Icon type="setting" />
    </Button>
    <Button color="yellow" icon size="mini">
      <Icon type="setting" />
    </Button>

    <div className="mt-16">
      <div className="mb-16">文字图标混排</div>
      <Button>
        <Icon type="tag" />
        按钮
      </Button>
      <Button color="red">
        <Icon type="setting" />
        按钮
      </Button>
      <Button color="green">
        <Icon type="question" />
        按钮
      </Button>
      <Button color="blue">
        <Icon type="location" />
        按钮
      </Button>
      <Button color="yellow">
        <Icon type="zoomIn" />
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
          <Icon type="swapLeft" />
          点我
          <Icon type="bell" />
          脱发
          <Icon type="swapRight" />
        </Button>
      </div>
    </div>
  </div>
);

export default ButtonDemoColor;
