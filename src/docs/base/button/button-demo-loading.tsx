import React from 'react';
import { Button } from 'm78/button';

const ButtonDemoColor = () => (
  <div>
    <Button size="large" loading>
      click
    </Button>
    <Button loading>click</Button>
    <Button size="small" loading>
      click
    </Button>

    <div className="mt-8">
      <Button color="blue" circle size="large" loading>
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
