import { TableCell, TableRow } from "../../types/items.js";
import { _MixinSchema } from "./schema.js";
import { _MixinBase } from "./base.js";
import { TableKey } from "../../types/base-type.js";
import {
  createVerify,
  FormRejectMeta,
  FormRejectOrValues,
  FormSchemaWithoutName,
} from "@m78/form";
import { _MixinData } from "./data.js";
import { isTruthyOrZero } from "@m78/utils";
import { throwError } from "../../../common/index.js";
import { FORM_LANG_PACK_NS, i18n } from "../../../i18n/index.js";

export interface _MixinVerify extends _MixinBase, _MixinSchema, _MixinData {}

export class _MixinVerify {
  /** 获取单元格invalid状态 */
  validCheck(cell: TableCell) {
    const { invalid } = this.getSchemas(cell.row);

    if (!invalid) return true;

    return !invalid.get(cell.column.key);
  }

  /** 初始化verify实例 */
  initVerify() {
    this.verifyInstance = createVerify({
      schemas: this.config.schemas?.length
        ? {
            schemas: this.config.schemas,
          }
        : {},
      autoVerify: false,
      languagePack: i18n.getResourceBundle(i18n.language, FORM_LANG_PACK_NS),
    });
  }

  verify() {
    return this.verifyCommon(false);
  }

  verifyUpdated() {
    return this.verifyCommon(true);
  }

  verifyRow(rowKey: TableKey) {
    const row = this.table.getRow(rowKey);
    const data = this.getFmtData(row, row.data);
    const schemas = this.getSchemas(row);

    return this.innerCheck({
      row,
      values: data,
      schemas,
    });
  }

  // verify/verifyChanged 验证通用逻辑, 逐行验证数据, 发生错误时停止并返回
  async verifyCommon(onlyUpdated: boolean): Promise<FormRejectOrValues> {
    let curError: FormRejectMeta | null = null;

    const res = await this.innerGetData(async (i, key, status) => {
      if (onlyUpdated && !status.update) return false;

      const row = this.table.getRow(key);
      const schema = this.getSchemas(row);

      const [rejects] = await this.innerCheck({
        row,
        values: i,
        schemas: schema,
      });

      // 包含错误时, 中断循环
      if (rejects) {
        curError = rejects;
        return 0;
      }
    });

    if (curError) {
      return [curError, null];
    }

    return [null, res];
  }

  // 接收处理后的values和schemas进行验证, 并更新行或单元格的错误信息, 包含错误时, 会选中并高亮首个错误单元格
  innerCheck(arg: {
    row?: TableRow | TableKey;
    // 和row二选一, 传入时, 表示cell级别验证
    cell?: TableCell;
    values: any;
    schemas: FormSchemaWithoutName;
  }): Promise<FormRejectOrValues> {
    const { row: _row, cell, values, schemas } = arg;

    let row: TableRow | undefined;

    if (cell) {
      row = cell.row;
    } else if (isTruthyOrZero(_row)) {
      row = this.table.isRowLike(_row) ? _row : this.table.getRow(_row!);
    }

    if (!row) throwError("Unable to get row");

    const verify = this.getVerify();

    let cellError = this.cellErrors.get(row.key);

    if (!cellError) {
      cellError = new Map();
      this.cellErrors.set(row.key, cellError);
    }

    return verify.staticCheck(values, schemas).then((res) => {
      const [errors] = res;

      // 需要高亮的列
      let highlightColumn: TableKey | undefined;

      const existCheck: any = {};

      // errors顺序可能与实际显示不符, 需要存储后通过当前顺序查出需要高亮的首个列
      const errColumuKeys: any = {};

      if (errors) {
        for (const e of errors) {
          // 对单元格验证和行验证采用不同的行为, cell验证仅写入对应列的错误

          if (cell) {
            // 单元格验证时, 只读取与单元格有关的第一条错误进行显示
            if (cell.column.key === e.name) {
              highlightColumn = cell.column.key;

              cellError!.set(e.name, e);
              break;
            }
          } else {
            // 每列只取第一条错误
            if (!existCheck[e.name]) {
              cellError!.set(e.name, e);
              existCheck[e.name] = true;

              errColumuKeys[e.name] = true;
            }
          }
        }

        if (!cell) {
          highlightColumn = this.context.allColumnKeys.find(
            (k) => !!errColumuKeys[k]
          );
        }
      }

      // 没有任意列被标记为错误, 单元格验证时, 清理单元格错误,  行验证时, 清理行错误
      if (!highlightColumn) {
        if (cell) {
          cellError!.delete(cell.column.key);
        } else if (!errors) {
          cellError!.clear();
        }
      }

      if (isTruthyOrZero(highlightColumn)) {
        const highlightCell =
          cell || this.table.getCell(row!.key, highlightColumn!);
        this.table.highlight(highlightCell.key);
        this.table.selectCells(highlightCell.key);
      }

      return res;
    });
  }
}
