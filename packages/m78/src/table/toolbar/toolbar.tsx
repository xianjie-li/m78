import React from "react";
import { Button, ButtonColor } from "../../button/index.js";
import { Size } from "../../common/index.js";
import { Bubble } from "../../bubble/index.js";
import { Divider, Row } from "../../layout/index.js";
import {
  RCTableToolbarLeadingBuiltinNodes,
  RCTableToolbarTrailingBuiltinNodes,
} from "../types.js";
import { IconFileDownload } from "@m78/icons/icon-file-download.js";
import { IconFileUpload } from "@m78/icons/icon-file-upload.js";
import { IconDeleteForever } from "@m78/icons/icon-delete-forever.js";
import { IconAddToPhotos } from "@m78/icons/icon-add-to-photos.js";
import { IconSave } from "@m78/icons/icon-save.js";
import { _getTableCtx } from "../common.js";
import { _getHistoryButtons } from "./get-history-buttons.js";
import { TABLE_NS, Trans, Translation } from "../../i18n/index.js";
import {
  _renderToolBarQueryBtn,
  _ToolBarFilterBtn,
  _ToolbarCommonFilter,
} from "../filter/filter-btn.js";
import { _injector } from "../table.js";
import { _useStateAct } from "../state.act.js";
import { _AddBtn, _DeleteBtn, _SaveBtn } from "./data-actions.js";

export function _Toolbar() {
  const props = _injector.useProps();

  const stateDep = _injector.useDeps(_useStateAct);

  const { state } = stateDep;

  const selectedCount = state.selectedRows.length;
  const count = state.rowCount;

  function renderLeading() {
    if (!state.instance) return null;

    const searchBtn = _renderToolBarQueryBtn(stateDep);

    const resetFilterBtn = <_ToolBarFilterBtn />;

    const filterBtn = <_ToolbarCommonFilter />;

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

    const nodes = (
      <>
        {searchBtn}
        <Divider vertical />
        {resetFilterBtn}
        {filterBtn}
        <Divider vertical />
        {redoBtn}
        {undoBtn}
        <Divider vertical />
        {countText}
      </>
    );

    const nodesData: RCTableToolbarLeadingBuiltinNodes = {
      nodes,
      searchBtn,
      resetFilterBtn,
      filterBtn,
      redoBtn,
      undoBtn,
      countText,
    };

    if (props.toolBarLeadingCustomer) {
      return props.toolBarLeadingCustomer(nodesData, state.instance);
    }

    return nodes;
  }

  function renderTrailing() {
    if (!state.instance) return null;

    const exportBtn = (
      <Translation ns={TABLE_NS}>
        {(t) => (
          <Bubble
            content={
              <div>
                <div>{t("export xlsx")}</div>
                <div className="fs-12 color-second">
                  {t("u can also")} <a>{t("export specific")}</a>
                </div>
              </div>
            }
          >
            <Button className="color-second" squareIcon>
              <IconFileDownload />
            </Button>
          </Bubble>
        )}
      </Translation>
    );

    const importBtn = (
      <Translation ns={TABLE_NS}>
        {(t) => (
          <Bubble
            content={
              <div>
                {t("import")}
                <div className="fs-12 color-second">
                  <a>{t("download import tpl")}</a>
                </div>
              </div>
            }
          >
            <Button className="color-second" squareIcon>
              <IconFileUpload />
            </Button>
          </Bubble>
        )}
      </Translation>
    );

    const deleteBtn = <_DeleteBtn />;

    const addBtn = <_AddBtn />;

    const saveBtn = <_SaveBtn />;

    const nodes = (
      <>
        {exportBtn}
        {importBtn}
        {deleteBtn}
        <Divider vertical />
        {addBtn}
        {saveBtn}
      </>
    );

    const nodesData: RCTableToolbarTrailingBuiltinNodes = {
      nodes,
      exportBtn,
      importBtn,
      deleteBtn,
      addBtn,
      saveBtn,
    };

    if (props.toolBarTrailingCustomer) {
      return props.toolBarTrailingCustomer(nodesData, state.instance);
    }

    return nodes;
  }

  return (
    <Row className="m78-table_toolbar" mainAlign="between">
      <Row crossAlign="center">{renderLeading()}</Row>
      <Row crossAlign="center">{renderTrailing()}</Row>
    </Row>
  );
}
