import React from 'react';
import Fork from '@lxjx/flicker/lib/fork';

const Demo = () => {
  return (
    <div>
      {/* eslint-disable-next-line */}
      <Fork.If when={true}>
        <div>你看到我了 1</div>
      </Fork.If>
      <Fork.If when={false}>
        <div>你看不到我 2</div>
      </Fork.If>
      <Fork.If when={0}>
        <div>你看不到我 3</div>
      </Fork.If>
      <Fork.If when={123}>
        <div>你看到我了 4</div>
      </Fork.If>
      <Fork.If when>{() => (
        <div>延迟渲染 5</div>
      )}
      </Fork.If>
    </div>
  );
};

export default Demo;
