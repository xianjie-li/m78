> Simple devtool for M78 projects

## usage

### Create a new package

Create a project with the directory name `my-package`

```shell
npx m78 init ./packages/my-package
```

> Note: If the directory already exists, the `Inject config to exist project` described below will be executed.

### Inject config to exist project

generate config via cli, ⚠️ this operation will be overwritten same name file and change package.json

```shell
npx m78 init [path] # The path is an exist path
```

will create or rewrite below files:

```shell
.eslintrc.cjs
.npmrc
.prettierrc.cjs
jest.config.js
m78.config.js
tsconfig.json
tsconfig.lib.json
```

and modify these fields in package.json

```shell
scripts
devDependencies
files
main
type
typings
publishConfig
```

### Build

1. Make sure `m78.config.js ` exist in project root. for config detail, see [defineConfig.d.ts](./defineConfig.d.ts)

```ts
import sass from "sass";
import { mkdir, writeFile } from "node:fs/promises";
import { defineConfig } from "@m78/devtools/defineConfig.js";

export default defineConfig({
  build: [
    {
      inpDir: "src",
      outDir: "esm",
      swcConfig: {
        module: {
          type: "es6",
        },
      },
    },
  ],
});

// import { defineCommonConfig } from "@m78/devtools/defineConfig.js"; // Other commonConfig if need, such as tscExtraArgs
// export const commonConfig = defineCommonConfig({ ... })
```

2.run `npx m78 build`

> pass --skip-declaration-emit to block the declaration file

### Test

built-in test by `jest` and `@testing-library/react`.

1. add `jest.config.js` to project root.

```ts
export { default } from "@m78/lib-build/jest.config.js";
```

2. write test code

3. run test

```shell
npx jest
```

> note: By now, jest need provide **--experimental-vm-modules** flag to enable ESM support.

### Run examples

start dev server, run your code.

suppose the root directory has the following code

```shell
examples
	| - func1
		|- index.html
		|- xxx.tsx		# use in index.html <script type="module" src="./index.tsx"></script>
  | - func2
		|- index.html
```

run the specified example

```shell
npx m78 example func1	# run func1
```

### Lint

provide eslint and prettier base config, usage by follow:

1. add config

.eslintrc.cjs

```js
module.exports = {
  extends: [require.resolve("@m78/lib-build/.eslintrc.cjs")],
  rules: {},
};
```

.prettierrc.cjs

```js
const config = require("@m78/lib-build/.prettierrc.cjs");

module.exports = {
  ...config,
};
```
