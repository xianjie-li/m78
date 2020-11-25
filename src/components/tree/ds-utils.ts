// import _get from 'lodash/get';
// import { OptionsItem } from './types';

// export class DataSourceUtils {
//   constructor(public ds: OptionsItem[] = []) {}

//   //  获取最后一项所在列表， 以及最后一项索引
//   getTargetByIndexes(inds: number[], offset = 1): [OptionsItem[] | undefined, number | undefined] {
//     const last = inds[inds.length - 1];

//     //  长度为1时直接返回
//     if (inds.length === 1) {
//       return [this.ds, last];
//     }

//     const path = inds.reduce((p, i, ind) => {
//       if (ind >= inds.length - offset) return p;
//       return `${p}[${i}].children`;
//     }, '');

//     return [_get(this.ds, path), last];
//   }

//   /**
//    * 将选项移动到指定目标位置
//    */
//   move(inds: number[], targetInds: number[]) {}

//   /**
//    * 将一组选项插入到到目标位置
//    */
//   insert(inds: number[], ...source: OptionsItem[]) {}

//   /**
//    * 将一组选项新增到目标的`children`末尾， children不存在时会手动添加
//    */
//   push(inds: number[], ...source: OptionsItem[]) {}

//   /**
//    * 将一组选项新增到目标的`children`顶部
//    */
//   unshift(inds: number[], ...source: OptionsItem[]) {}

//   /**
//    * 移除一个或一组选项
//    */
//   remove(...inds: number[][]) {}

//   /**
//    * 更新dataSource引用并返回
//    */
//   update() {
//     return [...this.ds];
//   }
// }
