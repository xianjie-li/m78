import { usePropsChange } from "@m78/hooks";
import { _tableChangedIncludeChecker, _tableOmitConfig } from "../common.js";
import { useEffect } from "react";
import { omit } from "@m78/utils";
import { levelFullConfigKeys } from "../../table-vanilla/index.js";
/** 处理props变更, 尽可能减少不必要的更新, 特别是引用类型的props, 并在处理后将table props转换为vanilla table config */ export function _usePropsEffect(props, cb) {
    var omitProps = omit(props, _tableOmitConfig);
    var changedProps = usePropsChange(omitProps, {
        include: _tableChangedIncludeChecker,
        deepEqual: [
            "dataOperations"
        ]
    });
    useEffect(function() {
        if (!changedProps) return;
        var needFullReload = Object.keys(changedProps).some(function(key) {
            return levelFullConfigKeys.includes(key);
        });
        console.log(changedProps);
        cb(changedProps, needFullReload);
    }, [
        changedProps
    ]);
    return changedProps;
}
