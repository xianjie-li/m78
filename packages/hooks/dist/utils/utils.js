import { isArray, isDom } from "@m78/utils";
/**
 * 依次从target、target.current、ref.current取值，只要有任意一个为dom元素则返回
 * 传入dom时原样返回，传入包含dom对象的ref时返回current，否则返回undefined
 * */ export function getRefDomOrDom(target, ref) {
    if (isDom(target)) return target;
    if (target && isDom(target.current)) return target.current;
    if (ref && isDom(ref.current)) return ref.current;
    return undefined;
}
/** 增强的getRefDomOrDom, 可以从一组target或单个target中获取dom */ export function getTargetDomList(target, ref) {
    if (target) {
        var targetList = isArray(target) ? target : [
            target
        ];
        var ls = targetList.map(function(item) {
            return getRefDomOrDom(item);
        }).filter(function(item) {
            return !!item;
        });
        if (ls.length) return ls;
    }
    var dom = getRefDomOrDom(ref);
    if (dom) return [
        dom
    ];
}
