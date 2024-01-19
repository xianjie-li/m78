import { dumpFn, NamePath, stringifyNamePath } from "@m78/utils";
import React, { useMemo } from "react";
import { useFn } from "@m78/hooks";

interface DetectorContext {
  /** 存储注册的field */
  map: Record<string, NamePath>;
  /** 注册 */
  register: (name: NamePath) => void;
  /** 取消注册 */
  unregister: (name: NamePath) => void;
}

const ctx = React.createContext<DetectorContext>({
  map: {},
  register: dumpFn,
  unregister: dumpFn,
});

export function _useDetector(name: NamePath) {
  const ctxValue = React.useContext(ctx);

  React.useEffect(() => {
    ctxValue.register(name);

    return () => {
      ctxValue.unregister(name);
    };
  }, [name]);
}

export function _FieldDetector({
  onChange,
  children,
}: {
  /** 发生变更时, 通过回调通知 */
  onChange: (names: NamePath[]) => void;
  children: React.ReactNode;
}) {
  const notify = useFn(() => {
    const ls: NamePath[] = [];

    Object.keys(value.map).forEach((key) => {
      const cur = value.map[key];
      if (cur) {
        ls.push(cur);
      }
    });

    onChange?.(ls);
  });

  const value = useMemo<DetectorContext>(
    () => ({
      map: {},
      register(name) {
        const sName = stringifyNamePath(name);
        this.map[sName] = name;
        notify();
      },
      unregister(name) {
        const sName = stringifyNamePath(name);
        delete this.map[sName];
        notify();
      },
    }),
    []
  );

  return <ctx.Provider value={value}>{children}</ctx.Provider>;
}
