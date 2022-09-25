import { Config as SwcConfig } from "@swc/core";

interface BeforeCopyMeta {
  /** 输出目录 */
  outDir: string;
  /** 输出路径 */
  outPath: string;
  /** 原文件路径 */
  filePath: string;
  /** 原文件后缀 */
  suffix: string;
}

/** 构建配置 */
export interface BuildConfig {
  /** 需要编译的目录 */
  inpDir: string;
  /**
   * 输出目录
   * - 若包含多份打包配置且outDir为包含关系, 后面的打包配置outDir必须为前面配置的子目录例如:
   * 配置1 outDir: 'dist' , 配置2 outDir: 'dist/umd', 否则会导致打包路径被提前清理.
   * */
  outDir: string;
  /** swc配置 */
  swcConfig: SwcConfig;
  /**
   * 要过滤的文件(通过glob匹配), 例: 排除play和demo目录 '**\/*(play|demo)/**\/*', 指定后缀的文件 '**\/*.test.tsx'
   * - 默认会排除: ["**\/*.d.ts", "**\/*.test.*(js|ts|jsx|tsx)"], 传入新配置时不会覆盖默认配置
   * - 注意: 声明文件的输出不受此项影响, 需要在tsconfig中单独配置exclude
   * */
  ignore?: string[];
  /** 支持编译的文件后缀, 默认为 ["js", "ts", "jsx", "tsx"] */
  extensions?: string[];
  /** true| 是否直接复制不支持编译的文件 */
  copyfile?: boolean;
  /**
   * 执行复制操作之前, 会先经过此钩子, 可以在此对这些文件进行转换跳过复制
   * - 返回true, 表示自行进行该文件的处理和复制操作, 内部不会再进行任何操作, 也可以返回true来跳过复制
   * - 无返回, 执行默认复制流程
   * */
  beforeCopy: (meta: BeforeCopyMeta) => Promise<boolean | void>;
}

/** 一个或多个构建配置 */
export type Config = BuildConfig | BuildConfig[];

/** 类型助手 */
export function defineConfig(conf: Config): Config;
