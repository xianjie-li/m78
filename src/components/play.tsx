import React, { useState } from 'react';
import Tree from 'm78/tree';
import { SizeEnum } from 'm78/types';

const Play = () => {
  return (
    <div>
      <Tree
        size={SizeEnum.small}
        onOpensChange={v => {
          console.log(v);
        }}
      />
    </div>
  );
};

export default Play;
