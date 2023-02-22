import { RejectMeta } from "./types.js";

export class VerifyError extends Error {
  constructor(public rejects: RejectMeta, message = "verify error") {
    super(message);
  }
}
