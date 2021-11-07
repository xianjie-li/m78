---
title: Tree - 树形菜单
group:
  title: 数据录入
  path: /form
  order: 3000
---

# Tree 树形菜单

简单易用的高性能树形菜单

## 基础示例

渲染一个最基础的树视图

<code src="./base-demo.tsx" />

## 单选

单选，支持受控、非受控使用，可通过`checkTwig`开启树枝节点选中， `emptyTwigAsNode`将空的树节点视为子节点并使其可选中

<code src="./single-check-demo.tsx" />

## 多选

多选，支持受控、非受控使用, 可传入`checkStrictly`来关闭父子级的选中关联

<code src="./multiple-check-demo.tsx" />

## 展开行为

有 4 种展开控制方式: 不受控、受控、默认展开全部、默认展开几级

<code src="./open-demo.tsx" />

## 十万级数据渲染

得益于虚拟滚动/字典/节点预关联查询等优化，Tree 组件能够轻松支持 10 万以上数据节点的渲染和选中，在关闭多选时这个数值会更高 😀!

你所要做的就是传入`height`为 tree 组件配置一个高度，以上优化就会自动启用。

<code src="./big-data.tsx" />

🤔 大数据量渲染应该只作为防止组件崩溃的一个回退手段，通常，如果你要同时展示过多的数据，应该优先考虑对数据的展现形式进行优化(通过分页、搜索、智能推送等)。

## 动态加载

传入`onLoad`开启异步加载子项数据，它返回 Promise，该 Promise resolve 树节点的子项

<code src="./dynamic-demo.tsx" />

## 手风琴模式

同一级下只会同时展开一个

<code src="./accordion-demo.tsx" />

## 尺寸

不同尺寸，你还可以通过`itemHeight`和`identWidth`自行设置缩进、项高

<code src="./size-demo.tsx" />

## 工具条

包含快速选中、选中统计、折叠工具、搜索工具等的工具条，可以通过传入对象来开启特定功能

<code src="./toolbar-demo.tsx" />

## 自定义

配置展开图标、节点标识图标等

<code src="./custom-demo.tsx" />

## 连接线

<code src="./indicator-line.tsx" />

## 拖拽模式

拖动树节点进行排序

通常，对一个树节点进行拖动排序，需要执行以下操作:

- 拖动到放置目标前或后, 表示行为 `移动为目标的兄弟节点`, 需要将拖动目标从当前位置移除, 并插入放置目标的前面或后面
- 拖动到放置目标上方, 表示行为 `移动到指定目录下`, 需要将拖动目标从当前位置移除, 并将其添加到目标元素的`children`列表最后

为了方便，tree 组件会自动对 dataSource 进行如上操作，但这并不会影响你存放在服务器、storage、sqlLite 等地方的原数据, 你需要监听`onDragAccept`来自行持久化更改数据源, 如果你的存储数据源和当前数据源结构完全一致，甚至可以直接将 onDragAccept 的 nextDataSource 参数持久化保存

如果预设的本地数据源更改行为不符合你的排序行为预期，可以通过`skipDragDatasourceProcess=false`关闭对本地 dataSource 自动进行排序处理的行为，完全由用户控制 dataSource 的表更

<code src="./draggable-demo.tsx" />

## API

### **`Props`**

