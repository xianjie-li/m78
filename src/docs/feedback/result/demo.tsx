import React from 'react';

import Result from '@lxjx/flicker/lib/result';
import Button from '@lxjx/flicker/lib/button';

const Demo = () => {
  return (
    <div>
      <Result
        type="success"
        title="Adipisci animi architecto t?"
        desc="Lorem ipsum dolor sit amelit. Adipisci animi architecto t?"
        actions={(
          <>
            <Button>关闭</Button>
            <Button color="primary">确认</Button>
          </>
        )}
      />

      <Result
        type="error"
        title="Adipisci animi architecto t?"
        desc="Lorem ipsum dolor sit amelit. Adipisci animi architecto t?"
        actions={(
          <>
            <Button>关闭</Button>
            <Button color="red">确认</Button>
          </>
        )}
      >
        <div>Lorem Facere minus, modi? illo</div>
        <div>ipsum dolor sit amet, consectetur adipisicing elit.</div>
      </Result>

      <Result
        type="warning"
        title="Adipisci animi architecto t?"
        desc="Lorem ipsum dolor sit amelit. Adipisci animi architecto t?"
        actions={(
          <>
            <Button>关闭</Button>
            <Button color="yellow">确认</Button>
          </>
        )}
      >
        <div>Lorem Facere minus, modi? illo</div>
        <div>ipsum dolor sit amet, consectetur adipisicing elit.</div>
      </Result>

      <Result
        type="waiting"
        title="Adipisci animi architecto t?"
        desc="Lorem ipsum dolor sit amelit. Adipisci animi architecto t?"
        actions={(
          <>
            <Button>关闭</Button>
            <Button color="blue">返回首页</Button>
          </>
        )}
      >
        <div>Lorem Facere minus, modi? illo</div>
        <div>ipsum dolor sit amet, consectetur adipisicing elit.</div>
      </Result>

      <Result
        type="notFound"
        title="Adipisci animi architecto t?"
        desc="Lorem ipsum dolor sit amelit. Adipisci animi architecto t?"
        actions={(
          <>
            <Button>关闭</Button>
            <Button color="blue">返回首页</Button>
          </>
        )}
      >
        <div>Lorem Facere minus, modi? illo</div>
        <div>ipsum dolor sit amet, consectetur adipisicing elit.</div>
      </Result>

      <Result
        type="serverError"
        title="Adipisci animi architecto t?"
        desc="Lorem ipsum dolor sit amelit. Adipisci animi architecto t?"
        actions={(
          <>
            <Button>关闭</Button>
            <Button color="blue">返回首页</Button>
          </>
        )}
      >
        <div>Lorem Facere minus, modi? illo</div>
        <div>ipsum dolor sit amet, consectetur adipisicing elit.</div>
      </Result>

      <Result
        type="notAuth"
        title="Adipisci animi architecto t?"
        desc="Lorem ipsum dolor sit amelit. Adipisci animi architecto t?"
        actions={(
          <>
            <Button>关闭</Button>
            <Button color="blue">返回首页</Button>
          </>
        )}
      />
    </div>
  );
};

export default Demo;
