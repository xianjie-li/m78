## 杂

- 平衡初始化阶段和渲染阶段的计算量, 保证既能快速根据新配置初始化, 又能快速执行渲染
  - why? 需要频繁变更(单元格编辑/排序/拖拽/筛选)的情况下提供高性能, 不能假设配置时不变的
  - 每秒帧数为 60 或以上时, 画面看起来才会流畅, 这意味着你可以有至多 1000 / 60 = 16ms 的时间用于计算/渲染
- 事件通过通过 wrap 节点单次绑定, 配合 getBoundXX()这类的 api 确定操作的单元格
- chrome 节点最大尺寸为 +/-16777216 https://bugs.chromium.org/p/chromium/issues/detail?id=401762, 这对最大数据承载量造成了一定限制

next: ~~历史记录~~, ~~滚动阴影~~, ~~容器监听并重置~~, ~~处理 cells/rows 中的无效选项~~ ~~updateConfig~~, 选中

## api 风格

只有 getter 接口时, 格式为 getXxx

包含 getter/setter 时, 格式为 xxx() 取值 xxx(v) 更新值

> 最开始是计划实现基于 konva 的 canvas 表格, 所以接口风格与其相似, 但是在常规优化手段都用上后(禁用所有图形事件, 关闭叠图优化等等), 发现视口内渲染的单元格较多时卡顿明显
> 后改为 canvas 渲染, 但是在 safari 下滚动不流畅, 并且还要单独写高清屏适配, 文本对其/溢出计算等等..., 故又弃之
> 最后还是回到了 dom 渲染, 发现在行列都虚拟化后性能意外的还不错? 并且使用难度也更低了, 配合 dom 大大增强了可定制性.

## 缩放实现 >>部分

缩放 stage 后, 元素实际位置/尺寸不变, 但是实际可展示内容的空间变多/少, 需要调整对根据尺寸进行计算的地方,
改为使用缩放后的实际尺寸, 并根据变更比例调整当前 dom 容器的滚动位置

- .m78-table_view-content 根据缩放调整尺寸, 使 scrollWidth 正常响应, 因为直接使用 scale 在 chrome 上只有大于滚动容器才会更新滚动尺寸
- 单元格等表格元素均放到更深一层的节点中, 通过这个节点来统一设置缩放
- 滚动位置等比例调整
- 显示的内容视口尺寸调整

- 减少同时绘制的单元格数量
- dom 节点

后续功能开发后需要验证影响

## 简单

### stripe 2 -

### 固定区阴影反馈

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

## 滚动 =

固定项滚动抖动/虚拟滚动快速滚动短暂空白: 使用 wheel 代替 scroll 事件, 后者是滚动后触发, 进行渲染时已经处于滚动后了, 所以会有明显的延迟感

滚动容器依然使用 overflow: hidden + scrollLeft/Top 来实现, 但是滚动位置由 wheel/触摸 事件更新

> 不少浏览器貌对原生滚动有优化, 对比 transform 方案明显更流程(尤其是 safari)

触控设备: 由于不支持 wheel 事件, 需要使用 touch 手动实现滚动

## 固定 1 -

预计算固定项信息 -> 渲染

获取框选单元格等 api 的实现会有一定的麻烦

## 单元格合并 -

预计算固定项/被覆盖项信息 -> 正常渲染

合并单元格时, 需要将合并的单元格隐藏, 并将合并后的单元格的宽度/高度设置为合并的单元格的宽度/高度之和

## 选择器 -

getCell(x, y)
getRow(y)
getColumn(x)
getViewportItems()
getBoundItems()
...

## 事件 -

onError // 内部抛出的可能需要对用户展示的错误信息, 比如 "粘贴数据与选中单元格不匹配" 之类
onCellClick

### 事件过滤

选中或其他交互事件中, 如何在指定节点上避免冒泡

eventFilter: (dom) => boolean // 若返回 false, 该 dom 不会参与事件

## 表头& 行头 -

根据 Columns 配置生成固定项配置

表头分组时, 最顶层决定下方所有列是否固定, 忽略底层 fixed

## 拖动调整列宽/行高

onRowResize
onColumnResize

合并项拖动?

## copy/paste

copy({ x, y, endy, endx }?): csv 复制当前选中的单元格或指定单元格
paste(csv?, { x, y, endy, endx }?) 粘贴粘贴板上的 csv 格式内容到选中单元格或指定单元格, 需要记录 action

复制行数据/复制列数据

间隔复制

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

- 初始化, 将 data/columns 本地化并进行格式处理
- 发生变异操作, 本地更改 data/columns, 记录 action
- 触发变更事件
- 记录对获取变更有用的数据

