import React from 'react';
import Tree from 'm78/tree';
import dataSource1 from '@/docs/form/tree/ds1';

const AccordionDemo = () => {
  return (
    <div>
      <Tree dataSource={dataSource1} accordion />
    </div>
  );
};

export default AccordionDemo;
