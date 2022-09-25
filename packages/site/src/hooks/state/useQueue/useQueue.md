---
title: useQueue
group:
  path: /state
  order: 3
---

# useQueue

手动或自动管理一组有序执行的队列状态

<!-- TODO：添加一些用例连接 -->

## 示例

<code src="./useQueue.demo.tsx" />

## API

**useQueue()**

```ts
function useQueue<Item extends AnyObject = {}>(
  conf: UseQueueConfig
): {
  /**
   * 推入一个或一组新项，如果当前没有选中项且非手动模式，自动执行next()
   * @param opt - 要添加的新项，可以是一个单独的项配置或配置数组
   * */
  push(item: Item | Item[]);
  /** 切换到上一项 */
  prev();
  /** 切换到下一项 */
  next();
  /** 完全移除指定id或一组id的项, 如果你要关闭当前消息，应当使用next而不是remove，因为此方法会破坏队列的完整性 */
  remove(id: id | id[]);
  /** 跳转到指定id项，该项左侧所有项会被移到历史列表，右侧所有项会移到待执行列表 */
  jump(id);
  /** 指定id是否包含下一项, 不传id查当前项 */
  hasNext(id);
  /** 指定id是否包含上一项, 不传id查当前项 */
  hasPrev(id);
  /** 清空队列 */
  clear;
  /** 查询指定id在列表中的索引 */
  findIndexById(id);
  /** 是否处于手动模式 */
  isManual: boolean;
  /** 当前项 */
  current: Item;
  /**  从自动模式切换为启用手动模式，暂停所有计时器
  manual(),
  /** 从手动模式切换为自动模式, 如果包含暂停的计时器，会从暂停位置重新开始 */
  auto();
  /** 当前所有项*/
  list: Item[];
  /** 已使用过的项 */
  leftList: Item[];
  /** 未使用过的项 */
  rightList: Item[];
  /** 当前项所在索引 */
  index;
};
```

**配置**

```ts
interface UseQueueConfig<ItemOption> {
  /** 初始列表 */
  list?: (ItemOption & UseQueueItem)[];
  /** 默认项配置 */
  defaultItemOption?: Partial<ItemOption & UseQueueItem>;
  /** 是否默认为手动模式 */
  defaultManual?: boolean;
  /** 每次current变更时触发 */
  onChange?: (current?: ItemOption & UseQueueItem) => void;
}
```

**基础选项**

```ts
interface UseQueueItem {
  /** 自动模式时，如果传入此项，会在此延迟(ms)后自动切换到下一项 */
  duration?: number;
  /** 唯一id，如果未传入会由内部自动生成一个随机id */
  id?: IDType;
}
```
