import { AnyObject } from "@m78/utils";

export type Share<S = any> = CreateSeedConfig<S> & {
  listeners: Array<Listener>;
};

export interface SetState<S = any> {
  (patch: Partial<S>): void;
}

export interface CoverSetState<S = any> {
  (patch: S): void;
}

export type Listener<S = AnyObject> = (changes: Partial<S>) => void;

export type Subscribe<S = AnyObject> = (listener: Listener<S>) => () => void;

/**
 * seed instance
 *
 * seed实例
 * */
export interface Seed<S = any> {
  /**
   * update current state, only the key contained in the object is changed
   *
   * 更改当前state, 只会更改对象中包含的key
   * */
  set: SetState<S & { [key: string]: any }>;
  /**
   * overwrite the current state with the new state
   *
   * 以新state覆盖当前state
   * */
  coverSet: CoverSetState<S & { [key: string]: any }>;
  /**
   * subscribe to the state change, return the function used to unsubscribe the change subscription, receive the changed state(the original value passed by setState)
   *
   * 订阅state变更, 返回函数用于取消改订阅, 接收变更的state(setState传入的原始值)
   * */
  subscribe: Subscribe<S>;
  /**
   * get current state
   *
   * 获取当前的state
   * */
  get(): S;
}

/**
 * seed creation configuration
 *
 * seed的创建配置
 * */
export interface CreateSeedConfig<S = any> {
  /**
   * middleware
   *
   * 中间件 */
  middleware?: (Middleware | null | undefined)[];
  /**
   * state
   *
   * 状态
   * */
  state?: S;
}

/**
 * 中间件初始化阶段的入参
 *
 * arg during the middleware initialization phase
 * */
export interface MiddlewareBonusInit {
  /**
   * whether or not this is the initialization phase
   *
   * 是否为初始化阶段
   * */
  init: true;
  /**
   * 当前创建配置(可能已被其他中间件修改过)
   *
   * current creation configuration (may have been modified by other middleware)
   * */
  config: CreateSeedConfig;
  /**
   * 在不同中间件中共享的对象，可以通过中间件特有的命名空间在其中存储数据
   *
   * objects shared in different middleware can store data in them through the unique namespace of the middleware
   * */
  ctx: AnyObject;
}

/**
 * 中间件补丁阶段的入参
 *
 * entry parameters of the middleware patch phase
 * */
export interface MiddlewareBonusPatch {
  /**
   * 是否为初始化阶段
   *
   * whether or not this is the initialization phase
   * */
  init: false;
  /**
   * current auth api (may have been modified by other middleware)
   *
   * 当前的auth api(可能已被其他中间件修改过)
   * */
  apis: Seed;
  /**
   * 为api添加增强补丁
   *
   * add enhanced patches to the api
   * */
  monkey: MonkeyHelper;
  /**
   * Objects shared in different middleware can store data in them through the unique namespace of the middleware
   *
   * 在不同中间件中共享的对象，可以通过中间件特有的命名空间在其中存储数据 */
  ctx: AnyObject;
}

/**
 * optional api enhancement help tool
 *
 * 可选的api增强帮助工具
 * */
export interface MonkeyHelper {
  <Name extends keyof Seed>(
    name: Name,
    cb: (next: Seed[Name]) => Seed[Name]
  ): void;
}

/**
 * Middleware function. Used to enhance the api and modify the initial configuration
 *
 * 中间件函数。用于增强api、修改初始化配置
 * @param bonus -
 * various parameters provided for the middleware to enhance the api
 * 为中间件提供的各种用于增强api的参数
 *
 * @return <config | void> -
 * when in the initialization phase, the return value will be passed to the next api as the new config, and there is no return value in the non-initialization phase
 * 当处于初始化阶段时，返回值会作为新的config传递给下一个api, 非初始化阶段无返回值
 * */
export interface Middleware {
  (bonus: MiddlewareBonusPatch | MiddlewareBonusInit): CreateSeedConfig | void;
}

/**
 * api creator
 *
 * 创建函数
 * */
export interface SeedCreator {
  <S extends AnyObject = AnyObject>(conf?: CreateSeedConfig<S>): Seed<S>;
}
