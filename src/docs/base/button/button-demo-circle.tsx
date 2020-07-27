import React from 'react';
import Button from '@lxjx/fr/button';
import '@lxjx/fr/button/style';

const ButtonDemoColor = () => (
  <div>
    <Button color="red" circle outline size="large">
      丑
    </Button>
    <Button color="red" circle>
      亥
    </Button>
    <Button color="yellow" circle size="small">
      卯
    </Button>
    <Button color="green" circle size="mini">
      申
    </Button>
  </div>
);

export default ButtonDemoColor;
