---
title: useCheck
group:
  title: UI
  path: /ui
  order: 1
---

# useCheck

一个高性能的选中状态管理 hook，支持像表单控件一样受控、非受控使用

✨ 支持绝大多数选择用例  
✨ 通过 onChange/value 等表单式接口，可以无缝接入 Checkbox/Radio/Select 等组件  
✨ 轻松处理十万级别的选项数据(i5-4210M 的古董机上处理 30 万个选项无明显延迟)

## 示例

<code src="./useCheck.demo.tsx" />
 
## API

`const bonus = useCheck<T, OPTION = T>(conf)`;

**T** - 选项值的类型

**OPTION** - 如果`conf.options`子项为对象，此项传该对象的类型

**conf**

```ts
interface UseCheckConf<T, OPTION>
  extends FormLikeWithExtra<T[], OPTION[]>,
    UseFormStateConfig {
  /** 选项数组 */
  options?: OPTION[];
  /** 所有禁用值 */
  disables?: T[];
  /** 当option子项为对象类型时，传入此项来决定从该对象中取何值作为实际的选项值  */
  collector?: (item: OPTION) => T;
  /** 如果当前value包含在options中不存在的值，会触发此函数，用于从服务器或其他地方拉取不存在的选项 */
  notExistValueTrigger?(val: T[]): void;
}

interface FormLikeWithExtra<T, Ext = any> {
  value?: T;
  onChange?: (value: T, extra: Ext) => void;
  defaultValue?: T;
}
```

**bonus**

```ts
/** checked可以允许存在options中不存在的值， 所有选中, 局部选中都只针对传入选项中存在的值来确定 */
interface UseCheckReturns<T, OPTION> {
  /** 部分值被选中(只针对存在于options中的选项) */
  partialChecked: boolean;
  /** 是否全部选中(只针对存在于options中的选项) */
  allChecked: boolean;
  /** 没有任何值被选中 */
  noneChecked: boolean;
  /** 被选中值, 存在collector时所有check项都会先走collector */
  checked: T[];
  /** 被选中的原始值，不走collector，未传collector时与check表现一致 */
  originalChecked: OPTION[];
  /** 检测值是否被选中 */
  isChecked: (val: T) => boolean;
  /** 检测值是否被禁用 */
  isDisabled: (val: T) => boolean;
  /** 选中传入的值 */
  check: (val: T) => void;
  /** 取消选中传入的值 */
  unCheck: (val: T) => void;
  /** 选择全部值 */
  checkAll: () => void;
  /** 取消选中所有值 */
  unCheckAll: () => void;
  /** 反选, 返回反选后的值 */
  toggle: (val: T) => boolean | undefined;
  /** 反选所有值 */
  toggleAll: () => void;
  /** 一次性设置所有选中的值, 不影响禁用项 */
  setChecked: (nextChecked: T[]) => void;
  /** 指定值并设置其选中状态 */
  setCheckBy: (val: T, isChecked: boolean) => void;
  /** 以列表的形式添加选中项 */
  checkList: (checkList: T[]) => void;
  /** 以列表的形式移除选中项 */
  unCheckList: (checkList: T[]) => void;
}
```
