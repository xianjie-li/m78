---
title: Table - 表格
group:
  title: 展示组件
  path: /view
  order: 4000
---

# Table 表格

通过二维数据表展示信息

## 常规

### 示例

最基础的用法，传入数据源`dataSource`, 并通过`columns`配置要显示的列

<code src="./base-demo.tsx" />

### 字段值渲染

* `field`支持对嵌套对象、数组项取值
* `render`可以用来进行一些复杂列的渲染
* 列不一定要对应一个数据源字段、可以通过`render`来生成虚拟列

<code src="./render-demo.tsx" />


### 大数据量渲染

html表格的渲染效率是非常低的，这导致如果表格数据量很多会非常卡顿，如果你要渲染的数据很多，可以通过开箱即用的虚拟滚动来对其进行优化。

* 由于表格项是惰性加载的，如果列的内容宽度波动较大，建议为其设置一个固定的宽度, 否则表格会在子项宽度变更时会持续动态调整列宽
* 部分浏览器在使用默认滚动条时会包含滚动性能优化，关闭滚动条定制可以提升一定的性能

渲染99999条记录

<code src="./big-data-demo.tsx" />

> 🤔 大数据量渲染应该只作为防止组件崩溃的一个回退手段，通常，如果你要同时展示过多的数据，应该优先考虑对数据的展现形式进行优化(通过分页、搜索、智能推送等)。

### 样式

配置分割风格、条纹背景、尺寸等

<code src="./style-demo.tsx" />

### 单元格props

单元格props能够为每个单元格传入独立的props, 可以用来配置样式、对齐、事件等, 此外, 你还通过在`column.props`配置针对列的prop

<code src="./cell-props-demo.tsx" />


### 固定列

表格包含很多列时，可以将其中的某些列固定到左侧或右侧方便查看和操作

<code src="./fixed-demo.tsx" />


### 合并单元格

对单元格进行行或列合并, 有以下注意事项:
- 对于被合并的行或列，必须为其返回0来腾出位置, 否则会导致表格排列异常
- fixed列和普通列不能进行合并
- 合并不作用于表头

<code src="./span-demo.tsx" />

### valueGetter

排序、选项、树形表格等功能需要获取能表示记录的唯一值， valueGetter用于获取这个字段，由于id和key是非常常见的记录主键，所以会作为默认值进行获取

将记录组件指定为uid

```tsx | pure
<Table valueGetter={item => item.uid} />
```

### 排序

为列配置`sort`来开启排序，然后通过`onSortChange`来排序数据源并显示

> 此示例是针对静态数据的，实际使用时一般会通过onSortChange来监听排序状态变更并根据排序参数重新请求后端接口

<code src="./sort-demo.tsx" />

### 过滤

通过列的extra配置在表头挂载额外的节点，以此来实现过滤逻辑

<code src="./filter-demo.tsx" />

### 总计栏

配置`summary`来对每一列生成总计

<code src="./summary-demo.tsx" />


## 选择

### 多选

多选的受控使用示例，可通过`value`/`defaultValue`/`onChange`自行控制受控和非受控件的使用方式

<code src="./mcheck-demo.tsx" />


### 单选

单选的受控使用示例，可通过`value`/`defaultValue`/`onChange`自行控制受控和非受控件的使用方式

<code src="./scheck-demo.tsx" />


## 树形表格

### 基础示例

使用树形表格时, dataSource遵循一些特定的配置, 比如`children`配置其子项、`isLeaf`配置其是否为叶子节点.

> 树形表格和[tree](/docs/form/tree)共用一套底层的树形处理逻辑，仅对部分用法进行了增减

<code src="./tree-base-demo.tsx" />

### 多选

多选，支持受控、非受控使用, 可传入checkStrictly来关闭父子级的选中关联

<code src="./tree-mcheck-demo.tsx" />

### 单选

单选，支持受控、非受控使用，可通过checkTwig开启树枝节点选中， emptyTwigAsNode将空的树节点视为子节点并使其可选中

<code src="./tree-scheck-demo.tsx" />

### 展开行为

有 4 种展开控制方式: 不受控、受控、默认展开全部、默认展开几级

<code src="./tree-opens-deme.tsx" />

### 动态加载

传入onLoad开启异步加载子项数据，它返回 Promise，该 Promise resolve 树节点的子项

<code src="./tree-dynamic-load-demo.tsx" />

### 手风琴

同一级下只会同时展开一个

<code src="./tree-accordion-demo.tsx" />


## Api

### **`Table`**

