避免传入引用类型字面量的提示

schema 单独传入, 仅用于验证, 忽略无关配置, 使用基础版 form 即可

渲染时要判断该项 valid, 为 false 时不渲染

不支持单独窗口编辑

行第一次变更时以行默认值创建 form 实例, 监听 mutation value change, 变更时同步写到 form 实例, 自动触发校验

统一提交时创建一个 form, 拼接 eachSchema 来校验, 失败时高亮第一行错误

UI:

- 表头顶部显示可编辑, 橙色标记必填, 浅蓝标记可编辑,
- 单元格变更标记, 在左上角显示 blue 标记
- 行变更标记 在左侧显示橙色标记 + 错误标记
- 校验失败单元格, 右上角显示红色标记

- 标记添加 title 作为说明

选中单元格只包含一个时:

若包含错误, 在单元格上方显示错误信息
若单元格超出, 在上方显示完整内容

verifyErrorTip(cell, message) // 包含错误信息的单元格被单独选中时, 需要适当的地方对错误信息进行展示
coverTip(cell, message) // 未能完整展示内容的单元格被单独选中时, 需要使用适当的方式对其内容进行展示

tip({
cell?,
node,
type: cellTip | validate | hoverTip | disableTip
})

或

改造 useTrigger 为可以 api 使用, 然后 config 接收 dialog 或 onTrigger 实例

接收一个额外回调来控制渲染内容, 参数为

{
cell?,
node,
messages,
type: validateTip | tip
}

滚动或点击时隐藏上述提示

显示类型:

- 点击
- hover

```ts
function tipChange({
  targer: el | bound, // 对应的dom节点
  show, // 是否显示
  text: string,
  type: "cell" | "verify" | "regular",
  cell,
}) {}
```

遮挡单元格/错误单元格/禁用单元格/编辑提示

单元格提示, select 且只有单个单元格时
编辑提示, hover 时出发

- 语言包对外暴露
- disable 系列 api 隐藏
- 排序
- 固定列最后一列/行无法 resize

- 遮挡单元格 & 错误单元格 & 禁用单元格: 单个聚焦后显示
- 可编辑提示: active

```ts
function feedback(arg: {
  type: "overflow" | "error" | "disable" | "regular" | "close";
  text: "";
  cell?: Cell;
  dom?: HTMLElement;
  bound?;
}) {}
```
