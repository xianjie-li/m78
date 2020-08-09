import React from 'react';
import Button from 'm78/button';
import 'm78/button/style';

const ButtonDemoColor = () => (
  <div>
    <div className="mt-8">
      <Button color="blue" md size="large">
        md style
      </Button>
    </div>
    <div className="mt-8">
      <Button color="red" win size="large">
        win style
      </Button>
    </div>
    <div className="mt-8">
      <Button color="green" size="large">
        mix style
      </Button>
    </div>
  </div>
);

export default ButtonDemoColor;
