import { TablePlugin } from "../plugin.js";

export class ScalePlugin extends TablePlugin {
  init() {
    // 映射实现方法
    this.methodMapper(this.table, []);
  }
}