```tsx | pure
type TreeValueType = string | number;

interface TreeProps {
  /* ############## 常用 ############## */
  /** 数据源 (每次更改时会解析树数据并缓存关联信息以提升后续操作速度，所以最好将dataSource通过useState或useMemo等进行管理，不要直接内联式传入) */
  dataSource?: TreeDataSourceItem[];
  /**
   * 组件内部更改了数据源时，通过此方法通知
   * - 在启用了动态加载子节点、拖拽等功能时触发，它们的共同点是都会更改传入的dataSource
   * - 此选项存在的意义是让动态加载、拖拽排序等功能使用更简单，目前常见组件库中的tree均是只做节点变更通知，需要由用户手动根据节点层级
   * 将新数据/节点顺序设置到DataSource后再更新数据源，但是多层级的树形数据操作是非常麻烦且费时的，所以组件将这些更新操作放到内部进行，用户仅需监听
   * onDataSourceChange并将新的DataSource合并即可
   * - 出于性能考虑，在存在超大数据量的树形数据时，深拷贝非常耗时，组件会直接更改传入的dataSource，并在更新引用后传入onDataSourceChange
   * 所以在开启了动态加载子节点、拖拽功能时，必须传入此项来同步dataSource
   * */
  onDataSourceChange?: (ds: TreeDataSourceItem[]) => void;
  /**
   * 容器高度, 节点数据量过大时使用，传入此项时:
   * - 开启虚拟滚动
   * - 超出此高度会出现滚动条
   * */
  height?: number | string;

  /* ############## 单选/多选 ############## */
  /** 是否可单选 (使用高亮样式) */
  checkable?: boolean;
  /** false | 是否可选中目录级（单选时可用） */
  checkTwig?: boolean;
  /** 是否可多选，启用后onChange/value/defaultValue接受数组，此配置的权重低于单选配置checkable  */
  multipleCheckable?: boolean;
  /**
   * true | 关闭后，父子节点不再强关联(父节点选中时选中所有子节点，子节点全选中时父节点选中)
   * - 如果数据量超过10万，关闭选中关联会大大提高性能
   * */
  checkStrictly?: boolean;
  /** 选项的受控值 (多选时，TreeValueType类型为数组) */
  value?: TreeValueType;
  /** 选项的非受控值 (多选时，TreeValueType类型为数组) */
  defaultValue?: TreeValueType;
  /** 选项的变更回调 (多选时，TreeValueType和TreeNode类型为数组) */
  onChange?: (value: TreeValueType, extra: TreeNode) => void;

  /* ############## 其他常用配置 ############## */
  /**
   * 开启异步加载数据，启用后，除了配置了OptionsItem.isLeaf的节点和已有含值子级的节点外，一律可展开，并在展开时触发此回调
   * - 返回选项数组时，会作为该节点的子项，返回空数组则表示该节点为空
   * - 返回非以上值时，设置改节点为叶子节点，不可再展开
   * - 如果promise异常，则忽略操作
   *  */
  onLoad?: (node: TreeNode) => Promise<TreeDataSourceItem[]>;
  /** 手风琴模式，同级只会有一个节点被展开 */
  accordion?: boolean;
  /** 默认展开所有节点  */
  defaultOpenAll?: boolean;
  /** 默认展开到第几级 */
  defaultOpenZIndex?: number;
  /** 将包含children但值为`[]`的数组视为子节点, 使其可在单选模式下不开启checkTwig的情况下选中 */
  emptyTwigAsNode?: boolean;
  /** 点击节点 */
  onNodeClick?: (current: TreeNode) => void;
  /** 禁用(工具条、展开、选中) */
  disabled?: boolean;
  /** 指定打开的节点 (受控) */
  opens?: TreeValueType[];
  /** 指定默认打开的节点 (非受控) */
  defaultOpens?: TreeValueType[];
  /** 打开节点变更时触发 */
  onOpensChange?: (nextOpens: TreeValueType[], nodes: TreeNode[]) => void;
  /** 过滤掉所有返回false的节点，使其不在列表显示 */
  filter?: (current: Node) => boolean;
  /** 过滤关键字, 用于实现本地搜索 */
  keyword?: string;

  /* ############## 定制选项 ############## */
  /** 自定义展开标识图标, 如果将className添加到节点上，会在展开时将其旋转90deg, 也可以通过open自行配置 */
  expansionIcon?: React.ReactNode | ((open: boolean, className: string) => React.ReactNode);
  /** 如何从选项中拿到value，默认是 item => item.value || item.label, 如果无value且label不为字符类型，应该手动传入value来禁用默认的回退行为 */
  valueGetter?: (optItem: TreeDataSourceItem) => TreeValueType;
  /** 如何从选项中拿到label，默认是 item => item.label */
  labelGetter?: (optItem: TreeDataSourceItem) => React.ReactNode;
  /** 如何从选项中拿到children，默认是 item => item.children */
  childrenGetter?: (optItem: Item) => Item[];
  /** 公共的操作区内容, 渲染在每个节点的右侧  */
  actions?: React.ReactNode | ((current: TreeNode) => React.ReactNode);
  /** 自定义所有叶子节点的默认前导图标，权重小于option中单独设置的 */
  icon?: React.ReactNode;
  /** 自定义所有树枝节点的默认前导图标，权重小于option中单独设置的 */
  twigIcon?: React.ReactNode;
  /** 自定义节点渲染方式, 接收到的icon为从不同配置中获取的最终icon */
  customIconRender?: (icon: string | React.ReactNode, node: TreeNode) => React.ReactNode;
  /** 尺寸 */
  size?: SizeKeys;
  /** 节点项的基础高度，传入时覆盖size选项的默认项高度 */
  itemHeight?: number;
  /** 缩进格和前导图标容器的宽度，传入时覆盖size选项的默认宽度 */
  identWidth?: number;
  /** 启用toolbar, 传入true | {} 时，启用全部，也可以通过配置对象逐个指定 */
  toolbar?: boolean | ToolbarConf;
  /** 为toolbar添加额外节点 */
  toolbarExtra?: React.ReactNode;
  /** true | 是否开启连接指示线 */
  indicatorLine?: boolean;
  /** 彩虹色连接指示线 */
  rainbowIndicatorLine?: boolean;

  /* ############## 拖动 ############## */
  /** 开启拖动排序 */
  draggable?: boolean;
  /** 拖动并触发重新排序时调用, 内置的排序逻辑仅作用于本地数据，用户应在此方法中完成排序数据的持久化 */
  onDragAccept?: (event: DragFullEvent, nextDataSource: Item[]) => void;
  /** 关闭默认的拖动数据源处理逻辑, 交由用户自行更新dataSource */
  skipDragDatasourceProcess?: boolean;
}
```

