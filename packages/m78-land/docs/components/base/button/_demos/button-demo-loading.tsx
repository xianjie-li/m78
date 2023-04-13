import React from "react";
import { Button } from "m78";

const ButtonDemoColor = () => (
  <div>
    <Button size="large" loading color="second">
      click
    </Button>
    <Button loading color="primary">
      click
    </Button>
    <Button loading size="small">
      click
    </Button>

    <div className="mt-8">
      <Button color="primary" circle size="large" loading>
        申
      </Button>
      <Button color="red" circle loading>
        亥
      </Button>
      <Button color="green" circle size="small" loading>
        卯
      </Button>
    </div>
  </div>
);

export default ButtonDemoColor;
