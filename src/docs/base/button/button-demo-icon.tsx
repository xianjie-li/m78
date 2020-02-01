import React from 'react';
import Button from '@lxjx/flicker/lib/button';
import Icon from '@lxjx/flicker/lib/icon';
import '@lxjx/flicker/lib/button/style';
import '@lxjx/flicker/lib/icon/style';


const ButtonDemoColor = () => {
  return (
    <div>
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

      <div className="mt-16">
        <Button>
          <Icon type="tag" />按钮
        </Button>
        <Button color="red">
          <Icon type="setting" />按钮
        </Button>
        <Button color="green">
          <Icon type="question" />按钮
        </Button>
        <Button color="blue">
          <Icon type="location" />按钮
        </Button>
        <Button color="yellow">
          <Icon type="zoomIn" />按钮
        </Button>
      </div>
    </div>
  );
};

export default ButtonDemoColor;
