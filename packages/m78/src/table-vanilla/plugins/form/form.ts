import {
  applyMixins,
  setNamePathValue,
  simplyDeepClone,
  simplyEqual,
} from "@m78/utils";
import { TableLoadStage, TablePlugin } from "../../plugin.js";
import {
  TableMutationDataEvent,
  TableMutationDataType,
  TableMutationEvent,
  TableMutationType,
  TableMutationValueEvent,
} from "../mutation.js";
import { removeNode } from "../../../common/index.js";
import { _TableInteractivePlugin } from "../interactive.js";
import { _TableSoftRemovePlugin } from "../soft-remove.js";
import { TableForm } from "./types.js";
import { _MixinStatus } from "./status.js";
import { _MixinVerify } from "./verify.js";
import { _MixinSchema } from "./schema.js";
import { _MixinBase } from "./base.js";
import { _MixinData } from "./data.js";
import { _MixinRenders } from "./renders.js";

interface Plugin
  extends _MixinBase,
    _MixinStatus,
    _MixinSchema,
    _MixinData,
    _MixinVerify,
    _MixinRenders {}

/**
 * 实现表单form功能, 由于功能较多, 插件通过mixins切分到多个混合类中实现
 * */
class Plugin extends TablePlugin implements TableForm {
  beforeInit() {
    this.interactive = this.getPlugin(_TableInteractivePlugin);
    this.softRemove = this.getPlugin(_TableSoftRemovePlugin);

    this.methodMapper(this.table, [
      "verify",
      "verifyRow",
      "verifyUpdated",
      "getData",
      "getChanged",
      "getTableChanged",
      "getChangeStatus",
      "resetStatus",
    ]);

    this.methodMapper(this.context, ["getSchemas"]);
  }

  mounted() {
    this.table.event.mutation.on(this.mutation);

    // schemas配置变更时清理缓存的schema
    this.table.event.configChange.on((changeKeys, isChange) => {
      if (isChange("schemas")) {
        this.schemaConfigChange();
      }
    });

    this.initVerify();
    this.initNodeWrap();
  }

  beforeDestroy() {
    this.table.event.mutation.off(this.mutation);
    this.table.event.configChange.empty();

    this.reset();
  }

  loadStage(stage: TableLoadStage, isBefore: boolean) {
    if (stage === TableLoadStage.fullHandle && isBefore) {
      this.reset();
      this.initNodeWrap();
    }
  }

  beforeRender() {
    this.prepareChangedCell();
    this.prepareRowMark();
    this.prepareErrors();
    this.prepareSchemasMark();
  }

  rendering() {
    this.updateChangedCell();
    this.updateRowMark();
    this.updateErrors();
    this.updateSchemasMark();
  }

  // 数据发生变更时进行处理
  mutation = (e: TableMutationEvent) => {
    if (e.type === TableMutationType.value) {
      this.valueMutation(e);
    }

    if (e.type === TableMutationType.data) {
      this.dataMutation(e);
    }
  };

  // 值变更, 创建或获取form实例, 并同步值和校验状态
  valueMutation = (e: TableMutationValueEvent) => {
    const { cell } = e;

    const column = cell.column;
    const row = cell.row;

    // 默认值不存在, 将默认值写入
    if (!this.defaultValues.has(row.key)) {
      const rawData = simplyDeepClone(row.data);

      const name = column.config.originalKey;

      // 还原已变更的值
      setNamePathValue(rawData, name, e.oldValue);

      this.defaultValues.set(row.key, rawData);
    }

    const changed = !simplyEqual(row.data, this.defaultValues.get(row.key));

    if (changed) {
      this.rowChanged.set(row.key, true);
    } else {
      this.rowChanged.delete(row.key);
    }

    const valueChanged = !simplyEqual(e.value, e.oldValue);

    if (valueChanged) {
      this.cellChanged.set(cell.key, true);
    } else {
      this.cellChanged.delete(cell.key);
    }

    // 更新schema
    const schema = this.getSchemas(row, true);

    const fmtData = this.getFmtData(row, row.data);

    this.innerCheck({
      cell,
      values: fmtData,
      schemas: schema.rootSchema,
    }).then(() => this.table.render());
  };

