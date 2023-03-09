import { RejectMeta } from "./types.js";

export class VerifyError extends Error {
  static defaultMessage = "Verify failed";

  constructor(
    public rejects: RejectMeta = [],
    message = VerifyError.defaultMessage
  ) {
    super(message);
  }
}
