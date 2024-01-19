import { RCTablePlugin } from "../plugin.js";
import React, { useEffect, useState } from "react";
import { _useStateAct } from "../injector/state.act.js";
import { useFn, useSelf } from "@m78/hooks";
import { _injector } from "../table.js";
import { _RCTableState } from "../types.js";
import { COMMON_NS, i18n, TABLE_NS } from "../../i18n/index.js";
import {
  TableInstance,
  TablePersistenceConfig,
} from "../../table-vanilla/index.js";
import { getStorage, setStorage } from "@m78/utils";
import { throwError } from "../../common/index.js";
import { TableMutationType } from "../../table-vanilla/plugins/mutation.js";
import { _useMethodsAct } from "../injector/methods.act.js";
import { Button } from "../../button/index.js";

/** 配置持久化器 */
export type TableConfigPersister = (
  key: string,
  table: TableInstance
) => Promise<void>;

/** 配置读取器 */
export type TableConfigReader = (
  key: string,
  table: TableInstance
) => Promise<TablePersistenceConfig>;

/**
 * 持久化配置上传/下载
 * */
export class _ConfigSyncPlugin extends RCTablePlugin {
  /** 当前使用的持久化器 */
  persister: TableConfigPersister;

  /** 当前使用的配置读取器 */
  reader: TableConfigReader;

  toolbarTrailingCustomer(nodes: React.ReactNode[]) {
    nodes.push(<ConfigSync plugin={this} />);
  }

  enable = false;

  // 根据配置控制初始加载状态
  rcStateInitializer(state: _RCTableState) {
    const props = this.getProps();

    if (props.configCacheKey) {
      state.initializingTip = i18n.t("setting reading", {
        ns: [TABLE_NS],
      });

      if (
        (props.configPersister || props.configReader) &&
        (!props.configPersister || !props.configReader)
      ) {
        throwError(
          "props.configPersister and props.configReader must be provided at the same time"
        );
      }

      this.persister = props.configPersister || storageCache;
      this.reader = props.configReader || storageReader;
      this.enable = true;
    } else {
      state.initializing = false;
      this.enable = false;
    }
  }

  rcRuntime() {
    const props = _injector.useProps();
    const { state, setState } = _injector.useDeps(_useStateAct);
    const methods = _injector.useDeps(_useMethodsAct);

    const loadConfig = useFn(async () => {
      if (!props.configCacheKey) return;

      try {
        const config = await this.reader(props.configCacheKey, state.instance);

        setState({
          initializing: false,
          blockError: null,
          persistenceConfig: config,
        });

        methods.updateCheckForm();
        methods.updateInstance({}, true);
      } catch (e: any) {
        console.error(e);

        const message = i18n.t("setting load failed", {
          ns: [TABLE_NS],
        });

        const retryText = i18n.t("retry", {
          ns: [COMMON_NS],
        });

        setState({
          initializing: false,
          blockError: (
            <span>
              {message},{" "}
              <Button
                text
                color="primary"
                className="bold"
                onClick={loadConfig}
              >
                {retryText}
              </Button>
            </span>
          ),
        });
      }
    });

    useEffect(() => {
      loadConfig();
    }, []);
  }
}

// toolbar上的配置同步提示以及同步上传逻辑
function ConfigSync({ plugin }: { plugin: _ConfigSyncPlugin }) {
  const { state } = _injector.useDeps(_useStateAct);
  const { configCacheKey } = _injector.useProps();

  const self = useSelf({
    // 延迟同步计时器
    triggerTimer: null as any,
    // 组件已卸载
    unmounted: false,
  });

  const [error, setError] = useState("");

  // 执行同步操作
  const sync = useFn(async () => {
    if (!plugin.enable || !configCacheKey) return;

    if (error) {
      setError("");
    }

    try {
      await plugin.persister(configCacheKey!, state.instance);
    } catch (e: any) {
      const errText = i18n.t("setting upload failed", {
        ns: [TABLE_NS],
      });
      // 静默失败
      !self.unmounted && setError(errText);
    }
  });

  // 事件绑定/清理
  useEffect(() => {
    window.addEventListener("beforeunload", sync);

    return () => {
      clearTimeout(self.triggerTimer);
      self.unmounted = true;
      sync();
      window.removeEventListener("beforeunload", sync);
    };
  }, []);

  // 配置变更一段时间后进行提交
  state.instance.event.mutation.useEvent((e) => {
    if (e.type === TableMutationType.config) {
      clearTimeout(self.triggerTimer);
      self.triggerTimer = setTimeout(sync, 10000);
    }
  });

  if (error) {
    return (
      <span
        onClick={sync}
        className="fs-12 mr-12 color-second color-error cus-p"
        title="error"
      >
        {error}
      </span>
    );
  }

  return <span />;
}

// 默认的持久化存储实现
async function storageCache(key: string, table: TableInstance) {
  const curConf = table.getPersistenceConfig();

  setStorage(generateKey(key), curConf);
}

// 默认的配置读取实现
async function storageReader(key: string) {
  return getStorage(generateKey(key));
}

// 根据传入的key生产添加了唯一prefix的key
function generateKey(key: string) {
  return `m78-table-config:${key}`.toUpperCase();
}