  // data变更, 记录新增, 删除数据, 并且也将其计入getFormChanged变更状态
  dataMutation = (e: TableMutationDataEvent) => {
    if (e.changeType === TableMutationDataType.add) {
      e.add.forEach((d) => {
        const k = this.table.getKeyByRowData(d);
        if (!k) return;

        this.allRemoveRecordMap.delete(k);

        // 已经存在于删除列表中, 则不再计入新增列表
        if (this.removeRecordMap.delete(k)) return;

        this.addRecordMap.set(k, true);
      });
    }

    if (e.changeType === TableMutationDataType.remove) {
      e.remove.forEach((d) => {
        const k = this.table.getKeyByRowData(d);
        if (!k) return;

        this.allRemoveRecordMap.set(k, d);

        // 已经存在于新增列表中, 则不再计入删除列表
        if (this.addRecordMap.delete(k)) return;

        this.removeRecordMap.set(k, d);
      });
    }

    // 除了自动触发的move外, 均记录到sortRecordMap
    if (e.changeType === TableMutationDataType.move && !e.isAutoMove) {
      e.move.forEach((meta) => {
        const k = this.table.getKeyByRowData(meta.data);

        if (!k) return;

        let rec = this.sortRecordMap.get(k);

        if (!rec) {
          rec = {
            originIndex: meta.from, // 原索引, 应仅记录第一次时的值, 后续不再变更
            currentIndex: meta.to,
          };

          this.sortRecordMap.set(k, rec);
        }

        rec.currentIndex = meta.to;
      });
    }
  };

  // 重置状态/数据内联内容等
  reset() {
    this.addRecordMap = new Map();
    this.removeRecordMap = new Map();
    this.allRemoveRecordMap = new Map();
    this.sortRecordMap = new Map();
    this.defaultValues = new Map();
    this.schemaDatas = new Map();
    this.editStatusMap = new Map();
    this.cellChanged = new Map();
    this.rowChanged = new Map();
    this.cellErrors = new Map();

    this.invalidList = [];
    this.errorsList = [];
    this.changedCellList = [];
    this.rowMarkList = [];

    removeNode(this.wrapNode);

    this.errorsNodes = [];
    this.rowChangedNodes = [];
    this.cellChangedNodes = [];
    this.editStatusNodes = [];
    this.invalidNodes = [];
  }

  resetStatus() {
    // TODO: 清理软删除数据

    this.addRecordMap = new Map();
    this.removeRecordMap = new Map();
    this.allRemoveRecordMap = new Map();
    this.sortRecordMap = new Map();
    // this.defaultValues = new Map();
    this.schemaDatas = new Map();
    // this.editStatusMap = new Map();
    this.cellChanged = new Map();
    this.rowChanged = new Map();
    this.cellErrors = new Map();

    this.invalidList = [];
    this.errorsList = [];
    this.changedCellList = [];
    this.rowMarkList = [];

    this.table.render();
  }

  // 初始化wrapNode
  initNodeWrap() {
    this.wrapNode = document.createElement("div");
    this.wrapNode.className = "m78-table_form-wrap";
    this.context.viewContentEl.appendChild(this.wrapNode);
  }

  // schema配置发生变更
  schemaConfigChange() {
    this.schemaDatas = new Map();
    this.cellErrors = new Map();
    this.editStatusMap = new Map();
    this.invalidList = [];
    this.errorsList = [];

    this.initVerify();

    this.table.render();
  }
}

export const _TableFormPlugin = applyMixins(
  Plugin,
  _MixinBase,
  _MixinStatus,
  _MixinSchema,
  _MixinData,
  _MixinVerify,
  _MixinRenders
);
