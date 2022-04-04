import React from 'react';
import { Button } from 'm78/button';

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
    <Button color="primary" disabled>
      primary
    </Button>
  </div>
);

export default ButtonDemoColor;
