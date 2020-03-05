import React from 'react';
import Button from '@lxjx/flicker/lib/button';
import '@lxjx/flicker/lib/button/style';

const ButtonDemoColor = () => {
  return (
    <div>
      <Button color="red" circle outline size="large">丑</Button>
      <Button color="red" circle>亥</Button>
      <Button color="yellow" circle size="small">卯</Button>
      <Button color="green" circle size="mini">申</Button>
    </div>
  );
};

export default ButtonDemoColor;
