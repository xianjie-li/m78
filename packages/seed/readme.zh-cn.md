<h1 align="center" style="color: #61dafb;">Seed</h1>
<h1 align="center" style="font-size: 80px;color:#61dafb">🌱</h1>

<br>

<p align="center">又一个简单的状态管理库</p>

<br>

<p align="center">
    <a href="./readme.md">en</a> | 
    <span>中文</span>
</p>
<br>

<!-- TOC -->

- [安装](#安装)
- [介绍](#介绍)
- [使用](#使用)
- [API速览](#api速览)
- [中间件](#中间件)
- [内置中间件](#内置中间件)
  - [devtool](#devtool)
  - [cache](#cache)

<!-- /TOC -->

<br>

<br>

## 安装

```shell
yarn add @m78/seed
```



<br>



## 介绍

`seed` 包含以下几个核心概念：

- `state` 表示当前状态的对象。
- `seed api` , 一个包含更新`state`、获取`state`、订阅`state`变更、执行验证行为等操作的对象。
- `middleware` , 中间件系统，用来更改初始化配置，增强api


<br>


## 使用

```ts
import create from '@m78/seed';
import cache from '@m78/seed/cacheMiddleware';

// 1. 通过create创建api

const {
    set, // 设置state
    get, // 获取state
    subscribe, // 订阅state变更
} = create({
    /* 可选行为，将state持久化到本地(仅限浏览器) */
    middleware: [cache('my_state', 86400000/* ms */)],
    /* 初始state, 被所有验证器依赖 */
    state: {
        verify: false,
        usr: {
            name: 'lxj',
            audit: true,
            vip: false,
        },
    },
});
```



<br>



## API速览

```ts
/* create() */

const seed = create({
    /** 中间件 */
    middleware?: (Middleware | null | undefined)[];
    /** 初始状态 */
    state?: object,
})

// 更新state的值，只更新传入对象中包含的键
auth.set({ name: 'lj', })

// 更新state的值，替换整个state对象
auth.coverSet({ name: 'lj', })

// 获取当前state
auth.get();

// 订阅state变更
const unsub = subscribe((changes) => {
   // ... 
});

// 取消订阅
unsub();
```

<br/>

<br/>


## 中间件

中间件用于为原有api添加各种补丁功能，也可用于在配置实际生效前对其进行修改。

中间件有两个执行周期：

- 初始化阶段，用于修改传入的默认配置
- 补丁阶段，用于为内置api添加各种增强性补丁



**签名：**

```ts
interface Middleware {
  (bonus: MiddlewareBonusPatch | MiddlewareBonusInit): CreateKitConfig<any, any> | void;
}

// 初始化阶段参数
export interface MiddlewareBonusInit {
  /** 是否为初始化阶段 */
  init: true;
  /** 当前创建配置(可能已被其他中间件修改过) */
  config: CreateKitConfig<any, any>;
  /** 在不同中间件中共享的对象 */
  ctx: AnyObject;
}

// 补丁阶段参数
export interface MiddlewareBonusPatch {
  init: false;
  /** 当前的auth api */
  apis: Auth<any, any>;
  /** 为api添加增强补丁 */
  monkey: MonkeyHelper;
  /** 在不同中间件中共享的对象 */
  ctx: AnyObject;
}
```

<br/>

**一个log中间件的例子**	

```ts
import { Middleware } from '@m78/seed';

const cacheMiddleware: Middleware = bonus => {
    
  /* ##### 初始化阶段 ##### */
  if (bonus.init) {
    const conf = bonus.config;
    console.log('init');
      
    // 初始化时必须返回配置，即使没有对其进行修改， 返回值会作为新的初始deps使用
    return { ...conf, state: { ...conf.state, additionalDep: 'hello😄'  } }; 
  }
  

  /* ##### 补丁阶段 ##### */
    
  console.log('api created');
    
  // 在执行set时打印设置的新state
  bonus.monkey('set', next => patch => {
    console.log('set', patch);
    next(patch);
  });

  // 获取state时输出获取行为
  bonus.monkey('get', next => () => {
    console.log('get');
    return next();
  });

}
```

<br/>

<br/>

## 内置中间件

### devtool

开启 [redux-devtool](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd) 支持, 此中间件应放在所有中间件之后

```js
import create from '@m78/seed';
import devtool from '@m78/seed/devtoolMiddleware';

onst seed = create({
  middleware: [devtool],
  // ...
})
```



### cache

缓存 `state` 到 `storage api`

```js
import create from '@m78/seed';
import cache from '@m78/seed/cacheMiddleware';

const sessionCacheKeys = ['list1', 'list2', 'list3'];
const localCacheKeys = ['user', 'token'];

const seed = create({
  middleware: [
    cache('cache_key1', {
      // session级缓存(默认)
      type: 'session',
      // 只缓存符合条件的key
      testKey: key => sessionCacheKeys.includes(key),
    }),
    // 支持多次使用，前提是两个缓存中间件处理的key不能有并集(通过testKey区分)
    cache('cache_key2', {
      // 持久化缓存
      type: 'local',
      expire: 86400000, // one day
      testKey: localCacheKeys.includes(key),
    }),
  ],
  // ...
})
```



config:

```typescript
interface CacheMiddlewareConf {
  /**
   * 过期时间(ms), 出于性能考虑，只在初始化阶段检测是否过期
   * */
  expire?: number;
  /**
   * true | 在过期前读取缓存时，是否刷新过期时间
   * */
  expireRefresh?: boolean;
  /**
   * session | 缓存类型，不共享缓存key
   * */
  type?: 'session' | 'local';
  /**
   * 默认缓存全部key，设置此项来开启指定key的缓存
   * */
  testKey?: (key: string) => boolean; // 验证通过的值进行缓存
  /**
   * 缓存过期或失效时触发
   * */
  onExpire?: () => void;
}
```


























