import React from "react";
import { Button } from "m78";

const ButtonDemoColor = () => (
  <div>
    <Button disabled>default</Button>
    <Button color="red" disabled>
      red
    </Button>
    <Button color="green" disabled>
      green
    </Button>
    <Button color="orange" disabled>
      yellow
    </Button>
    <Button color="primary" disabled>
      primary
    </Button>
    <Button color="second" disabled>
      second
    </Button>
  </div>
);

export default ButtonDemoColor;
