import React from 'react';
import Scroller from 'm78/scroller';
import { createRandString } from '@lxjx/utils';
import { useSetState } from '@lxjx/hooks';

import sty from './style.module.scss';

/** 总页数 */
const maxPage = 5;

/** 模拟请求方法，会随机模拟失败 */
function mockFetch(page: number) {
  return new Promise<string[]>((res, rej) => {
    setTimeout(() => {
      Math.random() > 0.7
        ? rej()
        : res(
            Array.from({ length: page === maxPage ? 5 : 12 }).map(
              () => `第${page}页 - ${createRandString()}`,
            ),
          );
    }, 1000);
  });
}

const Pull = () => {
  const [state, setState] = useSetState({
    // 当前页
    page: 1,
    // 数据列表
    list: [] as string[],
  });

  async function fetchList({ isRefresh = false }) {
    // isRefresh为true时不更新页码或其他任何查询状态
    const page = isRefresh ? state.page : state.page + 1;

    // 同步到state
    page !== state.page &&
      setState({
        page,
      });

    // 查询数据(实际业务中替换为接口)
    // 不需要进行try catch处理，抛出异常后组件会自动接管错误
    const list = await mockFetch(page);

    // 合并列表数据
    setState({
      list: [...state.list, ...list],
    });

    // 返回长度和是否为空
    return {
      length: list.length,
      isEmpty: list.length < 12,
    };
  }

  const progress = state.page / maxPage;

  return (
    <div>
      <Scroller
        /* 上拉配置 */
        // *可选* 空数据时可以提供更友好的反馈样式
        hasData={state.list.length > 0}
        // *可选* 手动控制进度条宽度, 在明确知道总页码时可以传入此项增强体验, 进度条已满时使用默认进度行为
        yProgress={progress === 1 ? undefined : progress}
        // 上拉加载处理函数(执行数据查询、合并、页码等参数增加等操作)
        onPullUp={fetchList}
        /* 下拉配置 */
        // 下拉刷新处理函数(重置查询状态, 重新触发加载)
        onPullDown={async triggerPullDown => {
          /* ⛔ 这里使用的useSetState状态是可以同步获取的，如果你使用useState, 请通过useEffect等钩子在状态更新后再执行后续请求 */
          setState({
            page: 1,
            list: [],
          });

          // 以isRefresh = true触发fetchList
          triggerPullDown(true);
        }}
        // 在配合上拉加载使用时，不需要进行提示
        pullDownTips={false}
        /* 其他 */
        hideScrollbar
        progressBar
        style={{ width: 300, height: 400, border: '1px solid #ccc' }}
      >
        {state.list.map(item => (
          <div key={item} className={sty.Item}>
            {item}
          </div>
        ))}
      </Scroller>
    </div>
  );
};

export default Pull;
