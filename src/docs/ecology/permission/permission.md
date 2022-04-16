---
title: Permission - 权限
group:
  title: 生态
  path: /ecology
  order: 6000
---

# Permission 权限

此库包含两种权限实现:

1. 常规版本，验证通过本地验证器和一组状态来实现, 灵活度和扩展性高, 比较适合包含中少量权限验证的前台项目。
2. `Pro` 版本，通过进一步的封装简化了 api 的整体使用，适合包含大量复杂权限逻辑的中后台项目，并且可以非常简单的和任意后端体系集成。

<br>

两种权限非常适合混合使用，比如在一个后台管理系统中，常规版本的权限控制很适合用来进行进行登录、账号状态的授权信息等验证，而 Pro 版本的权限验证则可以用来完成路由、组件、按钮级别的权限控制。

## Permission

常规版本权限控制，适合用来进行一些碎片化的权限验证。

### 基本示例

创建 [seed](/docs/ecology/seed) 实例来管理一组状态, 并通过 `Permission` 组件来对指定节点附加权限

<code src="./base-demo.tsx" />

### 反馈方式

无权限时有三种可选的反馈方式：占位节点、气泡框提示、隐藏

<code src="./feedback-type-demo.tsx" />

### withAuth

为现有组件附加权限控制，生成的权限组件会直接附带权限验证，可用于路由组件等的权限验证

<code src="./with-permission-demo.tsx" />

### useAuth

hooks 式的验证，接受验证参数，返回验证结果

<code src="./use-permission-demo.tsx" />

### or

类似编程语言中的 `||`，如果需要在两个权限中任意一个通过就通过验证，可以将权限 key 设置为二维数组`['key', ['key2', 'key3']]`·

> 💡 与常规验证器不同，串联的 `或验证器` 组不会在前面的验证器执行失败后阻止后面的同级验证器执行

以下例子中, 包含权限`login`并且包含 `admin` 和 `vip` 中的任意一个则视为通过

<code src="./or-demo.tsx" />

### 额外参数

某些验证器会需要接受当前运行时参数作为验证参照（比如验证是否为本人，会需要传入当前用户的信息给验证器），可以通过 extra 传递

<code src="./extra-demo.tsx" />

### 定制反馈节点

<code src="./custom-demo.tsx" />

### 局部验证器

只作用于当前挂载组件的验证器

<code src="./scope-demo.tsx" />

### api 速览

```tsx | pure
import { createSeed } from 'm78/seed';
import { create } from 'm78/auth';

// ###############################
//            创建实例
// ###############################

// 创建用于管理权限状态的seed
const seed = createSeed({
  /* 被所有验证器依赖数据 */
  state: {
    /** 登录用户 */
    user: '',
    /** 是否是管理员 */
    admin: 2,
  },
});

// 创建实例
const Permission = create({
  seed,
  /* 声明验证器 */
  validators: {
    // 登录状态验证器
    login(state) {

      // 验证器的职责就是根据当前的state检测是否包含权限，没有权限时，返回一组描述信息
      if (!state.user) {
        return {
          label: '未登录',
          desc: '请登录后再进行操作',
          // 无权限时可供使用的具体的操作, 以按钮展现
          actions: [...],
        };
      }
    },
    // ...更多验证器
  },
  /**
   * 如果一个验证未通过，则阻止后续验证
   * * 对于or中的子权限，即使开启了validFirst，依然会对每一项进行验证，但是只会返回第一个
   * * 在执行验证时将优先级更高的权限key放到前面有助于提高验证反馈的精度, 如 login > publisher, 因为publisher状态是以login为前提的
   *  */
  validFirst?: boolean;
});

// ###############################
//              API
// ###############################

// <Permission />本身是一个react组件，包含以下props
interface PermissionProps<S, V> {
  /**
   * 权限验证通过后显示的内容
   * - 当type为tooltip时，必须传入单个子元素，并且保证其能正常接收事件
   * */
  children: React.ReactElement | (() => React.ReactElement);
  /**
   * 待验证的权限key组成的数组
   * - 只要有一个权限未验证通过，后续验证就会被中断，所以key的传入顺序最好按优先级从左到右，如: ['login', 'isVip']
   * - 可以通过二维数组来组合两个条件['key1', ['key2', 'key3']], 组合的条件表示逻辑 `or` */
  keys: PermissionKeys<V>;
  /** 'feedback' | 反馈方式，分为占位节点、隐藏、气泡提示框三种, 当type为popper时，会自动拦截子元素的onClick事件, 同时，也需要确保子节点符合<Overlay />组件的子节点规则 */
  type?: PermissionTypeKeys | PermissionType;
  /** 传递给验证器的额外参数 */
  extra?: any;
  /**
   * 定制无权限时的反馈样式
   * @param rejectMeta - 未通过的权限的具体信息
   * @param props - 组件接收的原始props
   * @return - 返回用于显示的反馈节点
   * */
  feedback?: (rejectMeta: ValidMeta[], props: PermissionProps<S, V>) => React.ReactNode;
  /** 是否禁用，禁用时直接显示子节点 */
  disabled?: boolean;
  /** 局部验证器 */
  validators?: Validators<S>;
  /** 自定义显示的403 icon */
  icon?: React.ReactNode;
}

// Permission组件实例还包含以下静态属性和方法, 通过Permission.xxx使用
interface RCPermission<S, V> {
  /** 权限检测组件 */
  (props: PermissionProps<S, V>): ReactElement<any, any> | null;

  /** 一个permission实例, 可用于主动执行权限验证  */
  permission: Permission<S, V>;
  /** 创建带权限检测的高阶组件 */
  withPermission: <P>(
          conf: Omit<PermissionProps<S, V>, 'children'>,
  ) => (Component: React.ComponentType<P>) => React.FC<P>;
  /** 权限验证hook */
  usePermission: UsePermission<S, V>;
}

```

## AuthPro

这是一种为中后台项目开发设计的权限功能，这些系统大部分功能都围绕权限来进行，所以会需要一种更容易以后端技术集成、更容易使用、更适合处理复杂繁重系统的权限验证的方式。

<code src="./pro/base.tsx" />
