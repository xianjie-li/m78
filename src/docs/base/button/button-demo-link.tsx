import React from 'react';
import { Button } from 'm78/button';

const ButtonDemoColor = () => (
  <div>
    <Button text>link</Button>
    <Button color="red" text>
      link
    </Button>
    <Button color="green" text disabled>
      link
    </Button>
    <Button color="blue" text href="/">
      link↗
    </Button>
    <Button color="yellow" text>
      link
    </Button>
    <Button color="primary" text>
      primary
    </Button>
  </div>
);

export default ButtonDemoColor;