```tsx | pure
interface TableProps {
  /** 表格列配置 */
  columns: TableColumns;
  /** 数据源 (每次更改时会解析树数据并缓存关联信息以提升后续操作速度，所以最好将dataSource通过useState或useMemo等进行管理，不要直接内联式传入) */
  dataSource?: TableDataSourceItem[];
  /**
   * 组件内部更改了数据源时，通过此方法通知
   * - 在启用了动态加载子节点、拖拽等功能时触发，它们的共同点是都会更改传入的dataSource
   * - 此选项存在的意义是让动态加载、拖拽排序等功能使用更简单，目前常见组件库中的tree均是只做节点变更通知，需要由用户手动根据节点层级
   * 将新数据/节点顺序设置到DataSource后再更新数据源，但是多层级的树形数据操作是非常麻烦且费时的，所以组件将这些更新操作放到内部进行，用户仅需监听
   * onDataSourceChange并将新的DataSource合并即可
   * - 出于性能考虑，在存在超大数据量的树形数据时，深拷贝非常耗时，组件会直接更改传入的dataSource，并在更新引用后传入onDataSourceChange
   * 所以在开启了动态加载子节点、拖拽功能时，必须传入此项来同步dataSource
   * */
  onDataSourceChange?: (ds: TableDataSourceItem[]) => void;
  /**
   * key/id | 表格中的每一条记录都应该有一个能表示该条记录的字段, valueGetter用于获取这个字段的key
   * - 在启用了选择等功能时，valueGetter获取到的值会作为选中项的value
   * - 由于id和key是非常常见的记录主键，所以会作为默认值进行获取， 如果是key/id 以外的键(如uid)，需要特别指定
   * */
  valueGetter?: string;
  /**
   * 表格高度, 表格数据量过大时使用，传入此项时:
   * - 开启虚拟滚动
   * - 超出此高度会出现滚动条
   * - 固定表头
   * */
  height?: string | number;
  /** 设置加载中状态 */
  loading?: boolean;

  /* ############## 功能选项 ############## */
  /**
   * 根据传入坐标对行进行合并
   * - 对于被合并的行，必须为其返回0来腾出位置, 否则会导致表格排列异常
   * - fixed列和普通列不能进行合并
   * - 不作用于表头、总结栏
   * */
  rowSpan?: (cellMeta: TableMeta) => number | void;
  /**
   * 根据传入坐标对列进行合并
   * - 对于被合并的列，必须为其返回0来腾出位置, 否则会导致表格排列异常
   * - fixed列和普通列不能进行合并
   * - 不作用于表头
   * */
  colSpan?: (cellMeta: TableMeta) => number | void;
  /** 开启总结栏并根据此函数返回生成每列的值 */
  summary?: (colMeta: TableMeta) => React.ReactNode | void;
  /** 默认的排序值 */
  defaultSort?: TableSortValue;
  /** 受控的排序值 */
  sort?: TableSortValue;
  /** 触发排序的回调, 无sort传入时表示取消排序 */
  onSortChange?: (sort: TableSortValue | []) => void;
  /** 如果传入，则控制要显示的列, 数组项为 columns.key 或 字符类型的columns.field */
  showColumns?: string[];
  /** 此项一般会传入一个对象，并且可以在TableMeta.ctx中访问，可用于在某些静态配置(column)中动态获取当前组件上下文的状态 */
  ctx?: any;

  /* ############## 定制选项 ############## */
  /** 表格宽度，默认为容器宽度 */
  width?: string | number;
  /**
   * 'regular' | 表格的数据分割类型:
   * - border: 边框型
   * - regular: 常规型，行直接带分割线
   * */
  divideStyle?: TableDivideStyleKeys | TableDivideStyleEnum;
  /** true | 显示条纹背景 */
  stripe?: boolean;
  /** 表格尺寸 */
  size?: SizeKeys | SizeEnum;
  /** 300px 单元格最大宽度, 用于防止某一列内容过长占用大量位置导致很差的显示效果 */
  cellMaxWidth?: string | number;
  /** 单元格未获取到有效值时(checkFieldValid()返回false), 用于显示的回退内容, 默认显示 “-” */
  fallback?: React.ReactNode | ((cellMeta: TableMeta) => React.ReactNode);
  /** 通过column.filed获取到字段值后，会通过此函数检测字段值是否有效，无效时会显示回退值, 默认只有truthy和0会通过检测 */
  checkFieldValid?: (val: any) => boolean;
  /** true | 是否开启webkit下的自定义滚动条，部分浏览器使用默认滚动条时会自带滚动性能优化，可以关闭此项来提升性能 */
  customScrollbar?: boolean;
  /**
   * 所有单元格设置的props, 支持td标签的所有prop
   * - 可通过该配置为所有单元格同时设置样式、对齐、事件等
   * - 部分被内部占用的props无效
   * */
  props?:
          | React.PropsWithoutRef<JSX.IntrinsicElements['td']>
          | ((cellMeta: TableMeta) => React.PropsWithoutRef<JSX.IntrinsicElements['td']> | void);


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
  onChange?: (value: TreeValueType, extra: TableTreeNode) => void;
  
  
  /* ############## 树常用配置 ############## */
  /**
   * 开启异步加载数据，启用后，除了配置了OptionsItem.isLeaf的节点和已有含值子级的节点外，一律可展开，并在展开时触发此回调
   * - 返回选项数组时，会作为该节点的子项，返回空数组则表示该节点为空
   * - 返回非以上值时，设置改节点为叶子节点，不可再展开
   * - 如果promise异常，则忽略操作
   *  */
  onLoad?: (node: TableTreeNode) => Promise<TableDataSourceItem[]>;
  /** 手风琴模式，同级只会有一个节点被展开 */
  accordion?: boolean;
  /** 默认展开所有节点  */
  defaultOpenAll?: boolean;
  /** 默认展开到第几级 */
  defaultOpenZIndex?: number;
  /** 将包含children但值为`[]`的数组视为子节点, 使其可在单选模式下不开启checkTwig的情况下选中 */
  emptyTwigAsNode?: boolean;
  /** 点击节点 */
  onNodeClick?: (current: TableTreeNode) => void;
  /** 禁用(工具条、展开、选中) */
  disabled?: boolean;
  /** 指定打开的节点 (受控) */
  opens?: TreeValueType[];
  /** 指定默认打开的节点 (非受控) */
  defaultOpens?: TreeValueType[];
  /** 打开节点变更时触发 */
  onOpensChange?: (nextOpens: TreeValueType[], nodes: TableTreeNode[]) => void;
  /** 如何从选项中拿到children，默认是 item => item.children */
  childrenGetter?: (optItem: Item) => Item[];
}
```

