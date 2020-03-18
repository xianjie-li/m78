import React from 'react';
import Button from '@lxjx/fr/lib/button';
import '@lxjx/fr/lib/button/style';


const ButtonDemoColor = () => {
  return (
    <div>
      <div className="mt-8">
        <Button color="blue" md size="large">md style</Button>
      </div>
      <div className="mt-8">
        <Button color="red" win size="large">win style</Button>
      </div>
      <div className="mt-8">
        <Button color="green" size="large">mix style</Button>
      </div>
    </div>
  );
};

export default ButtonDemoColor;
