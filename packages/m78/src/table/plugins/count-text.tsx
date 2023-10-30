import { RCTablePlugin } from "../plugin.js";
import React from "react";
import { TABLE_NS, Trans, Translation } from "../../i18n/index.js";
import { _injector } from "../table.js";
import { _useStateAct } from "../injector/state.act.js";
import { Divider } from "../../layout/index.js";

export class _CountTextPlugin extends RCTablePlugin {
  toolbarLeadingCustomer(nodes: React.ReactNode[]) {
    nodes.push(<Divider vertical />, <CountText />);
  }
}

function CountText() {
  const stateDep = _injector.useDeps(_useStateAct);

  const { state } = stateDep;

  const selectedCount = state.selectedRows.length;
  const count = state.rowCount;

  return (
    <div className="color-second fs-12">
      <Translation ns={TABLE_NS}>
        {(t) => {
          return (
            <Trans
              i18nKey="count"
              t={t}
              count={count}
              selectedCount={selectedCount}
            >
              {{ count }} rows / {{ selectedCount }} selected
            </Trans>
          );
        }}
      </Translation>
    </div>
  );
}
