import { useEffect } from "react";
/**
 * 组件卸载时执行销毁操作
 */ export function useDestroy(cb) {
    useEffect(function() {
        return cb;
    }, []);
}
