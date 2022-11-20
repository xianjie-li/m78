
此模块仅用于内部组件, 业务层的国际化请使用自定义或默认`i18next`实例搭配`[backend](https://www.i18next.com/how-to/backend-fallback)来实现多语言配置懒加载

## 使用

```ts
import { 
  i18n,
  useTranslation, Translation, Trans,
} from 'm78/i18n';

i18n.t('hello');

const { t } = useTranslation();

t("hello");
```

> 注意, 导出内容均为独立的实例, 不能使用`react-i18next`的同名导出代替


## 约定

- `common` 为公共命名空间


## 切换语言

```ts
import { m78Config } from "m78/config";

import("m78/i18n/locales/zh-CN.json")
  .then(zhCN => {
    m78Config.set({
      i18n: {
        lng: "zh-CN",
        appendResource: {
          "zh-CN": zhCN,
        },
      },
    });
  });
```

