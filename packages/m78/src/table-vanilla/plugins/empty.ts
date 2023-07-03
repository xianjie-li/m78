import { TablePlugin } from "../plugin.js";
import { TableReloadLevel, TableReloadOptions } from "./life.js";
import { _TablePrivateProperty } from "../types/base-type.js";

import { removeNode } from "../../common/index.js";

/** 处理无数据 */
export class _TablePluginEmpty extends TablePlugin {
  static EMPTY_ROW_KEY = "__M78_EMPTY_ROW__";

  isEmpty = false;

  /** 空节点 */
  node: HTMLElement;

  /** reloadStage是在init阶段触发的, 需要确保在其之前创建了node */
  beforeInit() {
    this.node = document.createElement("div");

    this.node.className = "m78-table_empty";
    this.node.style.height = `${this.config.emptySize!}px`;

    const emptyNode = this.config.emptyNode;

    if (emptyNode) {
      this.node.appendChild(emptyNode);
    } else {
      this.node.innerHTML = "empty";
    }

    this.config.el.appendChild(this.node);
  }

  beforeDestroy() {
    removeNode(this.node);
  }

  reload(opt?: TableReloadOptions) {
    // 若完全重置, 请还原isEmpty, 这样loadStage中的逻辑才能完全重新处理
    if (opt?.level === TableReloadLevel.full) {
      this.isEmpty = false;
    }
  }

  /** 在index前拦截判断是否是empty, 是则注入占位数据并显示节点, 否则隐藏 */
  loadStage(level: TableReloadLevel, isBefore: boolean) {
    const ctx = this.context;

    if (level === TableReloadLevel.index && isBefore) {
      let len = ctx.data.length;

      // 已经是空状态, 说明已经注入了空数据, 长度需减1
      if (this.isEmpty) {
        len--;
      }

      if (ctx.yHeaderKeys.length >= len) {
        if (!this.isEmpty) {
          // 添加一条假数据用于empty占位, 另外也能保证getBoundItems正确运行
          ctx.data.push({
            [this.config.primaryKey]: _TablePluginEmpty.EMPTY_ROW_KEY,
            [_TablePrivateProperty.fake]: true,
          });

          ctx.rows[_TablePluginEmpty.EMPTY_ROW_KEY] = {
            height: this.config.emptySize!,
          };
        }

        this.isEmpty = true;
        this.update();
      } else {
        const needClear = this.isEmpty; // 若前一个状态是empty, 需要清理占位数据
        this.isEmpty = false;
        this.update(needClear);
      }
    }
  }

  /** 更新empty节点状态, 并根据需要移除data中的占位数据 */
  update(needClear = false) {
    if (this.isEmpty) {
      this.node.style.visibility = "visible";
    } else {
      if (needClear) {
        const data = this.context.data;

        let ind = -1;

        for (let i = data.length - 1; i >= 0; i--) {
          const cur = data[i];
          if (cur[this.config.primaryKey] === _TablePluginEmpty.EMPTY_ROW_KEY) {
            ind = i;
            break;
          }
        }

        if (ind !== -1) {
          this.context.data.splice(ind, 1);
        }
      }

      this.node.style.visibility = "hidden";
    }
  }
}

export interface TableEmptyConfig {
  /** 自定义空节点 */
  emptyNode?: HTMLElement;
  /** 100 | 空节点占用的总高度 */
  emptySize?: number;
}
