import React from 'react';
import Fork from '@lxjx/fr/lib/fork';

const Demo = () => {
  return (
    <div>
      <Fork.Toggle when>
        <div>你看到我了1</div>
      </Fork.Toggle>
      <Fork.Toggle when={false}>
        <div>你看不到我2</div>
      </Fork.Toggle>
      <Fork.Toggle when={0}>
        <div>你看不到我3</div>
      </Fork.Toggle>
      <Fork.Toggle when={123}>
        <div>你看到我了4</div>
      </Fork.Toggle>
    </div>
  );
};

export default Demo;
