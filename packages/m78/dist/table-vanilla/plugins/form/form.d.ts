import { TableLoadStage, TablePlugin } from "../../plugin.js";
import { TableMutationDataEvent, TableMutationEvent, TableMutationRowValueEvent, TableMutationValueEvent } from "../mutation.js";
import { TableForm } from "./types.js";
import { _MixinStatus } from "./status.js";
import { _MixinVerify } from "./verify.js";
import { _MixinSchema } from "./schema.js";
import { _MixinBase } from "./base.js";
import { _MixinData } from "./data.js";
import { _MixinRenders } from "./renders.js";
interface Plugin extends _MixinBase, _MixinStatus, _MixinSchema, _MixinData, _MixinVerify, _MixinRenders {
}
/**
 * 实现表单form功能, 由于功能较多, 插件通过mixins切分到多个混合类中实现
 * */
declare class Plugin extends TablePlugin implements TableForm {
    beforeInit(): void;
    mounted(): void;
    beforeDestroy(): void;
    loadStage(stage: TableLoadStage, isBefore: boolean): void;
    beforeRender(): void;
    rendering(): void;
    mutation: (e: TableMutationEvent) => void;
    valueMutation: (e: TableMutationValueEvent) => void;
    rowValueMutation: (e: TableMutationRowValueEvent) => void;
    dataMutation: (e: TableMutationDataEvent) => void;
    reset(): void;
    resetStatus(): void;
    initNodeWrap(): void;
    schemaConfigChange(): void;
}
export declare const _TableFormPlugin: typeof Plugin;
export {};
//# sourceMappingURL=form.d.ts.map