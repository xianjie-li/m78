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
import { IconModeEdit } from "@m78/icons/icon-mode-edit.js";
import { _getTableCtx } from "../common.js";
import { _getHistoryButtons } from "./get-history-buttons.js";

export function _Toolbar({ ctx }: { ctx: _RCTableContext }) {
  const { props, state } = ctx;

  const selectedCount = state.selectedRows.length;
  const rowCount = _getTableCtx(state.instance)?.allRowKeys.length || 0;

  function renderLeading() {
    if (!state.instance) return null;

    const searchBtn = (
      <Button text>
        <IconManageSearch className="color-second fs-16" />
        查询
      </Button>
    );

    const resetFilterBtn = (
      <Bubble content="重置筛选条件">
        <Button squareIcon>
          <IconSync className="color-second" />
        </Button>
      </Bubble>
    );

    const filterBtn = (
      <Bubble content="通用筛选条件">
        <Button squareIcon>
          <IconFilterAlt className="color-second" />
        </Button>
      </Bubble>
    );

    const { redoBtn, undoBtn } = _getHistoryButtons(state.instance.history);

    const countText = (
      <div className="color-second fs-12">
        共{rowCount}行{rowCount ? ` / 选中${selectedCount}行` : ""}
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
      <Bubble
        content={
          <div>
            <div>导出为xlsx文件</div>
            <div className="fs-12 color-second">
              你也可以 <a>导出指定列</a>
            </div>
          </div>
        }
      >
        <Button className="color-second" squareIcon>
          <IconFileDownload />
        </Button>
      </Bubble>
    );

    const importBtn = (
      <Bubble
        content={
          <div>
            从xlsx文件导入数据
            <div className="fs-12 color-second">
              <a>下载导入模板</a>
            </div>
          </div>
        }
      >
        <Button className="color-second" squareIcon>
          <IconFileUpload />
        </Button>
      </Bubble>
    );

    const deleteBtn = (
      <Bubble content="删除选中项">
        <Button
          className="color-second"
          squareIcon
          disabled={selectedCount === 0}
        >
          <IconDeleteForever />
        </Button>
      </Bubble>
    );

    const editBtn = (
      <Bubble content={<div>在独立窗口中编辑选中行</div>}>
        <Button
          className="color-second"
          squareIcon
          disabled={selectedCount === 0}
        >
          <IconModeEdit />
        </Button>
      </Bubble>
    );

    const addBtn = (
      <Bubble
        content={
          <div>
            新增一条记录
            <div className="fs-12 color-second">选中行时, 在选中行上方插入</div>
          </div>
        }
      >
        <Button size={Size.small} disabled>
          <IconAddToPhotos />
          新建
        </Button>
      </Bubble>
    );

    const saveBtn = (
      <Button size={Size.small} color={ButtonColor.primary} disabled>
        <IconSave />
        保存
      </Button>
    );

    const nodes = (
      <>
        {exportBtn}
        {importBtn}
        {deleteBtn}
        {editBtn}
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
      editBtn,
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
