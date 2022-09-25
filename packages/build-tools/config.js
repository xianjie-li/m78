export const config = {
  sourceMaps: true,
  jsc: {
    baseUrl: process.cwd(),
    parser: {
      syntax: "typescript",
      tsx: true,
      decorators: true,
      dynamicImport: true,
      privateMethod: true,
      importMeta: true,
    },
    transform: {
      react: {
        // 使用新的react/jsx-runtime转换
        runtime: "automatic",
        // Use Object.assign() instead of _extends
        useBuiltins: true,
        // Enable react-refresh related transform
        refresh: true,
      },
    },
    target: "es5",
    externalHelpers: true,
  },
  env: {
    targets: "> 0.25%, not dead",
    coreJs: "3.22",
    dynamicImport: true,
  },
};
