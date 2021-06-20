import { FormLikeWithExtra, SetState, UseCheckReturns } from '@lxjx/hooks';
import { ComponentBaseProps, DataSourceItem, SizeKeys } from 'm78/types';
import React from 'react';
import { ListChildComponentProps } from 'react-window';
import { flatTreeData } from './common';
import { useMethods } from './methods';
import { defaultProps } from './tree';

/** value允许类型 */
export type TreeValueType = string | number;

export interface TreeProps extends ComponentBaseProps {
  /** 数据源 (每次更改时会解析树数据并缓存关联信息以提升后续操作速度，所以最好将dataSource通过useState或useMemo等进行管理，不要直接内联式传入) */
  dataSource?: OptionsItem[];
  /**
   * 组件内部更改了数据源时，通过此方法通知
   * - 仅在启用了动态加载子节点、拖拽功能时触发，它们的共同点是都会更改传入的dataSource
   * - 此选项存在的意义是让动态加载、拖拽排序等功能使用更简单，目前常见组件库中的tree均是只做节点变更通知，需要由用户手动根据节点层级
   * 将新数据/节点顺序设置到DataSource后再更新数据源，但是多层级的树形数据操作是非常麻烦且费时的，所以组件将这些更新操作放到内部进行，用户仅需监听
   * onDataSourceChange并将新的DataSource合并即可
   * - 出于性能考虑，在存在超大数据量的树形数据时，深拷贝非常耗时，组件会直接更改传入的dataSource，并在更新引用后传入onDataSourceChange
   * 所以在开启了动态加载子节点、拖拽功能时，必须传入此项来同步dataSource
   * */
  onDataSourceChange?: (ds: OptionsItem[]) => void;
  /** 指定打开的节点 (受控) */
  opens?: TreeValueType[];
  /** 指定默认打开的节点 (非受控) */
  defaultOpens?: TreeValueType[];
  /** 打开节点变更时触发 */
  onOpensChange?: (nextOpens: TreeValueType[], nodes: TreeNode[]) => void;
  /**
   * 容器高度, 节点数据量过大时使用，传入此项时:
   * - 开启虚拟滚动
   * - 超出此高度会出现滚动条
   * - 内容不再支持超出自动折行，一律使用size或itemHeight指定的高度
   * */
  height?: number;

  /* ############## 其他常用配置 ############## */
  /**
   * 开启异步加载数据，启用后，除了配置了OptionsItem.isLeaf的节点和已有含值子级的节点外，一律可展开，并在展开时触发此回调
   * promise异常或返回空数组都会被忽略
   *  */
  onLoad?: (node: TreeNode) => Promise<OptionsItem[]>;
  /** 禁用(工具条、展开、选中) */
  disabled?: boolean;
  /** 手风琴模式，同级只会有一个节点被展开 */
  accordion?: boolean;
  /** 默认展开所有节点  */
  defaultOpenAll?: boolean;
  /** 默认展开到第几级 */
  defaultOpenZIndex?: number;
  /** 将包含children但值为`[]`的数组视为子节点, 使其可在单选模式下不开启checkTwig的情况下选中 */
  emptyTwigAsNode?: boolean;
  /** 公共的操作区内容, 渲染在每个节点的右侧  */
  actions?: React.ReactNode | ((current: TreeNode) => React.ReactNode);
  /** 点击节点 */
  onNodeClick?: (current: TreeNode) => void;

  /* ############## 定制选项 ############## */
  /** 自定义所有节点的默认前导图标，权重小于option中单独设置的 */
  icon?: React.ReactNode;
  /** 自定义展开标识图标, 如果将className添加到节点上，会在展开时将其旋转90deg, 也可以通过open自行配置 */
  expansionIcon?: React.ReactNode | ((open: boolean, className: string) => React.ReactNode);
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
  /** 如何从选项中拿到value，默认是 item => item.value */
  valueGetter?: (optItem: OptionsItem) => TreeValueType;
  /** 如何从选项中拿到label，默认是 item => item.label */
  labelGetter?: (optItem: OptionsItem) => React.ReactNode;
  /** true | 是否开启连接指示线 */
  indicatorLine?: boolean;
  /** 彩虹色连接指示线 */
  rainbowIndicatorLine?: boolean;
  customer?: {
    tree(meta: {
      loading: boolean;
      isEmpty: boolean;
      renderToolbar: () => JSX.Element | null;
      renderList: () => JSX.Element | JSX.Element[];
    }): React.ReactNode;
    placeholder(meta: {
      style: React.CSSProperties;
      data: TreeNode;
      itemProps: ItemProps;
    }): React.ReactNode;
    item(meta: {
      isChecked: boolean;
      isDisabled: boolean;
      toggleHandle: () => void;
      isEmptyTwig: boolean;
      style: React.CSSProperties | undefined;
      renderIdent: () => JSX.Element;
      isVirtual: boolean;
      renderMultiCheck: () => JSX.Element;
      renderLabel: () => JSX.Element;
    }): React.ReactElement;
  };
}

