import React from 'react';
import { Divider } from 'm78/layout';

const AspectRatioDemo = () => {
  return (
    <div>
      <div>
        Lorem ipsum <Divider vertical /> dolor sit amet <Divider vertical /> consectetur
        <Divider vertical />
        adipisicing elit. Ad aliquid aperiam aspernatur debitis eaque earum, est et impedit sint
        tempore. Alias at aut corporis eligendi enim, excepturi explicabo labore. Similique.
      </div>

      <Divider color="red" vertical />
      <Divider color="orange" width={2} vertical />
      <Divider color="yellow" width={3} vertical />
      <Divider color="green" width={4} vertical />
      <Divider color="cyan" width={5} vertical />
      <Divider color="blue" width={6} vertical />
      <Divider color="purple" width={7} vertical />

      <Divider />
      <Divider height={2} />
      <Divider height={4} />

      <div>
        Lorem ipsum <Divider vertical /> dolor sit amet, consectetur <Divider vertical />{' '}
        adipisicing elit. Ad aliquid aperiam aspernatur debitis eaque earum, est et impedit sint
        tempore. Alias at aut corporis eligendi enim, excepturi explicabo labore. Similique.
      </div>

      <Divider />

      <div>
        Lorem ipsum <Divider vertical /> dolor sit amet, consectetur <Divider vertical />{' '}
        adipisicing elit. Ad aliquid aperiam aspernatur debitis eaque earum, est et impedit sint
        tempore. Alias at aut corporis eligendi enim, excepturi explicabo labore. Similique.
      </div>
    </div>
  );
};

export default AspectRatioDemo;
