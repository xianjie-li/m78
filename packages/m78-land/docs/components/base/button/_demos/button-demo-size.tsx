import React from "react";
import { Button } from "m78";

const ButtonDemoColor = () => (
  <div>
    <Button size="large">large</Button>
    <Button>default</Button>
    <Button size="small">small</Button>

    <div className="mt-16">
      <Button color="primary" size="large">
        large
      </Button>
      <Button color="red">default</Button>
      <Button color="green" size="small">
        small
      </Button>
    </div>
  </div>
);

export default ButtonDemoColor;
