// 实例操作
export function _actionImpl(ctx) {
    var trigger = ctx.trigger;
    Object.defineProperties(trigger, {
        running: {
            get: function get() {
                return trigger.dragging || trigger.activating || trigger.moving;
            }
        },
        enable: {
            get: getEnable,
            set: setEnable
        }
    });
    var _enable = true;
    function getEnable() {
        return _enable;
    }
    function setEnable(enable) {
        var prev = _enable;
        _enable = enable;
        // 关闭时, 清理所有未完成事件
        if (prev && !enable) {
            ctx.clear();
        }
    }
}
