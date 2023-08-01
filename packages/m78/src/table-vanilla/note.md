## 杂

- 平衡初始化阶段和渲染阶段的计算量, 保证既能快速根据新配置初始化, 又能快速执行渲染
  - why? 需要频繁变更(单元格编辑/排序/拖拽/筛选)的情况下提供高性能, 不能假设配置是不变的
  - 每秒帧数为 60 或以上时, 画面看起来才会流畅, 这意味着你可以有至多 1000 / 60 = 16ms 的时间用于计算/渲染
- 事件通过通过 wrap 节点单次绑定, 配合 getBoundXX()这类的 api 确定操作的单元格, 不要在每个单元格上绑定事件
- chrome 节点最大尺寸为 +/-16777216 https://bugs.chromium.org/p/chromium/issues/detail?id=401762, 这对最大数据承载量造成了一定限制

## 简单

### stripe 2 -

### 固定区阴影反馈 -

cell 判断 index 变更背景色

## 自定义渲染 =

1. TableColumnConfig.render

提供自定义渲染的入口

```tsx
// 自定义渲染, 若返回true则阻止默认的innerText渲染
function render(cell): boolean | void {}

// react版本, 返回React.ReactElement | null时阻止默认渲染, 并使用返回作为渲染结果
function render(cell): React.ReactElement | null | void {}
```

react 等框架中单元格节点通过 portal 渲染:

```tsx
<CustomRender />; // 逻辑抽象到单独组件, 放置频繁render

ins.event.rendered.on(() => {
  update();
});

const config = this.table.config();

// render在react中需要包裹一层

cusRender = (cell) => {
  const r = config.render(cell);
  if (isReactElement(r) || r === null) {
    return true; // 阻止默认渲染
  }
};

// 暴露此列表给用户
renderList = ins.currentCells.map((cell) => {
  const r = cusRender(cell);
  if (isReactElement(r) || r === null) {
    return true;
  }
  return false;
});

ins.renderList.map((cell, n: React.ReactElement | null) => {
  // declare重写类型: 使columnConfig.render返回ReactNode
  return React.createPortal(n, cell.dom, cell.key);
});
```

## 滚动 -

为了防止滚动空白闪烁, 需要代理所有的滚动行为, 包括 wheel 事件监听和自定义滚动条, 这样才能实现对滚动结果位置的掌控, 从而提前进行渲染

固定项滚动抖动/虚拟滚动快速滚动短暂空白: 使用 wheel 代替 scroll 事件, 后者是滚动后触发, 进行渲染时已经处于滚动后了,
所以会有明显的延迟感

滚动容器依然使用 overflow: hidden + scrollLeft/Top 来实现, 但是滚动位置由 wheel/触摸 事件更新

> 不少浏览器貌对原生滚动有优化, 对比 transform 方案明显更流畅(尤其是 safari)

触控设备: 由于不支持 wheel 事件, 需要使用 touch 手动实现滚动

## 固定 -

预计算固定项信息 -> 渲染

获取框选单元格等 api 的实现会有一定的麻烦

## 单元格合并 -

预计算固定项/被覆盖项信息 -> 正常渲染

合并单元格时, 需要将合并的单元格隐藏, 并将合并后的单元格的宽度/高度设置为合并的单元格的宽度/高度之和

## 选择器 -

getXXX
...

## 事件 -

onError // 内部抛出的可能需要对用户展示的错误信息, 比如 "粘贴数据与选中单元格不匹配" 之类
onCellClick

**事件过滤**

选中或其他交互事件中, 如何在指定节点上避免冒泡

eventFilter: (dom) => boolean // 若返回 true, 该 dom 不会参与内置事件

## 表头&行头 -

根据 Columns 配置生成固定项配置

表头分组时, 最顶层决定下方所有列是否固定, 忽略底层 fixed

## 拖动调整列宽/行高 -

合并项拖动?

行列均以以后侧的线为拖拽点, 固定项的首行/列前后侧的点均用于控制自身

## copy/paste -

copy({ x, y, endy, endx }?): csv 复制当前选中的单元格或指定单元格
paste(csv?, { x, y, endy, endx }?) 粘贴粘贴板上的 csv 格式内容到选中单元格或指定单元格, 需要记录 action

复制行数据/复制列数据

