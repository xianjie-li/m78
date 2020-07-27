import React from 'react';
import Button from '@lxjx/fr/button';
import '@lxjx/fr/button/style';

const ButtonDemoColor = () => (
  <div>
    <Button disabled>default</Button>
    <Button color="blue" disabled>
      blue
    </Button>
    <Button color="red" disabled>
      red
    </Button>
    <Button color="green" disabled>
      green
    </Button>
    <Button color="yellow" disabled>
      yellow
    </Button>
  </div>
);

export default ButtonDemoColor;
