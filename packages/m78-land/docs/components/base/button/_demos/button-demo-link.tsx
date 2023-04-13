import React from "react";
import { Button } from "m78";

const ButtonDemoColor = () => (
  <div>
    <Button text>link</Button>
    <Button color="red" text>
      link
    </Button>
    <Button color="green" text disabled>
      link
    </Button>
    <Button color="primary" text href="https://www.google.com">
      link↗
    </Button>
    <Button color="orange" text>
      link
    </Button>
    <Button color="primary" text>
      primary
    </Button>
  </div>
);

export default ButtonDemoColor;
