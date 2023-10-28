import React, { isValidElement } from "react";
import { Divider, Row } from "../../layout/index.js";

import { _getHistoryButtons } from "./get-history-buttons.js";
import { TABLE_NS, Trans, Translation } from "../../i18n/index.js";
import {
  _ToolBarFilterBtn,
  _ToolbarCommonFilterBtn,
  _ToolBarQueryBtn,
} from "../plugins/filter/filter-btn.js";
import { _injector } from "../table.js";
import { _useStateAct } from "../injector/state.act.js";
import { _AddBtn, _DeleteBtn, _SaveBtn } from "./data-actions.js";
import { _ExportFileBtn, _ImportFileBtn } from "./xls.js";

export function _Toolbar() {
  const props = _injector.useProps();

  const stateDep = _injector.useDeps(_useStateAct);

  const { state } = stateDep;

  const selectedCount = state.selectedRows.length;
  const count = state.rowCount;

  function renderLeading() {
    if (!state.instance) return null;

    const { redoBtn, undoBtn } = _getHistoryButtons(state.instance.history);

    const countText = (
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

    const nodes = [
      // eslint-disable-next-line react/jsx-key
      <Divider vertical />,
      redoBtn,
      undoBtn,
      // eslint-disable-next-line react/jsx-key
      <Divider vertical />,
      countText,
    ];

    stateDep.rcPlugins.forEach((p) => p.toolbarLeadingCustomer?.(nodes));

    let node: React.ReactNode | void;

    if (props.toolBarLeadingCustomer) {
      props.toolBarLeadingCustomer(nodes, state.instance);
    }

    return React.createElement(React.Fragment, null, ...nodes);
  }

  function renderTrailing() {
    if (!state.instance) return null;

    const exportBtn = props.dataExport && <_ExportFileBtn />;

    const importBtn = props.dataImport && <_ImportFileBtn />;

    const deleteBtn = <_DeleteBtn />;

    const addBtn = <_AddBtn />;

    const saveBtn = <_SaveBtn />;

    const nodes = [
      exportBtn,
      importBtn,
      deleteBtn,
      // eslint-disable-next-line react/jsx-key
      <Divider vertical />,
      addBtn,
      saveBtn,
    ];

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
