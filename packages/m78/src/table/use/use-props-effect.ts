import { RCTableProps } from "../types.js";
import { usePropsChange } from "@m78/hooks";
import { _tableChangedIncludeChecker, _tableOmitConfig } from "../common.js";
import { useEffect } from "react";
import { omit } from "@m78/utils";
import { levelFullConfigKeys } from "../../table-vanilla/index.js";

/** 处理props变更, 尽可能减少不必要的更新, 特别是引用类型的props */
export function _usePropsEffect(
  props: RCTableProps,
  cb: (props: Partial<RCTableProps>, needFullReload: boolean) => void
) {
  const omitProps = omit(props, _tableOmitConfig as any);

  const changedProps = usePropsChange(omitProps, {
    include: _tableChangedIncludeChecker,
  });

  useEffect(() => {
    if (!changedProps) return;

    const needFullReload = Object.keys(changedProps).some((key) =>
      levelFullConfigKeys.includes(key as any)
    );

    console.log(changedProps);

    cb(changedProps, needFullReload);
  }, [changedProps]);

  return changedProps;
}