间隔复制

不在显示区域的单元格不粘贴

## 选中 -

列选中在目前表格场景中场景不大, 暂不考虑

禁用控制
rowSelectable: boolean | (row) => boolean;
cellSelectable: boolean | (cell) => boolean;

// 事件
event.select // 任意选中变更
event.cellSelect
event.rowSelect

// 获取选项信息
ins.getSelectedCells(): [][] // 返回并排序选中的单元格
ins.getSelectedRows()

// api 触发选中
ins.selectRows(rowKeys[], merge = false)
ins.selectCells(cellKeys[], merge = false);

// 自动滚动

实现比较麻烦, 可能需要考虑的点:

**固定项自动靠边**: 固定项拖动到边缘后, 如果对应方向滚动位置未靠边, 将其滚动到边
**视口边缘自动滚动**: 框选到达视口边缘或超过时, 自动向对应方向滚动
**前两者产生的歧义**: 前两种行为在同一方向会同时发生, 如何消歧?

**自动滚动后框选区需要动态调整**

**移动设备**: 在已选中单元格上拖动进行框选

**shift/ctrl**
未按下 shift 时, 记录最后的 point
按下 shift 时, 以最后点代替作为起始点
move 时, 以当前点和最后的正常点计算范围, 取当前 和 最后可组成的最大矩形区

## mutation 💦

### 基础

**基本流程**

- 初始化, 将 data/columns/persistenceConfig 本地化并进行格式处理
- 发生变异操作, 本地更改 data/columns/persistenceConfig, 记录 action
- 触发变更事件

**数据同步方式**

- 统一完整提交: 操作完成后, 判断 dataChanged 和 configChanged, 若有变更, 将变更后的数据或配置完整提交, 这是最简单的方式,
  但是数据量过大时可能体验不佳
- 统一局部提交: 操作完成后, 对变更项 ins.add / ins.changed / ins.removed / ins.sorted ([[oInd, nInd]])进行提交, 如果
  configChanged = true 则同时提交配置
- 实时局部提交: 监听事件, 发生变更时将上述状态提交, 提交期间可通过 processing 阻塞表格, 完成后可清理对应的变更状态

**onChange**

```ts
// 根据enum类型, 有多个不同的重写版本
onChange(actionType
:
actionEnum, arg
:
any
)
{
  actionType.addRow
  actionType.sort
  actionType.config
  // ...
}
```

### data

### config

- 支持接收 config.persistenceConfig, 用于还原需要持久化的配置
- 初始化/重置时, 将该配置克隆本地化, 并将代码中的 key 和本地同名 key 配置合并
- 对应配置变更时, 通过 event.configChange(keys) 通知, 并写入 history
- 示例上提供 table.configChanged 判断配置是否变更, table.configChangedKeys 获取变更的配置项, table.persistenceConfig
  获取当前配置

若自定义排序后, 代码中配置了新列, 根据 key 的前后关系放入 sortColumns 中
通过 redo, undo 直接操作本地化的配置

### 历史记录 💦 -

执行变异操作时, 将其执行和取消执行的执行函数进行记录

history: []
currentHistoryCursor: 5,
action({ redo(), undo() })

table.redo();
table.undo();

MAX_HISTORY_LENGTH: 1000

接口需要暴露给插件使用

实现者应在输入框聚焦等特殊场景中忽略用户的撤销和重做操作
实现者应确保在合适的时机拷贝数据, 防止前后操作由于引用产生错乱

### 数据排序

数据排序: 本地排序/服务器排序, 点击依次是升序 > 降序 > 恢复, 右侧显示排序图标

用户监听事件, 变更数据后更新配置
排序不计入操作历史并会将其重置

onSort(column, ordType)

### 拖拽排序 💦 -

行拖动: 在选中项上 drag
列拖动: 过滤 tap, drag 时拖动

操作后, 调用 moveRow/moveColumn 进行变更

### 编辑 💦

基础部分:

在核心库中实现, 在只存着单个选中单元格并对其进行点击时, 进入`interactive`状态, interactive 并非一定表示单元格编辑,
也可能是渲染某个组件

interactiveRender({ cell, attachNode }): clearFn?;

