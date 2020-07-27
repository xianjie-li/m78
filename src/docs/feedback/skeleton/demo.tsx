import React from 'react';
import Skeleton from '@lxjx/fr/skeleton';
import Button from '@lxjx/fr/button';

const Demo = () => {
  const [show, setShow] = React.useState(true);

  return (
    <div>
      <Button className="mb-24" onClick={() => setShow(p => !p)}>
        toggle
      </Button>
      <Skeleton show={show}>
        <div>Skeleton 1</div>
      </Skeleton>
      <Skeleton show={show} img>
        <div>Skeleton 2</div>
      </Skeleton>
      <Skeleton show={show} img lineNumber={4} circle>
        <div>Skeleton 3</div>
      </Skeleton>
      <Skeleton show={show} img lineNumber={4}>
        <div>Skeleton 4</div>
      </Skeleton>
      <Skeleton show={show} lineNumber={5}>
        <div>Skeleton 5</div>
      </Skeleton>
      <Skeleton.BannerSkeleton show={show} />
    </div>
  );
};

export default Demo;
