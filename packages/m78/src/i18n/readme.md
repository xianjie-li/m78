此模块仅用于内部组件, 业务层的国际化请使用自定义或默认`i18next`实例搭配`[backend](https://www.i18next.com/how-to/backend-fallback)来实现多语言配置懒加载

## 使用

```ts
import { i18n, useTranslation, Translation, Trans } from "m78/i18n";

i18n.t("hello");

const { t } = useTranslation();

t("hello");
```

> 注意, 导出内容均为独立的实例, 不能使用`react-i18next`的同名导出代替

## 约定

- `common` 为公共命名空间

## 切换语言

```ts
import { m78Config } from "m78/config";
import zhHans from "m78/i18n/locales/zh-Hans";

// 方式1: 添加语言包并设置语言
m78Config.set(["zh-CN", zhHans]);

// 方式2: 语言包已存在时, 可以直接设置语言
m78Config.set("zh-CN");

// 方式3: 异步加载语言包
import("m78/i18n/locales/zh-Hans.js").then((zhCN) => {
  m78Config.set(["zh-CN", zhHans]);
});
```
