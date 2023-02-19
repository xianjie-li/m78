import { _Context } from "./types.js";
import { createEvent } from "@m78/utils";

export function _implEvent(ctx: _Context) {
  const { instance, config } = ctx;

  const creator = config.eventCreator || createEvent;

  instance.events = {} as any;

  instance.events.update = creator();

  instance.events.change = creator();

  instance.events.submit = creator();

  instance.events.fail = creator();

  instance.events.reset = creator();
}
