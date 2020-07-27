import React from 'react';
import Fork from '@lxjx/fr/fork';

const Demo = () => (
  <div>
    <div className="color-second">配合If</div>
    <Fork.Switch>
      <Fork.If when={false}>
        <div>你看不到我1</div>
      </Fork.If>
      <Fork.If when={false}>
        <div>你看不到我2</div>
      </Fork.If>
      <Fork.If>
        <div>你看到我了3</div>
      </Fork.If>
    </Fork.Switch>

    <div className="mt-32 color-second">配合toggle</div>
    <Fork.Switch>
      <Fork.Toggle when={false}>
        <div>你看不到我1</div>
      </Fork.Toggle>
      <Fork.Toggle when={false}>
        <div>你看不到我2</div>
      </Fork.Toggle>
      <Fork.Toggle when={123123}>
        <div>你看到我了3</div>
      </Fork.Toggle>
      <Fork.Toggle>
        <div>你看不到我4</div>
      </Fork.Toggle>
    </Fork.Switch>
  </div>
);

export default Demo;
