import React from "react";
import { useFn } from "@m78/hooks";
import { TriggerEvent, TriggerType } from "../../trigger/index.js";
import { _injector } from "../table.js";
import { _useStateAct } from "../injector/state.act.js";
import { _TableContextMenuOpenOpt } from "./use-context-menu.act.js";
import { MenuProps } from "../../menu/index.js";
import { IconClipboard } from "@m78/icons/clipboard.js";
import { IconCopy } from "@m78/icons/copy.js";
import { IconToTop } from "@m78/icons/to-top.js";
import { IconToBottom } from "@m78/icons/to-bottom.js";
import { IconDeleteOne } from "@m78/icons/delete-one.js";
import { COMMON_NS, TABLE_NS, useTranslation } from "../../i18n/index.js";
import { isTruthyOrZero } from "@m78/utils";
import { _useMethodsAct } from "../injector/methods.act.js";
import { Dialog } from "../../dialog/index.js";
import { TableRow } from "../../table-vanilla/index.js";

enum MenuValues {
  copy,
  paste,
  insertTop,
  insertBottom,
  delete,
}

export function _useCellMenu() {
  const { state } = _injector.useDeps(_useStateAct);
  const methods = _injector.useDeps(_useMethodsAct);

  const instance = state.instance;

  const confirm: NonNullable<MenuProps["onConfirm"]> = useFn((val, option) => {
    if (option.context) option.context();
  });

  const { t } = useTranslation(TABLE_NS);

  // 根据事件对象获取右键菜单信息
  return useFn((e: TriggerEvent): _TableContextMenuOpenOpt | void => {
    if (e.type !== TriggerType.contextMenu) return;

    const point = instance.transformViewportPoint([e.offsetX, e.offsetY]);

    const item = instance.getBoundItems(point.xy).cells[0];

    if (!item) return;

    if (item.row.isHeader) return;

    // 当前单元格是否选中, 会影响部分上下文行为
    const isSelected = item.column.isHeader
      ? instance.isSelectedRow(item.row.key)
      : instance.isSelectedCell(item.key);

    // 当前单元格选中时, 检测选中单元格并改为对选中单元格进行操作
    const selected = isSelected ? instance.getSelectedCells() : [];
    let selectedRows: TableRow[] = [item.row];

    if (isSelected) {
      // 根据操作的列是否是行头来确定选中行

      if (item.column.isHeader) {
        selectedRows = instance.getSelectedRows();
      } else if (isSelected) {
        selectedRows = instance
          .getSortedSelectedCells()
          .map((i) => i[0]?.row)
          .filter(isTruthyOrZero);
      }
    }

    const hasMultipleSelected = selected.length > 1;
    const hasMultipleSelectedRow = selectedRows.length > 1;

    // 仅限单元格显示的菜单
    const cellOnlyMenu = item.column.isHeader
      ? []
      : [
          {
            label: hasMultipleSelected ? t("copy cells") : t("copy cell"),
            leading: <IconCopy />,
            value: MenuValues.copy,
            context() {
              if (!hasMultipleSelected) {
                // 选中当前单元格
                instance.selectCells(item.key);
              }

              instance.copy();
            },
          },
          {
            label: hasMultipleSelected ? t("paste cells") : t("paste cell"),
            leading: <IconClipboard />,
            value: MenuValues.paste,
            context() {
              if (!hasMultipleSelected) {
                // 选中当前单元格
                instance.selectCells(item.key);
              }

              instance.paste();
            },
          },
        ];

    // 插入数据相关菜单
    const insertMenus = item.row.isFixed
      ? []
      : [
          {
            label: t("insert top"),
            leading: <IconToTop />,
            value: MenuValues.insertTop,
            context() {
              instance.addRow(methods.getDefaultNewData(), item.row.key, false);
            },
          },
          {
            label: t("insert bottom"),
            leading: <IconToBottom />,
            value: MenuValues.insertBottom,
            context() {
              instance.addRow(methods.getDefaultNewData(), item.row.key, true);
            },
          },
        ];

    return {
      xy: [e.x, e.y],
      cb: confirm,
      menu: [
        ...cellOnlyMenu,
        ...insertMenus,
        // 删除行
        {
          label: (
            <span>
              {hasMultipleSelectedRow ? t("delete rows") : t("delete row")}
              {selectedRows.length > 1 ? (
                <span> ({selectedRows.length})</span>
              ) : null}
            </span>
          ),
          value: MenuValues.delete,
          leading: <IconDeleteOne className="color-error" />,
          className: "color-error",
          async context() {
            try {
              const conf = {
                ns: [COMMON_NS],
              };

              methods.overlayStackChange(true);

              await Dialog.quicker(
                t("confirm delete", conf),
                t("alert", conf)!,
                true
              );

              instance.removeRow(selectedRows.map((i) => i.key));
            } catch (e) {
              //
            } finally {
              methods.overlayStackChange(false);
            }
          },
        },
      ],
    };
  });
}
