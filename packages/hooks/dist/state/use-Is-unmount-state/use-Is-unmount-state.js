import { useEffect, useRef } from "react";
import { useFn } from "../../";
/**
 * 获取组件是否已卸载的状态, 用于防止组件在卸载后执行操作
 * */ export function useIsUnmountState() {
    var ref = useRef(false);
    useEffect(function() {
        return function() {
            ref.current = true;
        };
    }, []);
    return useFn(function() {
        return ref.current;
    });
}
