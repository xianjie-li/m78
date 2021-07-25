import { TreeDataSourceItem } from 'm78/tree';

const dataSource1: TreeDataSourceItem[] = [
  {
    label: 'JS',
    // children: [
    //   {
    //     label:
    //       '基本对象基本对象基本对象基本对象基本对象基本对象基本对象基本对象基本对象基本对象基本对象',
    //     children: [
    //       {
    //         label: 'Global',
    //       },
    //       {
    //         label: 'Object',
    //       },
    //       {
    //         label: 'Function',
    //       },
    //       {
    //         label: 'Boolean',
    //       },
    //       {
    //         label: 'Symbol',
    //       },
    //       {
    //         label: 'Error',
    //       },
    //     ],
    //   },
    //   {
    //     label: 'Number&Date',
    //     children: [
    //       {
    //         label: 'Date',
    //       },
    //       {
    //         label: 'Number',
    //       },
    //       {
    //         label: 'Math',
    //       },
    //       {
    //         label: 'Bigint',
    //       },
    //     ],
    //   },
    //   {
    //     label: 'Text',
    //     children: [
    //       {
    //         label: 'RegExp',
    //       },
    //       {
    //         label: 'String',
    //       },
    //     ],
    //   },
    //   {
    //     label: 'Collection',
    //     children: [
    //       {
    //         label: 'Array',
    //       },
    //       {
    //         label: 'Map',
    //       },
    //       {
    //         label: 'Set',
    //       },
    //       {
    //         label: 'TypedArray/ArrayBuffer',
    //       },
    //       {
    //         label: 'JSON',
    //       },
    //       {
    //         label: 'DataView',
    //       },
    //     ],
    //   },
    //   {
    //     label: '控制抽象化',
    //     children: [
    //       {
    //         label: 'Proxy',
    //       },
    //       {
    //         label: 'Reflect',
    //       },
    //       {
    //         label: 'Generator',
    //       },
    //       {
    //         label: 'Async',
    //       },
    //     ],
    //   },
    // ],
  },
  {
    label: 'TypeScript',
    children: [
      {
        label: '类型',
        children: [
          {
            label: '基础',
          },
          {
            label: 'interface',
          },
          {
            label: '数组',
          },
          {
            label: '函数',
          },
          {
            label: '类型断言',
          },
          {
            label: '高级类型',
          },
          {
            label: '类型兼容性',
          },
        ],
      },
      {
        label: '进阶',
        children: [
          {
            label: '类型别名',
          },
          {
            label: '字符串字面量',
          },
          {
            label: '工具类型',
          },
          {
            label: '操作符',
          },
          {
            label: '元组',
          },
          {
            label: '枚举',
          },
          {
            label: '类',
          },
          {
            label: '泛型',
          },
          {
            label: '声明合并',
          },
          {
            label: '装饰器/Mixins',
          },
        ],
      },
      {
        label: '其他',
        children: [
          {
            label: '内置对象',
          },
          {
            label: 'ECMA标准',
          },
          {
            label: 'js类型检测',
          },
          {
            label: '模块解析规则',
          },
          {
            label: '三斜线',
          },
          {
            label: 'JsDoc',
          },
          {
            label: '配置/编译选项',
          },
          {
            label: '工程引用',
          },
        ],
      },
    ],
  },
  {
    label: 'Node',
    children: [
      {
        label: 'Core',
        children: [
          {
            label: 'Stream',
          },
          {
            label: 'Event',
          },
          {
            label: 'Buffer',
          },
        ],
      },
      {
        label: 'IO',
        children: [
          {
            label: 'fs',
          },
          {
            label: 'path',
          },
          {
            label: 'string_decoder',
          },
        ],
      },
      {
        label: 'Threads/Process',
        children: [
          {
            label: 'child_process',
          },
          {
            label: 'process',
          },
          {
            label: 'worker_threads',
          },
          {
            label: 'cluster',
          },
        ],
      },
      {
        label: 'Modules',
        children: [
          {
            label: 'module',
          },
          {
            label: 'npm/yarn',
          },
          {
            label: 'package.json',
          },
          {
            label: 'ESM',
          },
        ],
      },
      {
        label: 'other',
        children: [
          {
            label: 'os',
          },
          {
            label: 'event loop',
          },
          {
            label: 'crypto',
          },
          {
            label: 'assert',
          },
          {
            label: 'URL/query-string',
          },
        ],
      },
    ],
  },
];

export default dataSource1;
