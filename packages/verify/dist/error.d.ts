import { RejectMeta } from "./types.js";
export declare class VerifyError extends Error {
    rejects: RejectMeta;
    static defaultMessage: string;
    constructor(rejects?: RejectMeta, message?: string);
}
//# sourceMappingURL=error.d.ts.map