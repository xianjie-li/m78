import React from 'react';
import Button from 'm78/button';
import 'm78/button/style';

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
