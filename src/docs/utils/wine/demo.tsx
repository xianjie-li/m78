import React from 'react';
import { Button } from 'm78/button';

import Wine from '@m78/wine';
import '@m78/wine/style.css';

const Demo = () => {
  function renderWindow() {
    const w1 = Wine.render({
      sizeRatio: 0.6,
      alignment: [0.4, 0.4],
      content: (
        <div style={{ padding: 20, fontSize: 24 }}>
          <h2>My Window!</h2>
          <div>🤞🤞🤞🤞 {Math.random()}</div>
        </div>
      ),
    });

    const w2 = Wine.render({
      sizeRatio: 0.6,
      alignment: [0.7, 0.3],
      content: (
        <div style={{ padding: 20, fontSize: 24 }}>
          <h2>My Window!</h2>
          <div>🤞🤞🤞🤞 {Math.random()}</div>
        </div>
      ),
    });

    const w3 = Wine.render({
      sizeRatio: 0.6,
      alignment: [0.5, 0.8],
      content: (
        <div style={{ padding: 20, fontSize: 24 }}>
          <h2>My Window!</h2>
          <div>🤞🤞🤞🤞 {Math.random()}</div>
        </div>
      ),
    });

    console.log(w1, w2, w3);
  }

  return (
    <div>
      <Button onClick={renderWindow}>render</Button>
    </div>
  );
};

export default Demo;