/** 工具条配置 */
export interface ToolbarConf {
  /** 启用便捷选择(多选时生效) */
  check?: boolean;
  /** 选项统计(多选时生效) */
  checkCount?: boolean;
  /** 启用折叠工具 */
  fold?: boolean;
  /** 启用搜索(搜索对于label为ReactNode的选项无效，开启搜索时，建议始终将label指定为string) */
  search?: boolean;
}

/** 单选props */
export interface TreePropsSingleChoice
  extends TreeProps,
    FormLikeWithExtra<TreeValueType, TreeNode> {
  /** 是否可单选 (使用高亮样式) */
  checkable?: boolean;
  /** false | 是否可选中目录级 */
  checkTwig?: boolean;
  /** extend(FormLikeWithExtra) | 控制选中值 */
  // value/defaultValue/onChange
}

/** 多选props */
export interface TreePropsMultipleChoice
  extends TreeProps,
    FormLikeWithExtra<TreeValueType[], TreeNode[]> {
  /** 是否可多选，启用后onChange/value/defaultValue接受数组，此配置的权重低于单选配置checkable  */
  multipleCheckable?: boolean;
  /**
   * true | 关闭后，父子节点不再强关联(父节点选中时选中所有子节点，子节点全选中时父节点选中)
   * - 如果数据量超过10万，关闭选中关联会大大提高性能
   * */
  checkStrictly?: boolean;
  /** extend(FormLikeWithExtra) | 控制选中值 */
  // value/defaultValue/onChange
}

/** dataSource项类型 */
export interface OptionsItem extends Partial<DataSourceItem<TreeValueType>> {
  /** extend(DataSourceItem) | 选项名 */
  // label: React.ReactNode;
  /** extend(DataSourceItem) | 选项值, 默认与label相同 */
  // value: TreeValueType;
  /** 是否禁用 */
  disabled?: boolean;
  /** 子项列表 */
  children?: OptionsItem[];

  /** 前导图标 */
  icon?: React.ReactNode;
  /** 在开启虚拟滚动时，可通过此项单独制定项高度 */
  height?: number;
  /** 操作区内容 */
  actions?: React.ReactNode | ((current: TreeNode) => React.ReactNode);
  /**
   * 是否为叶子节点
   * - 设置onLoad开启异步加载数据后，所有项都会显示展开图标，如果项被指定为叶子节点，则视为无下级且不显示展开图标
   * - 传入onLoad时生效
   * */
  isLeaf?: boolean;

  /** 在需要自行指定value或label的key时使用 */
  [key: string]: any;
}

/** 根据DataSource展开得到的列表项，包含大量树操作的帮助信息 */
export interface TreeNode extends OptionsItem {
  /** 通过flatTreeData确保存在 */
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
  /** 未更改的原对象 */
  origin: OptionsItem;
  /** 子节点列表, 区别于children，children是未经过处理的原始值 */
  child?: TreeNode[];
}

/** 共享配置 */
export interface Share {
  /** 平铺列表 */
  list: TreeNode[];
  /** 管理展开状态的checker */
  openCheck: UseCheckReturns<TreeValueType, TreeNode>;
  /** 管理value选中状态的checker */
  valCheck: UseCheckReturns<TreeValueType, TreeNode>;
  /** 管理节点加载状态的checker */
  loadingCheck: UseCheckReturns<TreeValueType, TreeValueType>;
  /** Tree组件props */
  props: TreePropsSingleChoice & TreePropsMultipleChoice & typeof defaultProps;
  /** 扁平化的tree */
  nodes?: ReturnType<typeof flatTreeData>;
  state: {
    /** 初始化状态 */
    loading: boolean;
    /** 扁平化的tree */
    nodes: ReturnType<typeof flatTreeData> | undefined;
    /** 当前搜索关键词 */
    keyword: string;
  };
  setState: SetState<Share['state']>;
  self: {
    // 标记defaultOpen是否已触发过
    defaultOpenTriggered?: boolean;
    // 标记defaultOpenZIndex是否已触发过
    defaultOpenZIndexTriggered?: boolean;
    // 是否正在滚动中
    scrolling: boolean;
    // 恢复scrolling状态的计时器
    scrollingCheckTimer?: any;
  };
  isVirtual: boolean;
  toolbar?: ToolbarConf;
}

export interface ItemProps extends ComponentBaseProps {
  /** 该项的对应数据 */
  data: TreeNode;
  /** 共享数据 */
  share: Share;
  /** Tree内部方法 */
  methods: ReturnType<typeof useMethods>;
  /** 尺寸新 */
  size: {
    /** 节点项的基础高度 */
    itemHeight: number;
    /** 缩进格和前导图标容器的宽度 */
    identWidth: number;
  };
  /** 该项索引 */
  index: number;
}

export interface VirtualItemProps extends ListChildComponentProps {
  /** 当前列表和其他要传给ItemProps的props */
  data: {
    /**  当前列表 */
    data: TreeNode[];
  } & Omit<ItemProps, 'data' | 'index'>;
}

export type DragItemProps = Omit<ItemProps, 'provided' | 'snapshot'>;
