import React, { useState } from 'react';
import { Check } from 'm78/check';
import { defer } from '@lxjx/utils';

const Play = () => {
  const [check, setCheck] = useState(false);

  return (
    <div>
      <Check checked={check} label="选项1" />
      <Check checked={check} label="选项2" />
      <Check checked={check} label="选项3" />

      <Check
        label="选项4"
        onChange={prev => {
          console.log(prev);
          defer(() => {
            setCheck(prev);
          });
        }}
      />

      <button type="button" onClick={() => setCheck(prev => !prev)}>
        全选
      </button>
    </div>
  );
};

export default Play;
