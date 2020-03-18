import React from 'react';
import Button from '@lxjx/fr/lib/button';
import '@lxjx/fr/lib/button/style';

const ButtonDemoColor = () => {
  return (
    <div>
      <Button>default</Button>
      <Button color="blue">blue</Button>
      <Button color="red">red</Button>
      <Button color="green">green</Button>
      <Button color="yellow">yellow</Button>
      <Button color="primary">primary</Button>
    </div>
  );
};

export default ButtonDemoColor;
