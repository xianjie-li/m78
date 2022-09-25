import { defineConfig } from "dumi";
import * as path from "path";

export default defineConfig({
  title: "M78",
  mode: "site",
  logo: "/logo-small.png",
  favicon: "/logo-small.png",
  // more config: https://d.umijs.org/config
  navs: [
    null, // null 值代表保留约定式生成的导航，只做增量配置
    {
      title: "GitHub",
      path: "https://github.com/xianjie-li/m78",
    },
  ],
  resolve: {
    includes: ["./src", "react/README.md"],
  },
  sass: {},
  sitemap: {
    hostname: "/",
  },
  chainWebpack(conf) {
    conf.module
      .rule("mjs$")
      .test(/\.mjs$/)
      .include.add(/node_modules/)
      .end()
      .type("javascript/auto");
  },
});
