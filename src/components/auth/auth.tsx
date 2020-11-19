import React from 'react';
import createApi, { CreateAuthConfig, Validators } from '@lxjx/auth';
import { AnyObject } from '@lxjx/utils';

import createDeps from './createDeps';
import { createUseAuth } from './createUseAuth';
import { AuthProps, ExpandCreate } from './type';
import { createAuth } from './createAuth';
import { createUseDeps } from './createUseDeps';

/**
 * 基础
 *
 * 你最常使用的api是 `<Auth />` 组件和 `withAuth`, 分别用于为某块节点附加权限和创建权限组件
 * 其次是`useDeps()`, 用来
 *
 * 基础使用
 *   创建auth实例并通过通过Auth组件来对指定节点附加权限
 * 反馈方式
 *   内置三种无权限的反馈方式：占位节点、气泡框提示、隐藏
 * 权限组件
 *   直接为指定组件附加权限，生成的权限组件会直接附带权限验证，通常用于路由级权限验证
 * 获取Deps
 *   - 有三种方式获取deps(), `getDeps()`、`useDeps()`、`<Deps />`
 *   - `useDeps`和`Deps`的优势是会响应deps的变更而进行更新
 *   - 通过管理deps，😂你甚至能把auth作为一个全局状态库来使用
 * 异步验证器
 *   如果验证器返回promise，验证时会等到其完成，可以跟常规验证器一样resolve一个ValidMeta来标识验证失败
 *   异步验证器最好放在同步验证器之后，这样前面的验证器未通过就不会执行异步验证器了
 * 或
 *   类似编程语言中的 `||`，如果需要在两个权限中任意一个通过就通过验证，可以将权限key设置未数组`['key', ['key2', 'key3']]·
 *   与常规验证器不同，串联的 `或验证器` 不会在前面的验证器执行失败后阻止后面的同级验证器执行
 * 额外参数
 *   某些验证器会需要接受当前的某些运行时参数作为验证参照（比如验证是否为本人，会需要传入当前用户的信息给验证器），可以通过extra传递
 * 定制反馈节点
 * useAuth
 *   hooks式的验证，接受验证参数，返回验证结果，在某些场景下可能会用到
 *
 * 局部验证器
 *
 *
 * 底层api
 *    底层api用法请查看[@lxjx/auth](https://github.com/Iixianjie/auth/blob/master/readme.zh-cn.md#%E4%B8%AD%E9%97%B4%E4%BB%B6)
 *
 * 中间件
 *    中间件用于增强api，动态更改初始配置，内置了一个将deps缓存到本地的中间件，用法如下


 *    如果要自己编写中间件请查看，[@lxjx/auth](https://github.com/Iixianjie/auth/blob/master/readme.zh-cn.md#%E4%B8%AD%E9%97%B4%E4%BB%B6)
 *
 *
 *
 * */

/*

 ```ts
 import create from '@lxjx/auth';
 import cache from '@lxjx/auth/cacheMiddleware';

   create({
      middleware: [cache('my_auth_deps', 86400000)]
})
```

 */

const create: ExpandCreate = <
  D extends AnyObject = AnyObject,
  V extends Validators<D> = Validators<D>
>(
  config: CreateAuthConfig<D, V>,
) => {
  const auth = createApi<D, V>(config);

  const useAuth = createUseAuth<D, V>(auth);

  const Auth = createAuth<D, V>(auth, useAuth);

  const useDeps = createUseDeps<D, V>(auth);

  const Deps = createDeps<D, V>(auth, useDeps);

  const withAuth = (conf: Omit<AuthProps<D, V>, 'children'>) => {
    return (Component: React.ComponentType<any>) => {
      const displayName = Component.displayName || Component.name || 'Component';

      const EnhanceComponent: React.FC<any> = props => (
        <Auth {...conf}>
          <Component {...props} />
        </Auth>
      );

      EnhanceComponent.displayName = `withAuth(${displayName})`;

      return EnhanceComponent;
    };
  };

  return {
    ...auth,
    Auth,
    withAuth,
    useAuth,
    useDeps,
    Deps,
  };
};

export default create;
