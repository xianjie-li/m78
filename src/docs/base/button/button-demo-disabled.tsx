import React from 'react';
import Button from '@lxjx/fr/lib/button';
import '@lxjx/fr/lib/button/style';

const ButtonDemoColor = () => {
  return (
    <div>
      <Button disabled>default</Button>
      <Button color="blue" disabled>blue</Button>
      <Button color="red" disabled>red</Button>
      <Button color="green" disabled>green</Button>
      <Button color="yellow" disabled>yellow</Button>
    </div>
  );
};

export default ButtonDemoColor;
