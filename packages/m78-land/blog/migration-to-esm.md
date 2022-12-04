---
title: "迁移到esm的一些信息点"
authors: xianjie-li
---

本文罗列了一些从 commonjs 迁移到 esm 模块相关的信息, 以及两者互操作的一些细节.

- 文件后缀为 `.mjs` 或 `package.json` 添加了`"type": "module"` 时会启用 esm
- esm

  - 可以导入其他 esm 模块
  - 可以导入 commonjs 模块, `module.exports` 作为默认导出, 命令导出在静态分享有效的情况下可用(除了极端情况基本上都可以直接导入)

    ```typescript
    // cjs.cjs
    exports.name = "exported";

    // esm.js
    import { name } from "./cjs.cjs";
    console.log(name);
    // Prints: 'exported'

    import cjs from "./cjs.cjs";
    console.log(cjs);
    // Prints: { name: 'exported' }

    import * as m from "./cjs.cjs";
    console.log(m);
    // Prints: [Module] { default: { name: 'exported' }, name: 'exported' }
    ```

  - esm 必须明确写明 `.js` 后缀, 索引文件也必须全部写明 `index.js`

- cjs

  - 不能导入 esm, 但是可以使用 `import()` 代替, 缺点是 cjs 中不能使用顶层 `await` 使用起来还是有一定的麻烦

- 如何进行开发?

  - 新的包推荐使用 esm, 旧的包推荐升级到 esm(已经有很多库开始做了)
  - 痛点在于, cjs 是不能直接导入 esm 模块的, 可参考下面解决方式

    - 选择 1: 要求用户使用 `import()` 导入自己的模块, 由于 cjs 模块不能全局 await, 某些情况使用还是不方便的
      - 很多 esm 库都仅提供 esm 代码, 此外, 如果用户使用了 webpack 等打包器, 大部分情况下打包器是能处理这种兼容性问题的, 因为它们通常都有自己的一套模块处理规则
    - 选择 2: 额外打包一份 cjs 的包, 并在 `package.json` 为不同的模块用户配置不同的出口

      ```json
      {
        "exports": {
          "import": "./esm/index.js",
          "require": "./cjs/index.js"
        },
        "type": "module"
      }
      ```

- node

  - 某些情况可能会需要在 esm 下使用 require, 比如 require.resolve, 可以在 esm 模块中通过 [`module.createRequire()`](https://nodejs.org/api/module.html#modulecreaterequirefilename)构造

    - esm 包含一个试验性的 [`import.meta.resolve`](https://nodejs.org/api/esm.html#importmetaresolvespecifier-parent) 可以作为 require.resolve 的平替, 也可以使用 `new URL('./local', import.meta.url)`

  - `__filename` 和 `__dirname` 使用 [`import.meta.url`](https://nodejs.org/api/esm.html#importmetaurl) 代替
