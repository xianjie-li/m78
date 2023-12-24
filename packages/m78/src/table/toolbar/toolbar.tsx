import React, { ReactNode } from "react";
import { Row } from "../../layout/index.js";

import { _injector } from "../table.js";
import { _useStateAct } from "../injector/state.act.js";

export function _Toolbar() {
  const props = _injector.useProps();

  const stateDep = _injector.useDeps(_useStateAct);

  const { state } = stateDep;

  function renderLeading() {
    if (!state.instance) return null;

    const nodes: ReactNode[] = [];

    stateDep.rcPlugins.forEach((p) => p.toolbarLeadingCustomer?.(nodes));

    if (props.toolBarLeadingCustomer) {
      props.toolBarLeadingCustomer(nodes, state.instance);
    }

    return React.createElement(React.Fragment, null, ...nodes);
  }

  function renderTrailing() {
    if (!state.instance) return null;

    const nodes: ReactNode[] = [];

    stateDep.rcPlugins.forEach((p) => p.toolbarTrailingCustomer?.(nodes));

    if (props.toolBarTrailingCustomer) {
      props.toolBarTrailingCustomer(nodes, state.instance);
    }

    return React.createElement(React.Fragment, null, ...nodes);
  }

  return (
    <Row className="m78-table_toolbar" mainAlign="between">
      <Row crossAlign="center">{renderLeading()}</Row>
      <Row crossAlign="center">{renderTrailing()}</Row>
    </Row>
  );
}
