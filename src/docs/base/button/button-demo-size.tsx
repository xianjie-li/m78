import React from 'react';
import Button from '@lxjx/fr/button';
import '@lxjx/fr/button/style';

const ButtonDemoColor = () => (
  <div>
    <Button size="large">large</Button>
    <Button>default</Button>
    <Button size="small">small</Button>
    <Button size="mini">mini</Button>

    <div className="mt-16">
      <Button color="blue" size="large">
        large
      </Button>
      <Button color="red">default</Button>
      <Button color="green" size="small">
        small
      </Button>
      <Button color="yellow" size="mini">
        mini
      </Button>
      <Button color="primary" size="mini" outline>
        badge
      </Button>
    </div>
  </div>
);

export default ButtonDemoColor;
