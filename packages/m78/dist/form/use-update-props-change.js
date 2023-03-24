export function _useUpdatePropsChange(ctx, update) {
    ctx.updatePropsEvent.useEvent(function() {
        update();
    });
}