### **`Column`**

```tsx | pure
interface TableDataSourceItem {
  /** 列名 */
  label: string;
  /**
   * 该列对应的数据字段
   * - 传入字符数组时可以嵌套获取值, 如:
   * @example
   * - ['user', 'name'] => user.name
   * - ['things', '1', 'name'] => things[1].name
   * */
  field?: string | string[];
  /** 自定义渲染内容, 会覆盖field配置 */
  render?: (cellMeta: TableMeta) => React.ReactNode;
  /** 列的固定宽度, 不传时列宽取决于其内容的宽度 */
  width?: string | number;
  /**
   * 列的最大宽度, 此配置会覆盖width配置
   * - 具体表现为，内容宽度未超过maxWidth时根据内容决定列宽，内容宽度超过列宽时取maxWidth
   * - 通常此配置能实现比width更好的显示效果
   * */
  maxWidth?: string | number;
  /** 固定列到左侧或右侧, 如果声明了fixed的列在常规列中间，它会根据固定方向移动到表格两侧渲染 */
  fixed?: TableColumnFixedKeys | TableColumnFixedEnum;
  /**
   * 为该列所有单元格设置的props, 支持td标签的所有prop
   * - 可通过该配置为整列同时设置样式、对齐、事件等
   * - 部分被内部占用的props无效
   * */
  props?:
          | React.PropsWithoutRef<JSX.IntrinsicElements['td']>
          | ((cellMeta: TableMeta) => React.PropsWithoutRef<JSX.IntrinsicElements['td']> | void);
  /** 在列头渲染的额外内容 */
  extra?: React.ReactNode | ((cellMeta: TableMeta) => React.ReactNode);
  /**
   * 如果开启了排序等功能, 需要通过此项来对列进行标识
   * - 如果未明确传入此值，且field为string类型的话，会将filed作为key使用
   * - 如果未明确传入此值，且field为array类型的话，会将其转换为字段字符串并作为key使用，如user.name、news[0].title
   * - 如果包含多个相同的filed声明，则应该为重复的列显式传入key
   * */
  key?: string;
  /**
   * 开启过滤并通过onSort进行回调:
   * - 如果为boolean值true，则表示同时开启asc和desc两种类型的排序
   * - 如果为string类型，则表示只开启该类型的排序
   * */
  sort?: boolean | TableSortKeys | TableSortEnum;
  /** 其他任意的键值 */
  [key: string]: any;
}
```

### **`TreeDataSource`**

```tsx | pure
interface TableDataSourceItem {
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
  /** 在需要自行指定value或label的key时使用 */
  [key: string]: any;
}
```

### **`TableTreeNode`**

```tsx | pure
interface TableTreeNode {
  /** 该节点对应的值 */
  value: TreeValueType;
  /** 当前层级 */
  zIndex: number;
  /** 所有父级节点 */
  parents?: TableTreeNode[];
  /** 所有父级节点的value */
  parentsValues?: TreeValueType[];
  /** 所有兄弟节点(包含本身) */
  siblings: TableTreeNode[];
  /** 所有兄弟节点的value */
  siblingsValues: TreeValueType[];
  /** 所有子孙节点 */
  descendants?: TableTreeNode[];
  /** 所有子孙节点的value */
  descendantsValues?: TreeValueType[];
  /** 所有除树枝节点外的子孙节点 */
  descendantsWithoutTwig?: TableTreeNode[];
  /** 所有除树枝节点外的子孙节点的value */
  descendantsWithoutTwigValues?: TreeValueType[];
  /** 从第一级到当前级的value */
  values: (string | number)[];
  /** 从第一级到当前级的索引 */
  indexes: number[];
  /** 以该项关联的所有选项的关键词拼接字符 */
  fullSearchKey: string;
  /** 该项子级的所有禁用项 */
  disabledChildren: TableTreeNode[];
  /** 该项子级的所有禁用项的value */
  disabledChildrenValues: TreeValueType[];
  /** 未更改的原DataSource对象 */
  origin: TableDataSourceItem;
  /** 子节点列表 */
  child?: TableTreeNode[];
}
```