浅拷贝时使用: ls.slice(), 测试发现 50 万条数据用时 0.5ms 而 `{...obj}` 用时 47ms, 注意, 此测试在浏览器控制台进行, 在使用编译器工具时, 最终代码可能会自动编译为 ls.slice(), 所以测试不准确

另外内部需要维护一个需要持久化的配置对象

数据同步方式:

- 统一完整提交: 操作完成后, 判断 dataChanged 和 configChanged, 若有变更, 将变更后的数据或配置完整提交, 这是最简单的方式, 但是单词数据量过大时可能体验不佳
- 统一局部提交: 操作完成后, 对变更项 ins.add / ins.changed / ins.removed / ins.sorted ([[oInd, nInd]])进行提交, 如果 configChanged = true 则同时提交配置
- 实时局部提交: 监听事件, 发生变更时将上述状态提交, 提交期间可通过 processing 阻塞表格, 完成后可清理对应的变更状态

通常, 数据量较少时, 第二种方式更好, 数据量大时, 第三种方式更好, 你可能还需要根据后端支持的接口操作来决定

onChange:

```ts
// 根据enum类型, 有多个不同的重写版本
onChange(actionType: actionEnum, arg: any) {
  actionType.addRow
  actionType.sort
  actionType.config
  // ...
}
```

其他:

- 数据改变后, 对变更行和变更单元格进行标记
- 需要进行数据变更时, 需要能确定行/列的 key, column.key / primaryKey | getPrimary

reload(keepState = false) 重置时可以选择是否清理当前状态: 滚动条位置, 操作历史, 变更状态等, 如果是全新的数据源, 应为 ture, 如果是当前数据源的变异版本, 应为 false

### data

### 历史记录 💦

执行变异操作时, 将其执行和取消执行的执行函数进行记录

history: []
currentHistoryCursor: 5,
action({ redo(), undo() })

table.redo();
table.undo();

MAX_HISTORY_LENGTH: 1000

接口需要暴露给插件使用

实现者应在输入框聚焦等特殊场景中忽略用户的撤销和重做操作
实现者应确保在合适的时机拷贝数据, 放置前后操作由于引用产生错乱

### 数据排序

数据排序: 本地排序/服务器排序, 点击依次是升序 > 降序 > 恢复, 右侧显示排序图标

用户监听事件, 变更数据后更新配置
排序不计入操作历史并会将其重置

onSort(column, ordType)

### 拖拽排序 💦

长按行头/列头时可拖拽排序, 界面显示反馈提示 / 启用时出现拖动标记, 仅可摘标记上拖动

onRowSort // 变更数据源
onColumnSort // 变更配置, 额外添加一个 sortColumns, 记录变更顺序的列, 在初始化时与 columns 同步

move(form: ind | ind[], to: ind)
moveRange(form: [s, e], to: ind)

拖拽排序: 拖拽调整列/行头顺序(点按时), 对已选中单元格进行拖拽时

### 编辑 💦

单元格值不再限制为 string

- 聚焦后, 如果发生录入, 替换当前值并聚焦输入
- 单击单元格时, 单元格聚焦, 如果配置了 dom render, 将其附加渲染为对应组件
- 编辑角标
- 校验: 错误时单元格显示红色, 点击后显示错误信息
- 列头显示可编辑和必填标记

actionType.valueChange [newValue]

### 增删数据

actionType.addRow
actionType.removeRow

addRow(data | data[], index?);
removeRow(index | index[]);
removeRange(start, end);

## 隐藏/行列

## 提示区域

选中 xx 行, 新增 xx 行, 删除 xx 行, 修改 xx 行, 保存前确认

## react 💦

### 上下文操作

复制单元格/粘贴/上方新增[可编辑]行/下方新增[可编辑]行/复制行/删除行

列操作/列上下文菜单:
输入模糊匹配或对应类型的筛选项, 如时间段/下拉列表
复制列名/复制/粘贴/隐藏列(隐藏后显示隐藏角标) | 升序/降序

行操作/行上下文菜单
复制单元格/粘贴/上方新增[可编辑]行/下方新增[可编辑]行/复制行/删除行
拖拽行头调整顺序(点按时)

### 工具栏

新增行/删除行/导出/缩放(添加 hook, 可以触发导出时自定义数据源, 暴露导出方法)/筛选/当前页内容查找(不联网, 高亮匹配内容)

## 移动端优化 💦

## 文档

说明 render/reload 的区别

定制

## 杂

- 光标聚焦显示隐藏的完整内容
- 内容查找(不联网, 高亮匹配内容)
- 导出: 导出选中/导出所有/勾选要导出的列
