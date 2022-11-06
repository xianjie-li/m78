/**
 * 便捷的按键和点击事件绑定
 * @param handle - 时间处理函数
 * @param spaceTrigger - 按下空格时是否触发
 * */ export function keypressAndClick(handle) {
    var spaceTrigger = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
    return {
        onClick: handle,
        onKeyPress: function(e) {
            var code = e.code;
            if (code === "Enter" || spaceTrigger && code === "Space") {
                handle === null || handle === void 0 ? void 0 : handle();
            }
        }
    };
}
