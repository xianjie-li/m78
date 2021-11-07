import React from 'react';
import { Expansion, ExpansionPane } from 'm78/expansion';
import data1 from '@/mock/data1';

const listSmall = data1.slice(0, 4);

const Nest = () => {
  return (
    <div>
      <Expansion accordion>
        {listSmall.map(item => (
          <ExpansionPane key={item.label} name={item.label} header={item.label}>
            <Expansion accordion>
              {listSmall.map(it => (
                <ExpansionPane key={it.label} name={it.label} header={it.label}>
                  {it.text}
                </ExpansionPane>
              ))}
            </Expansion>
          </ExpansionPane>
        ))}
      </Expansion>
    </div>
  );
};

export default Nest;
