<h1 align="center" style="color: #61dafb;">Seed</h1>
<h1 align="center" style="font-size: 80px;color:#61dafb">🌱</h1>

<br>

<p align="center">Another simple state management library</p>

<br>

<p align="center">
    <span>en</span> | 
    <a href="./readme.zh-cn.md">中文</a>
</p>

<br>

<!-- TOC -->

- [Install](#install)
- [Introduction](#introduction)
- [usage](#usage)
- [APIs](#apis)
- [middleware](#middleware)
- [built-in middleware](#built-in-middleware)
  - [devtool](#devtool)
  - [cache](#cache)

<!-- /TOC -->

<br>

[![CI/CD](https://github.com/m78-core/seed/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/m78-core/seed/actions/workflows/ci-cd.yml)

<br>

## Install

```shell
yarn add @m78/seed
```



<br>



## Introduction

The `seed` currently contains the following core concepts:

- `state` object representing the current state
- `seed api`, an object that contains operations such as update `state`, obtaining `state`, subscribing to `state` changes, performing verification actions, etc.
- `middleware`, middleware system, used to change the initial configuration and enhance the api


<br>


## usage

```ts
import create from '@m78/seed';
import cache from '@m78/seed/cacheMiddleware';

// 1. create api through create()

const {
    set, // set state
    get, // get state
    subscribe, // subscribe to state changes
} = create({
    /* optional behavior, persist state to local (browser only) */
    middleware: [cache('my_state', 86400000/* ms */)],
    /* the initial state, which is dependent on all validators */
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



## APIs

```ts
/* create() */

const seed = create({
    /** set middleware */
    middleware?: (Middleware | null | undefined)[];
    /** current state */
    state?: object,
})

// update the value of state, only the keys contained in the incoming object
auth.set({ name: 'lj', })

// update the value of state, replace the entire state object
auth.coverSet({ name: 'lj', })

// get current state
auth.get();

// subscribe to state changes
const unsub = subscribe((changes) => {
   // ... 
});

// unsubscribe
unsub();
```

<br/>

<br/>


## middleware

the middleware is used to add various patching capabilities to the existing API or to modify the configuration before it actually takes effect.

middleware has two execution cycles：

- the initialization phase is used to modify the default configuration passed in
- the patch phase is used to add various enhanced patches to the built-in API



**signature：**

```ts
interface Middleware {
  (bonus: MiddlewareBonusPatch | MiddlewareBonusInit): CreateKitConfig<any, any> | void;
}

// Initialize phase parameters
export interface MiddlewareBonusInit {
  /** is initialization phase */
  init: true;
  /** current create configuration (may have been modified by other middleware) */
  config: CreateKitConfig<any, any>;
  /** objects that are shared among different middleware */
  ctx: AnyObject;
}

// patch phase parameters
export interface MiddlewareBonusPatch {
  init: false;
  /** current auth api */
  apis: Auth<any, any>;
  /** add enhanced patch to the API */
  monkey: MonkeyHelper;
  /** objects that are shared among different middleware */
  ctx: AnyObject;
}
```

<br/>

**an example of log middleware **	

```ts
import { Middleware } from '@m78/seed';

const cacheMiddleware: Middleware = bonus => {
    
  /* ##### initialization phase ##### */
  if (bonus.init) {
    const conf = bonus.config;
    console.log('init');
      
    // when initialized, the configuration must be returned, and even if it has not been modified, the return value will be used as the new initial state
    return { ...conf, state: { ...conf.state, additionalDep: 'hello😄'  } }; 
  }
  

  /* ##### patch phase ##### */
    
  console.log('api created');
    
  // print the set new state when executing setState
  bonus.monkey('set', next => patch => {
    console.log('set', patch);
    next(patch);
  });

  // output the fetch behavior when the state is obtained
  bonus.monkey('get', next => () => {
    console.log('get');
    return next();
  });

}
```

<br/>

<br/>

## built-in middleware

### devtool

enable  [redux-devtool](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd) support, this middleware should be placed after all middleware

```js
import create from '@m78/seed';
import devtool from '@m78/seed/devtoolMiddleware';

onst seed = create({
  middleware: [devtool],
  // ...
})
```



### cache

cache `state` by `storage api`

```js
import create from '@m78/seed';
import cache from '@m78/seed/cacheMiddleware';

const sessionCacheKeys = ['list1', 'list2', 'list3'];
const localCacheKeys = ['user', 'token'];

const seed = create({
  middleware: [
    cache('cache_key1', {
      // session level cache (default)
      type: 'session',
      // only cache eligible keys
      testKey: key => sessionCacheKeys.includes(key),
    }),
    // supports multiple uses, provided that the keys processed by the two cache middleware cannot have a union (differentiated by testKey)
    cache('cache_key2', {
      // persistent caching
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
   * expire time (ms) for performance reasons, only check for expiration during initialization
   * */
  expire?: number;
  /**
   * true | whether to flush the expiration time when reading the cache before expiration
   * */
  expireRefresh?: boolean;
  /**
   * session | cache type, the key can be the same
   * */
  type?: 'session' | 'local';
  /**
   * cache all keys by default. Set this to enable caching for a specified key
   * */
  testKey?: (key: string) => boolean;
  /**
   * trigger when the cache expires or invalidated
   * */
  onExpire?: () => void;
}
```
























