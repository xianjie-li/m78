import React from 'react';
import Button from '@lxjx/fr/lib/button';
import '@lxjx/fr/lib/button/style';

const ButtonDemoColor = () => {
  return (
    <div>
      <Button color="red" block size="small">block</Button>
      <Button color="green" block>block</Button>
      <Button color="blue" block size="large">block</Button>
    </div>
  );
};

export default ButtonDemoColor;
