import React from 'react';
import Button from '@lxjx/flicker/lib/button';
import '@lxjx/flicker/lib/button/style';

const ButtonDemoColor = () => {
  return (
    <div>
      <Button block size="mini">block</Button>
      <Button color="yellow" block size="mini">block</Button>
      <Button color="red" block size="small">block</Button>
      <Button color="green" block>block</Button>
      <Button color="blue" block size="large">block</Button>
    </div>
  );
};

export default ButtonDemoColor;
