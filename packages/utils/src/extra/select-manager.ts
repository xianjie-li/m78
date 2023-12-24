import { isFunction, isString, isTruthyOrZero } from "../is.js";
import { createEvent, CustomEvent } from "../lang.js";

/** 创建配置 */
export interface SelectManagerOption<Item = any, Opt = any> {
  /** 选项列表 */
  list: Opt[];
  /**
   * 控制如何从list的每一项中获取到value, value具有以下限制:
   * - 作为是否选中的标识, 其必须唯一
   * - 必须是字符串或数值
   * */
  valueMapper?: string | ((i: Opt) => Item);
}

/** 选中状态 */
export interface SelectManagerSelectedState<Item = any, Opt = any> {
  /** 当前选中项, 包含strangeSelected */
  selected: Item[];
  /** 选中项的原始选项, 包含strangeSelected */
  originalSelected: Opt[];
  /** 不存在于option.list的选中项 */
  strangeSelected: Item[];
  /** 不包含strangeSelected的选中项 */
  realSelected: Item[];
}

/**
 * 用于列表的选中项管理, 内置了对于超大数据量的优化
 *
 * - 怪异选中, 如果选中了list中不存在的选项, 称为怪异选中, 可以通过 selected.strangeSelected 访问这些选项, 存在此行为时, 以下api行为需要注意:
 * partialSelected / allSelected 仅检测list中存在的项
 * selectAll / toggleAll 仅选中list中存在的选项
 * */
export class SelectManager<Item = any, Opt = any> {
  /** 将list映射为字典, 提升取值效率 */
  #listMap: Map<Item, Opt> = new Map();

  /** 已选值, 如果存在key则为已选, val存放选中的值(相对于key可以保留实际类型) */
  #selectedMap: Map<Item, null> = new Map();

  /** 选中值变更时触发的事件 */
  changeEvent: CustomEvent<VoidFunction>;

  readonly option: SelectManagerOption<Item>;

  constructor(option?: SelectManagerOption<Item>) {
    this.option = option || { list: [] };

    this.changeEvent = createEvent();

    this.#syncListMap();
  }

  /** 从list项中获取值(根据valueMapper) */
  getValueByItem(i: any) {
    const { valueMapper } = this.option;

    let v: Item;

    if (isString(valueMapper)) {
      v = (i as any)[valueMapper];
    } else if (isFunction(valueMapper)) {
      v = valueMapper(i);
    } else {
      v = i;
    }

    return v;
  }

  /** 值是否在list中存在 */
  isWithinList(val: Item) {
    return this.#listMap.has(val);
  }

  /** 检测值是否被选中 */
  isSelected(val: Item) {
    return this.#selectedMap.has(val);
  }

  /** 当前选中项的信息 */
  getState(): SelectManagerSelectedState<Item, Opt> {
    const originalSelected: Opt[] = [];
    const realSelected: Item[] = [];
    const strangeSelected: Item[] = [];

    const selected = Array.from(this.#selectedMap.keys());

    for (const i of selected) {
      const opt = this.#listMap.get(i);

      // 根据有无选项做差异处理
      if (opt !== undefined) {
        originalSelected.push(opt);
        realSelected.push(i);
      } else {
        originalSelected.push(i as any as Opt);
        strangeSelected.push(i);
      }
    }

    return {
      originalSelected,
      selected: Array.from(selected),
      realSelected,
      strangeSelected,
    };
  }

  /** list中部分值被选中, 不计入strangeSelected */
  get partialSelected(): boolean {
    for (const i of this.#selectedMap.keys()) {
      if (this.isWithinList(i)) return true;
    }
    return false;
  }

  /** 当前list中的选项是否全部选中, 不计入strangeSelected */
  get allSelected(): boolean {
    const state = this.getState();

    const realLength = state.selected.length - state.strangeSelected.length;

    return realLength === this.option.list.length;
  }

  /** 重新设置option.list */
  setList(list: Opt[]) {
    this.option.list = list;
    this.#syncListMap();
    this.#emitChange();
  }

  /** 选中传入的值 */
  select(val: Item) {
    this.#selectedMap.set(val, null);
    this.#emitChange();
  }

  /** 取消选中传入的值 */
  unSelect(val: Item) {
    this.#selectedMap.delete(val);
    this.#emitChange();
  }

  /** 选择全部值 */
  selectAll() {
    for (const i of this.#listMap.keys()) {
      this.#selectedMap.set(i, null);
    }
    this.#emitChange();
  }

  /** 取消选中所有值 */
  unSelectAll() {
    this.#selectedMap.clear();
    this.#emitChange();
  }

  /** 反选值 */
  toggle(val: Item) {
    const unlock = this.#lock();
    if (this.isSelected(val)) {
      this.unSelect(val);
    } else {
      this.select(val);
    }
    unlock();
    this.#emitChange();
  }

  /** 反选所有值 */
  toggleAll() {
    const unlock = this.#lock();

    for (const i of this.#listMap.keys()) {
      this.toggle(i);
    }
    unlock();
    this.#emitChange();
  }

  /** 一次性设置所有选中的值 */
  setAllSelected(next: Item[]) {
    this.#selectedMap.clear();
    next.forEach((val) => {
      this.#selectedMap.set(val, null);
    });
    this.#emitChange();
  }

  /** 设置指定值的选中状态 */
  setSelected(val: Item, isSelect: boolean) {
    const unlock = this.#lock();
    if (isSelect) {
      this.select(val);
    } else {
      this.unSelect(val);
    }
    unlock();
    this.#emitChange();
  }

  /** 一次选中多个选项 */
  selectList(selectList: Item[]) {
    selectList.forEach((val) => {
      this.#selectedMap.set(val, null);
    });
    this.#emitChange();
  }

  /** 以列表的形式移除选中项 */
  unSelectList(selectList: Item[]) {
    selectList.forEach((val) => {
      this.#selectedMap.delete(val);
    });
    this.#emitChange();
  }

  /** 是否选中了值 */
  hasSelected() {
    return this.#selectedMap.size !== 0;
  }

  /** 根据当前的option.list同步listMap */
  #syncListMap() {
    this.#listMap.clear();

    this.option.list.forEach((i) => {
      const v = this.getValueByItem(i);

      // 仅处理有效值
      if (!isTruthyOrZero(v)) return;

      this.#listMap.set(v, i as any as Opt);
    });
  }

  #lockFlag = 1;

  /** 锁定change触发器, 锁定期间其他触发器调用不会触发 */
  #lock() {
    if (this.#lockFlag === 1) {
      this.#lockFlag = 0;
      return () => (this.#lockFlag = 1);
    }

    return () => {};
  }

  /** 触发变更实际, 搭配changeLock使用 */
  #emitChange() {
    if (!this.#lockFlag) return;
    this.changeEvent.emit();
  }
}