### **`TreeDataSource`**

```tsx | pure
interface TreeDataSourceItem {
  /** 选项名 */
  label: React.ReactNode;
  /** 选项值, 默认与label相同 */
  value: TreeValueType;
  /** 是否禁用 */
  disabled?: boolean;
  /** 子项列表 */
  children?: TreeDataSourceItem[];
  /**
   * 是否为叶子节点
   * - 设置onLoad开启异步加载数据后，所有项都会显示展开图标，如果项被指定为叶子节点，则视为无下级且不显示展开图标
   * - 传入onLoad时生效
   * */
  isLeaf?: boolean;
  /** 前导图标 */
  icon?: React.ReactNode;
  /** 在开启虚拟滚动时，可通过此项单独制定项高度 */
  height?: number;
  /** 操作区内容 */
  actions?: React.ReactNode | ((current: TreeNode) => React.ReactNode);
  /** 在需要自行指定value或label的key时使用 */
  [key: string]: any;
}
```

### **`TreeNode`**

描述一个节点的对象, 包含基础信息和其亲属关系

```tsx | pure
interface TreeNode {
  /** 该节点对应的值 */
  value: TreeValueType;
  /** 当前层级 */
  zIndex: number;
  /** 所有父级节点 */
  parents?: TreeNode[];
  /** 所有父级节点的value */
  parentsValues?: TreeValueType[];
  /** 所有兄弟节点(包含本身) */
  siblings: TreeNode[];
  /** 所有兄弟节点的value */
  siblingsValues: TreeValueType[];
  /** 所有子孙节点 */
  descendants?: TreeNode[];
  /** 所有子孙节点的value */
  descendantsValues?: TreeValueType[];
  /** 所有除树枝节点外的子孙节点 */
  descendantsWithoutTwig?: TreeNode[];
  /** 所有除树枝节点外的子孙节点的value */
  descendantsWithoutTwigValues?: TreeValueType[];
  /** 从第一级到当前级的value */
  values: (string | number)[];
  /** 从第一级到当前级的索引 */
  indexes: number[];
  /** 以该项关联的所有选项的关键词拼接字符 */
  fullSearchKey: string;
  /** 该项子级的所有禁用项 */
  disabledChildren: TreeNode[];
  /** 该项子级的所有禁用项的value */
  disabledChildrenValues: TreeValueType[];
  /** 未更改的原DataSource对象 */
  origin: TreeDataSourceItem;
  /** 子节点列表 */
  child?: TreeNode[];
}
```

### **`Toolbar`**

```tsx | pure
interface ToolbarConf {
  /** 启用便捷选择(多选时生效) */
  check?: boolean;
  /** 选项统计(多选时生效) */
  checkCount?: boolean;
  /** 启用折叠工具 */
  fold?: boolean;
  /** 启用搜索(搜索对于label为ReactNode的选项无效，开启搜索时，建议始终将label指定为string) */
  search?: boolean;
}
```
