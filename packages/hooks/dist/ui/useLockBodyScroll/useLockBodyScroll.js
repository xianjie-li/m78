import { useEffect, useMemo, useRef } from "react";
import { createRandString, hasScroll } from "@m78/utils";
var scrollPosition = 0; // 保存锁定时的滚动位置
var list = [];
/**
 * 锁定滚动条并对滚动条宽度进行修正
 * @param locked - 根据传入值对滚动条进行锁定/解锁
 * */ export var useLockBodyScroll = function(locked) {
    var lock = function lock() {
        var bodyEl = instance.current.bodyEl;
        // 不同浏览器会使用不同的根滚动，这里需要进行一下兼容
        var bodyScrollInfo = hasScroll(bodyEl);
        var docScrollInfo = hasScroll(document.documentElement);
        var hasX = bodyScrollInfo.x || docScrollInfo.x;
        var hasY = bodyScrollInfo.y || docScrollInfo.y;
        bodyEl.setAttribute("data-locked", "1");
        scrollPosition = window.pageYOffset;
        bodyEl.style.width = "100%";
        bodyEl.style.overflowY = hasY ? "scroll" : "hidden";
        bodyEl.style.overflowX = hasX ? "scroll" : "hidden";
        bodyEl.style.position = "fixed";
        bodyEl.style.top = "-".concat(scrollPosition, "px");
    };
    var unlock = function unlock() {
        var bodyEl = instance.current.bodyEl;
        bodyEl.setAttribute("data-locked", "0");
        bodyEl.style.width = "";
        bodyEl.style.overflowY = "";
        bodyEl.style.overflowX = "";
        bodyEl.style.position = "";
        bodyEl.style.top = "";
        window.scrollTo(0, scrollPosition);
    };
    var id = useMemo(function() {
        return createRandString();
    }, []);
    var instance = useRef({
        bodyEl: null
    });
    useEffect(function() {
        instance.current.bodyEl = document.body;
    }, []);
    // 存取list
    useEffect(function() {
        if (locked) {
            list.push(id);
            if (list.length === 1) lock();
        }
        return function() {
            if (!locked) return;
            var ind = list.indexOf(id);
            if (ind !== -1) list.splice(ind, 1);
            if (!list.length) unlock();
        };
    }, [
        locked
    ]);
};
