## 文档

说明 render/reload 的区别

滚动加载数据

定制

## 内部数据

## 要点备忘

### 滚动

onScroll 触发时机时滚动结束后, 表格内容渲染需要预先知道下一步的滚动位置进行渲染, 否则会有明显的闪烁现象, 通过以下方式解决

- 代理的滚动容器, 容器与待渲染内容尺寸一致, 监听其 scroll 事件来更新当前 x/y 轴位置
- 平滑优化后的 onWheel, 触发时机在滚动前, 但由于鼠标滚轮/触控板等滚动表现不一致, 鼠标有明显的顿感, 需要统一做平滑处理
- 平滑优化后的 拖拽滚动, 代替原生滚动, 触发时机亦在滚动之前, 需要尽量模拟自然平滑的滚动效果

### 性能

减少 render 期间对 dom 的直接访问和操作, 并适当缓存 dom 属性减少直接查询次数

## TODO

~~- 私有属性不在写在原对象上, 部分提前的延迟克隆可考虑去掉, fixed 克隆项使用原始 key, 原位置使用一条占位数据, 通过属性指向原数据~~
~~- 所有会变更 data/column 引用的地方调整, 只在变更前克隆一次~~
~~- hide 简化 | sort 问题排查~~
~~- 配置保存和数据保存分开, ~~toolbar 添加配置同步~~ toolbar 显示配置同步标记, 去掉 form.resetFormState~~
~~- 排序后项移动到了最后?, 移动到固定项报错, formStatus 显示异常~~
~~- 适配器如何注册? config 提供局部注册器, 在每个表单组件内单独注册, 把适配器类型提升到 common~~
~~- textarea 编辑, 支持滚动, 放大输入交互区域, 或是在其他地方显示更大的交互组件~~
~~- 支持无列线条样式~~
~~- pc 启用拖动模式, 鼠标支持 shift, 切换模式在原生版本提供, 但提供事件~~

性能优化:
~~onWheel/onScroll 是否存在重复的帧调用~~
~~确保 render 在每帧只会执行一次并且提供 getter 缓存~~
~~getAttachPosition -> getX / getY -> getScrollXX~~

form | softRemove | header | Interactive | select
feedback | empty | rowCloumnResize | disabled | softRemove | scrollMark

各个包含自定义覆盖层 render 的地方

- 添加设置/读取缓存
- 非固定项的位置是不用实时设置的, 参考 interactive

form 实现改动:

- verify 新增 getSchemasDetail(): { schemas, invalidNames } api
- verify 也实现 setSchemas , 省略部分操作
- 检查 verify 调用 check 可能存在性能问题不

核心实现:

- 通过 schema 来判断列是否可编辑, 简化启用编辑所需的配置
- 根据当前 schema 配置创建一个公共 verify 实例
- 行首次可见/整体提交时, 若没有 form 实例, 通过公共 verify 或已有 form 实例获取 schemas 和 invalidNames
- 根据当前显示行的 schemas 和 invalid 来控制可编辑表示和禁用反馈
- 行进入交互编辑时, 创建 form 实例, 通过 form 实例更新一次 schemas/invalidNames 后进行后续编辑操作
- 提交时: 对提交行使用公共 verify 进行遍历校验
- 获取数据时, 根据当前 invalidMap 删除无效项

改动杂项:

- 支持整行表单编辑

![img.png](img.png)

- 优化 firefox 等浏览器的帧率?

- 隐藏滚动条异常
- 编辑标记显示异常, fixed right 不显示头可编辑提示
- 切换数据后高度显示问题
- 整理其他不需要实现/暴露的 api
- 放开禁用 api ? 或是优化/简化内部实现, 不再对外暴露
- 滚动时关闭上下文菜单
- 删除列不计入更新
- 支持滚动方向锁定
- 数据量较大时保存按钮卡
- 重置大小时更新交互单元格
- 重置大小末尾项优化, 滚动条不固定显示, 鼠标滚动流畅化, 通过补帧?
- 为无 key 的数据按索引自动生成 key(自动 key 有规律, 用于配置保存), 获取数据时将生成的 key 移除
- feedback 不可见时不显示
- 设置界面: 显示/隐藏, 固定
- autoColumnSize 设置的列会自动平分剩余宽度
- 导出: 导出选中/导出所有/勾选要导出的列, 配置列字符串, 用于搜索/导出
- 独立窗口编辑行

滚动条优化

进阶

- 动画? 可尝试简单动画
- 可访问性
- tree 先封装一个通用的 tree Class, 处理 tree data 为 flat, 可通过 api 判断指定行是否显示来控制 ignore, flat 并处理传入的树形数据
  - 其他, 比如获取某项的子级等 tree 工具方法
  - table 可作为 tree 组件使用
- 框选组件, 支持高亮被框选项
- 复盘/整理

## 后续计划

- scroll 组件重构 (优化性能, 代码结构, 接入 wheel 等添加无限滚动)
- 滚动条可单独使用
- 支持滚动方向大致确定后锁定方向

```js
const config = {
  num: 4,
  script: "./xxx",
  register() {},
  mapper: {
    handle1(arg1) {
      return 123;
    },
  },
};

const w = new EazyWorker(config);

w.handle(1, 2, 3).then((res) => {});

// worker.js
new EasyWorker(config);
```

```js
// worker.js 在一个赶紧的文件内创建实例, 脚本会在主进程和子,  外部依赖越少越好

export default new M78Worker({
  url: import.meta.url,
  // 可通过m78config提前注册
  handleLoader: async (register: M78WorkerRegister) => {
    await Promise.all(import("../xxx.js"));
  },
});
```

```js
// 使用
import worker from "./worker.js";

worker.invoke("calc", 1, 2, 3).then((res) => {
  console.log(res);
});
```
