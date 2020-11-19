import React from 'react';
import Expansion, { ExpansionPane } from 'm78/expansion';
import data1 from '@/mock/data1';

const listSmall = data1.slice(0, 4);

const AccordionDemo = () => {
  return (
    <div>
      <Expansion accordion>
        {listSmall.map(item => (
          <ExpansionPane key={item.label} name={item.label} header={item.label}>
            {item.text}
          </ExpansionPane>
        ))}
      </Expansion>
    </div>
  );
};

export default AccordionDemo;