```tsx
let current = null;
// 一个假想的在react中进行集成的方式
function interactiveRender({ attachNode }) {
  current = createPortal(<input />, attachNode);
}

// 实际的react上下文中
return <div>{current}</div>;
```

- react 中通过 portal api 渲染, 并将其返回的 reactElement 渲染到实际上下文中
- dom 环境下, 直接改写 attachNode, 并通过返回 clearFn 来在 interactive 项变更时执行清理

attachNode 会实时依附到对应的 cell 上, 并跟随其尺寸变化, 用户应自行控制在 attachNode 下的表单控件样式
attachNode 需要提供清理方式, 并支持延迟卸载来应对关闭动画或者 react 等框架的渲染延迟

增强部分:

- 在 react 中实现, 包含校验功能

js 版本提供单个单元格点击后触发的替换行为 onCellInteractive 单元格开始交互, 只会同时有一个单元格进入交互状态

并提供最简单的单元格编辑功能, 使用遮盖的方式显示编辑层, 原单元格保持不变

单元格值可为任意值, 特殊类型值可以自定义 render

- 聚焦单元格只有单个时, 渲染其表单控件

actionType.valueChange [row, column, newValue]

实现:
每一行都是一个 form 实例, 在变更后创建实例并进行校验(需要保证行对象引用不变 + form 能直接操作原对象), 提交时拼接
eachSchema 进行校验

交互方式:
值变更时, 对所有有变更的行进行校验, 标记变更过的行/单元格(检测是否有 form 实例, 实例是否 changed, 需要忽略私有字段)
校验失败的项, 在单元格显示红色边框, 点击右下角红色角标可显示错误信息
表头显示 可编辑 浅蓝 必填 - 橙色标记
提交时要全部校验, 高亮第一行错误

### 增删/移动数据 -

actionType.addRow // arg: data[] index
actionType.removeRow // keys[]

// 添加的固定项时, 移动至常规项顶部
addRow(data | data[], index?); // 没有主键时需要手动为其生成

removeRow(keys | keys[]);

moveRow/moveColumn

## 隐藏列 -

隐藏列的位置显示展开标记, 点击可恢复

## react 💦

### 上下文操作

复制单元格/粘贴/上方新增[可编辑]行/下方新增[可编辑]行/复制行/删除行

列操作/列上下文菜单:
输入模糊匹配或对应类型的筛选项, 如时间段/下拉列表
复制列名/复制/粘贴/隐藏列(隐藏后显示隐藏角标) | 升序/降序

行操作/行上下文菜单
复制单元格/粘贴/上方新增[可编辑]行/下方新增[可编辑]行/复制行/删除行
拖拽行头调整顺序(点按时)

隐藏列

### 工具栏

新增行/删除行/导出/缩放(添加 hook, 可以触发导出时自定义数据源, 暴露导出方法)/筛选/当前页内容查找(不联网, 高亮匹配内容)

### 提示区域

选中 xx 行, 新增 xx 行, 删除 xx 行, 修改 xx 行, 保存前确认

撤销/重做等的提示

## 移动端优化 -

移动端忽略键盘, 选中等复杂操作

## 拖拽冲突 -

通过 event 来检测是否为 touch 事件:

event: PointerEvent | MouseEvent | TouchEvent

分别检测

pointerType === "touch" || type.startWith("touch")

检测为 touch 事件时, 做移动端处理

移动端:

- 滚动: 拖拽
- 框选: 无

PC:

- 滚动: 滑轮
- 框选: 拖拽

## 可访问性 =

交互中时, 点击 tab 切换到下个相邻单元格

缺失: 无障碍

## 文档

说明 render/reload 的区别

定制

## 杂

- 光标聚焦显示隐藏的完整内容
- 内容查找, 高亮匹配内容
- 导出: 导出选中/导出所有/勾选要导出的列

## virtualBound -

// 框选添加最小距离限制

事件冲突解决

```ts
interface Bound {
  zIndex: number; // 0
  type: any; // 对应的块类型
  cursor: string; // 鼠标样式, 未在任何bound时使用默认样式er;
  data: any;
}

getBound(xy)
:
bound[];
如果在区域内
可以阻止其他事件
hasBound(xy);  // 该点包含其他点

v.bounds = [bound];
v.cursor;

v.click;
v.hover(bound);
v.drag(bound);
```
