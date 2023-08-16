import React from "react";
import { Button, ButtonColor } from "../../button/index.js";
import { Size } from "../../common/index.js";
import { IconManageSearch } from "@m78/icons/icon-manage-search.js";
import { Bubble } from "../../bubble/index.js";
import { IconSync } from "@m78/icons/icon-sync.js";
import { IconFilterAlt } from "@m78/icons/icon-filter-alt.js";
import { Divider, Row } from "../../layout/index.js";
import {
  _RCTableContext,
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

export function _Toolbar({ ctx }: { ctx: _RCTableContext }) {
  const { props, state } = ctx;

  const selectedCount = state.selectedRows.length;
  const count = _getTableCtx(state.instance)?.allRowKeys.length || 0;

  function renderLeading() {
    if (!state.instance) return null;

    const searchBtn = (
      <Button text>
        <IconManageSearch className="color-second fs-16" />
        <Translation ns={TABLE_NS}>{(t) => t("query")}</Translation>
      </Button>
    );

    const resetFilterBtn = (
      <Translation ns={TABLE_NS}>
        {(t) => (
          <Bubble content={t("reset filter")}>
            <Button squareIcon>
              <IconSync className="color-second" />
            </Button>
          </Bubble>
        )}
      </Translation>
    );

    const filterBtn = (
      <Translation ns={TABLE_NS}>
        {(t) => (
          <Bubble content={t("common filter")}>
            <Button squareIcon>
              <IconFilterAlt className="color-second" />
            </Button>
          </Bubble>
        )}
      </Translation>
    );

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

    const deleteBtn = (
      <Translation ns={TABLE_NS}>
        {(t) => (
          <Bubble content={t("delete selected rows")}>
            <Button
              className="color-second"
              squareIcon
              disabled={selectedCount === 0}
            >
              <IconDeleteForever />
            </Button>
          </Bubble>
        )}
      </Translation>
    );

    const addBtn = (
      <Translation ns={TABLE_NS}>
        {(t) => (
          <Bubble
            content={
              <div>
                {t("add row tip1")}
                <div className="fs-12 color-second">{t("add row tip2")}</div>
              </div>
            }
          >
            <Button size={Size.small}>
              <IconAddToPhotos />
              {t("add row btn")}
            </Button>
          </Bubble>
        )}
      </Translation>
    );

    const saveBtn = (
      <Translation ns={TABLE_NS}>
        {(t) => (
          <Bubble
            content={
              <div>
                {t("new tip")}: <span className="color-green bold mr-8">3</span>
                {t("delete tip")}:{" "}
                <span className="color-red bold mr-8">2</span>
                {t("update tip")}: <span className="color-blue bold">7</span>
              </div>
            }
          >
            <Button size={Size.small} color={ButtonColor.primary}>
              <IconSave />
              {t("save btn")}
            </Button>
          </Bubble>
        )}
      </Translation>
    );

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
