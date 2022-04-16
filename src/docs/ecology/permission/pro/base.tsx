import React from 'react';
import { createPermissionPro } from 'm78/permission';
import { createSeed } from 'm78/seed';
import { CheckBox, CheckOptionItem } from 'm78/check-box';
import { Divider, Tile } from 'm78/layout';
import { _PermissionProSeedState } from '@m78/permission';

/**
 * 权限配置, 是一个成员为 module: [key, key, ...] 格式的对象
 * 权限通常由多个模块组成, 每个模块拥有的权限表现为 module 和其对应的权限 key 数组
 * */
const permission = {
  user: [], // 如: ['create', 'update', 'delete']
  news: [],
  // 可以用这种形式表示嵌套的模块
  'mod2.staff': ['query', 'fire'],
};

const seed = createSeed<_PermissionProSeedState>();

/** 创建一个permissionPro实例 */
const PermissionPro = createPermissionPro({
  /** 对于pro来说, seed是可选的, 因为我们下面要频繁操作内部状态, 所以这里手动创建个seed */
  seed,
  /** 可以在这里设置初始权限, 但是更多时候会使用 PermissionPro.seed.set() 来设置 */
  permission,
  /**
   * meta是一个可选配置, 用来为权限附加更多的可用信息, 如权限名, 权限描述, 可用的操作等等, 方便使用者通过这些信息创建更友好的失败反馈.
   * 不配做此项的话会使用默认的回退内容反馈
   * */
  meta: {
    // general可以为所有名字匹配的权限key添加meta信息
    general: [
      {
        label: '创建',
        key: 'create',
        desc: '创建某些东西',
      },
      {
        label: '查询',
        key: 'query',
        desc: '查询某些东西',
        actions: [
          {
            label: '返回首页',
          },
          {
            label: '获取权限',
            color: 'green',
          },
        ],
      },
      {
        label: '删除',
        key: 'delete',
        desc: '删除某些东西',
        actions: [
          {
            label: '退出',
            color: 'red',
          },
        ],
      },
      {
        label: '更新',
        key: 'update',
        desc: '更新某些东西',
      },
    ],
    // modules为指定的模块添加meta信息, 优先级高于general
    modules: {
      user: {
        // 自定义模块的名称
        label: '用户',
        // 模块特有的权限meta
        list: [
          {
            label: '创建',
            key: 'create',
            desc: '创建!!!',
          },
        ],
      },
      news: { label: '新闻' },
      'mod2.staff': [
        {
          label: '开除',
          key: 'fire',
        },
      ],
    },
    // 可选, 用于在验证meta生成前对其改写
    each: meta => meta,
  },
});

// 使用如下方式在任意时刻更改权限和meta, 比如从后端api拿到权限配置后, 如果你是像上面那样手动传入seed的, 也可以直接通过传入的seed来更改
// PermissionPro.seed.set({
//   permission: {...},
//   meta: {...},
// });

const options: CheckOptionItem<string>[] = [
  {
    label: '查询',
    value: 'query',
  },
  {
    label: '创建',
    value: 'create',
  },
  {
    label: '更新',
    value: 'update',
  },
  {
    label: '删除',
    value: 'delete',
  },
];

const Base = () => {
  const per = seed.useState(state => state.permission);

  // 模拟权限变更
  const changePermission = (key: string, val: string[]) => {
    seed.set({
      permission: {
        ...per,
        [key]: val,
      },
    });
  };

  return (
    <div>
      <div>
        <h3>权限控制:</h3>
        <Tile
          leading="用户权限: "
          title={
            <CheckBox
              options={options}
              value={per.user}
              onChange={val => changePermission('user', val)}
            />
          }
          crossAlign="center"
        />
        <Tile
          leading="新闻权限: "
          title={
            <CheckBox
              options={options}
              value={per.news}
              onChange={val => changePermission('news', val)}
            />
          }
          crossAlign="center"
        />

        <Divider />
        <h3>当前权限:</h3>
        <div>用户: `{per.user.join(', ') || '无'}`</div>
        <div className="mt-4">新闻: `{per.news.join(', ') || '无'}`</div>

        <Divider />
        <h3>需要的的权限:</h3>
        <div>用户: delete && update</div>
        <div className="mt-4">新闻: update && ( query || delete )</div>
      </div>

      <Divider />

      <h3>权限验证:</h3>

      <PermissionPro
        /**
         * 功能需要的权限, 权限模板格式如: `module:keys`,
         * - name为权限所属模块
         * - keys为具体的权限
         *
         * 模板中可以使用一些DSL语法, 比如:
         * - user:create&update
         * - user:create|update
         * - user:create&update|delete
         * - user:create&(update|update2)
         *
         * 可以使用常规permission的or写法, 如 [key, [key, key]] , 二维数组中的项任意一项通过则通过
         * */
        keys={['user:delete&update', 'news:update&(query|delete)']}
      >
        <div className="tc ptb-32">
          <div className="fs-lg">😀</div>
          <div className="fs-md color-success bold">权限验证通过</div>
          <div className="fs color-second mt-8">这里是需要权限验证的内容</div>
        </div>
      </PermissionPro>
    </div>
  );
};

export default Base;
