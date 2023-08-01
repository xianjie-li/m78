import { Middleware } from "./types.js";
import { AnyObject } from "@m78/utils";

let count = 1;

export const devtoolMiddleware: Middleware = (bonus) => {
  if (
    typeof window === "undefined" ||
    !(window as any).__REDUX_DEVTOOLS_EXTENSION__ ||
    process.env.NODE_ENV !== "development"
  ) {
    return bonus.init ? bonus.config : undefined;
  }

  if (bonus.init) {
    const extension = (window as any).__REDUX_DEVTOOLS_EXTENSION__;

    const dt = extension.connect({
      name: `${document.title || "seed"}-${count > 1 ? count : ""}`,
    });

    dt.init(bonus.config.state);

    bonus.ctx.devtool = dt;

    count++;

    return bonus.config;
  }

  if (bonus.ctx.devtool) {
    const ls = (changes: AnyObject) => {
      bonus.ctx.devtool.send(
        `change state (${Object.keys(changes) || "-"})`,
        bonus.apis.get()
      );
    };

    // 局部变量放在对象中, 防止取到快照
    const configStore = {
      unsubscribe: null as any,
    };
    configStore.unsubscribe = bonus.apis.subscribe(ls);

    bonus.ctx.devtool.subscribe((message: any) => {
      // 插件触发更新
      if (message.type === "DISPATCH" && message.state) {
        configStore.unsubscribe();
        bonus.apis.coverSet(JSON.parse(message.state));
        configStore.unsubscribe = bonus.apis.subscribe(ls);
      }
    });
  }
};
