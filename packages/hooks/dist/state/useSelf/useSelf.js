import { useRef } from "react";
/**
 * 返回一个实例对象
 * @param init - 初始值
 * @return self - 实例对象
 * */ export function useSelf() {
    var init = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    var self = useRef(init);
    return self.current;
}
