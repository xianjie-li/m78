import React from 'react';
import Button from '@lxjx/flicker/lib/button';
import '@lxjx/flicker/lib/button/style';

const ButtonDemoColor = () => {
  return (
    <div>
      <Button link>link</Button>
      <Button color="red" link>link</Button>
      <Button color="green" link disabled>link</Button>
      <Button color="blue" link href="/">link</Button>
      <Button color="yellow" link>link</Button>
    </div>
  );
};

export default ButtonDemoColor;
