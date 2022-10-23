import {
  AnyObject,
  createEvent,
  CustomEvent,
  isFunction,
  isString,
  isTruthyOrZero,
} from "@m78/utils";

type SelectManagerValue = string | number;

export interface SelectManagerOption<Item = SelectManagerValue> {
  /** 选项列表 */
  list: Item[];
  /**
   * 控制如何从list的每一项中获取到value, value具有以下限制:
   * - 作为是否选中的标识, 其必须唯一
   * - 必须是字符串或数值
   * */
  valueMapper?: string | ((i: Item) => SelectManagerValue);
}

export interface SelectManagerSelectedMeta<Item = SelectManagerValue> {
  /** 当前选中项的值, 包含strangeSelected */
  selected: SelectManagerValue[];
  /** 选中项的原始选项, 包含strangeSelected */
  originalSelected: Item[];
  /** 不存在于option.list的选中项 */
  strangeSelected: SelectManagerValue[];
  /** 选中且list中包含的选项, 相当于 selected - strangeSelected */
  realSelected: SelectManagerValue[];
}

/**
 * partialSelected / allSelected 仅检测list中存在的权限
 * selectAll / toggleAll 仅选中list中存在的选项
 * */

/**
 * 用于列表的选中项管理, 内置了对于超大数据量的优化
 *
 * - 怪异选中, 如果选中了list中不存在的选项, 称为怪异选中, 可以通过 selected.strangeSelected 访问这些选项, 存在此行为时, 以下api行为需要注意:
 * partialSelected / allSelected 仅检测list中存在的权限
 * selectAll / toggleAll 仅选中list中存在的选项
 * */
export class SelectManager<Item = SelectManagerValue> {
  /** 将list映射为字典, 减少循环的频率, 若i为非0 falsy值, 则存储为null, 取值时取v(减少存储占用的内存) */
  #listMap: {
    [key: SelectManagerValue]: { v: SelectManagerValue; i: Item | null };
  } = {};

  /** 已选值, 如果存在key则为已选, val存放选中的值(相对于key可以保留实际类型) */
  #selectedMap: AnyObject = {};

  /** 选中值变更时触发的事件 */
  changeEvent: CustomEvent<VoidFunction>;

  constructor(public readonly option: SelectManagerOption<Item>) {
    this.changeEvent = createEvent();

    this.#syncListMap();
  }

  /** 从list项中获取值(根据valueMapper) */
  getValueByItem(i: Item) {
    const { valueMapper } = this.option;

    let v: SelectManagerValue;

    if (isString(valueMapper)) {
      v = (i as any)[valueMapper];
    } else if (isFunction(valueMapper)) {
      v = valueMapper(i);
    } else {
      v = i as SelectManagerValue;
    }

    return v;
  }

  /** 值是否在list中存在 */
  isWithinList(val: SelectManagerValue) {
    return !!this.#listMap[val];
  }

  /** 检测值是否被选中 */
  isSelected(val: SelectManagerValue) {
    return String(val) in this.#selectedMap;
  }

  /** 当前选中项的信息 */
  get state(): SelectManagerSelectedMeta<Item> {
    const originalSelected: Item[] = [];
    const realSelected: SelectManagerValue[] = [];
    const strangeSelected: SelectManagerValue[] = [];

    for (const key in this.#selectedMap) {
      const i = this.#listMap[key];

      if (i) {
        originalSelected.push((i.i === null ? i.v : i.i) as Item);
        realSelected.push(i.v);
      } else {
        const v = this.#selectedMap[key];
        originalSelected.push(v);
        strangeSelected.push(v);
      }
    }

    const selected = originalSelected.map((i) => this.getValueByItem(i));

    return {
      originalSelected,
      selected,
      realSelected,
      strangeSelected,
    };
  }

  /** list中部分值被选中, 不计入strangeSelected */
  get partialSelected(): boolean {
    for (const key in this.#selectedMap) {
      if (this.isWithinList(key)) return true;
    }
    return false;
  }

  /** 当前list中的选项是否全部选中, 不计入strangeSelected */
  get allSelected(): boolean {
    const meta = this.state;

    const realLength = meta.selected.length - meta.strangeSelected.length;

    return realLength === this.option.list.length;
  }

  /** 重新设置option.list */
  setList(list: Item[]) {
    this.option.list = list;
    this.#syncListMap();
    this.#emitChange();
  }

  /** 选中传入的值 */
  select(val: SelectManagerValue) {
    this.#selectedMap[val] = val;
    this.#emitChange();
  }

  /** 取消选中传入的值 */
  unSelected(val: SelectManagerValue) {
    delete this.#selectedMap[val];
    this.#emitChange();
  }

  /** 选择全部值 */
  selectAll() {
    for (const key in this.#listMap) {
      this.#selectedMap[key] = this.#listMap[key].v;
    }
    this.#emitChange();
  }

  /** 取消选中所有值 */
  unSelectAll() {
    this.#selectedMap = {};
    this.#emitChange();
  }

  /** 反选值 */
  toggle(val: SelectManagerValue) {
    const unlock = this.#lock();
    if (this.isSelected(val)) {
      this.unSelected(val);
    } else {
      this.select(val);
    }
    unlock();
    this.#emitChange();
  }

  /** 反选所有值 */
  toggleAll() {
    const unlock = this.#lock();
    for (const key in this.#listMap) {
      this.toggle(key);
    }
    unlock();
    this.#emitChange();
  }

  /** 一次性设置所有选中的值 */
  setAllSelected(next: SelectManagerValue[]) {
    this.#selectedMap = {};
    next.forEach((val) => (this.#selectedMap[val] = val));
    this.#emitChange();
  }

  /** 设置指定值的选中状态 */
  setSelected(val: SelectManagerValue, isSelect: boolean) {
    const unlock = this.#lock();
    if (isSelect) {
      this.select(val);
    } else {
      this.unSelected(val);
    }
    unlock();
    this.#emitChange();
  }

  /** 一次选中多个选项 */
  selectList(selectList: SelectManagerValue[]) {
    selectList.forEach((val) => (this.#selectedMap[val] = val));
    this.#emitChange();
  }

  /** 以列表的形式移除选中项 */
  unSelectList(selectList: SelectManagerValue[]) {
    selectList.forEach((key) => delete this.#selectedMap[key]);
    this.#emitChange();
  }

  /** 根据当前的option.list同步listMap */
  #syncListMap() {
    this.#listMap = {};

    this.option.list.forEach((i: Item) => {
      const v = this.getValueByItem(i);

      const type = typeof v;

      if (v === undefined || (type !== "string" && type !== "number")) return;

      this.#listMap[v] = {
        v,
        i: isTruthyOrZero(i) ? i : null,
      };
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
