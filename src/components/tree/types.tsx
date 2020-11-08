import { FormLikeWithExtra, SetState, UseCheckReturns } from '@lxjx/hooks';
import { ComponentBaseProps, DataSourceItem, Size } from 'm78/types';
import React from 'react';
import { ListChildComponentProps } from 'react-window';
import { flatTreeData } from './common';
import { useMethods } from './methods';
import { defaultProps } from './tree';

/**
 * 拖拽
 * */

/** value允许类型 */
export type TreeValueType = string | number;

export interface TreeProps extends ComponentBaseProps {
  /** 数据源 (每次更改时会解析树数据并缓存关联信息以提升后续操作速度，所以最好将dataSource通过useState或useMemo等进行管理，不要直接内联式传入) */
  dataSource?: OptionsItem[];
  /** 指定打开的节点 (受控) */
  opens?: TreeValueType[];
  /** 指定默认打开的节点 (非受控) */
  defaultOpens?: TreeValueType[];
  /** 打开节点变更时触发 */
  onOpensChange?: (nextOpens: TreeValueType[], metas: FlatMetas[]) => void;
  /**
   * 容器高度, 节点数据量过大时使用，传入此项时:
   * - 开启虚拟滚动
   * - 超出此高度会出现滚动条
   * - 内容不再支持超出自动折行，一律使用size或itemHeight指定的高度
   * */
  height?: number;

  /* ############## 其他常用配置 ############## */
  /** TODO: 开启异步加载数据，启用后，除了配置了OptionsItem.isLeaf的叶子节点外，一律可展开，并在展开时触发此回调 */
  onLazyLoad?: (opt: FlatMetas) => Promise<OptionsItem>;
  /** 禁用(工具条、展开、选中) */
  disabled?: boolean;
  /** 手风琴模式，同级只会有一个节点被展开 */
  accordion?: boolean;
  /** 默认展开所有节点, (通过api调用?)  */
  defaultOpenAll?: boolean;
  /** 默认展开到第几级, (通过api调用?) */
  defaultOpenZIndex?: number;

  /* ############## 定制选项 ############## */
  /** 自定义所有节点的默认前导图标，权重小于option中单独设置的 */
  icon?: React.ReactNode;
  /** 自定义展开标识图标, 如果将className添加到节点上，会在展开时将其旋转90deg, 也可以通过open自行配置 */
  expansionIcon?: React.ReactNode | ((open: boolean, className: string) => React.ReactNode);
  /** 尺寸 */
  size?: Size;
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
    FormLikeWithExtra<TreeValueType, FlatMetas> {
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
    FormLikeWithExtra<TreeValueType[], FlatMetas[]> {
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
  actions?: React.ReactNode | ((current: FlatMetas) => React.ReactNode);
  /**
   * 是否为叶子节点
   * - 设置onLazyLoad异步加载数据后，所有项都会显示展开图标，如果项被指定为叶子节点，则视为无下级且不显示展开图标
   * - 传入onLazyLoad时生效
   * */
  isLeaf?: boolean;
  /** 在需要自行指定value或label的key时使用 */
  [key: string]: any;
}

/** 根据DataSource展开得到的列表项，包含大量树操作的帮助信息 */
export interface FlatMetas extends OptionsItem {
  /** 通过flatTreeData确保存在 */
  value: TreeValueType;
  /** 当前层级 */
  zIndex: number;
  /** 所有父级节点 */
  parents?: FlatMetas[];
  /** 所有父级节点的value */
  parentsValues?: TreeValueType[];
  /** 所有兄弟节点(包含本身) */
  siblings: FlatMetas[];
  /** 所有兄弟节点的value */
  siblingsValues: TreeValueType[];
  /** 所有子孙节点 */
  descendants?: FlatMetas[];
  /** 所有子孙节点的value */
  descendantsValues?: TreeValueType[];
  /** 所有除树枝节点外的子孙节点 */
  descendantsWithoutTwig?: FlatMetas[];
  /** 所有除树枝节点外的子孙节点的value */
  descendantsWithoutTwigValues?: TreeValueType[];
  /** 从第一级到当前级的value */
  values: (string | number)[];
  /** 从第一级到当前级的索引 */
  indexes: number[];
  /** 以该项关联的所有选项的关键词拼接字符 */
  fullSearchKey: string;
  /** 该项子级的所有禁用项 */
  disabledChildren: FlatMetas[];
  /** 该项子级的所有禁用项的value */
  disabledChildrenValues: TreeValueType[];
}

/** 共享配置 */
export interface Share {
  /** 平铺列表 */
  list: FlatMetas[];
  /** 管理展开状态的checker */
  openCheck: UseCheckReturns<string | number, FlatMetas>;
  /** 管理value选中状态的check */
  valCheck: UseCheckReturns<string | number, FlatMetas>;
  /** Tree组件props */
  props: TreePropsSingleChoice & TreePropsMultipleChoice & typeof defaultProps;
  /** 扁平化的tree */
  flatMetas?: ReturnType<typeof flatTreeData>;
  state: {
    /** 初始化状态 */
    loading: boolean;
    /** 扁平化的tree */
    flatMetas: ReturnType<typeof flatTreeData> | undefined;
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
  data: FlatMetas;
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
}

export interface VirtualItemProps extends ListChildComponentProps {
  /** 当前列表和其他要传给ItemProps的props */
  data: {
    /**  当前列表 */
    data: FlatMetas[];
  } & Omit<ItemProps, 'data'>;
}
