import { TablePlugin } from "../../plugin.js";

export interface _MixinStatus extends TablePlugin {}

export class _MixinStatus {
  count = 123;

  test1() {
    console.log(this.table);
    console.log(this.count);

    return 123;
  }
}
