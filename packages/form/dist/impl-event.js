import { createEvent } from "@m78/utils";
export function _implEvent(ctx) {
    var instance = ctx.instance, config = ctx.config;
    var creator = config.eventCreator || createEvent;
    instance.events = {};
    instance.events.update = creator();
    instance.events.change = creator();
    instance.events.submit = creator();
    instance.events.fail = creator();
    instance.events.reset = creator();
}
