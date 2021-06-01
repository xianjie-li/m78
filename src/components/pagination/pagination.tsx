import React, { useMemo, useState } from 'react';
import { Button } from 'm78/button';
import {
  EllipsisOutlined,
  LeftOutlined,
  RightOutlined,
  DoubleLeftOutlined,
  DoubleRightOutlined,
} from 'm78/icon';
import { Divider } from 'm78/layout';
import { Input } from 'm78/input';
import cls from 'clsx';
import { useFormState } from '@lxjx/hooks';
import { If } from 'm78/fork';
import _clamp from 'lodash/clamp';
import { dumpFn, isNumber } from '@lxjx/utils';
import { useNoSSR } from 'm78/no-ssr';

interface PaginationProps {
  /** 当前页码 */
  page?: number;
  /** 1 | 默认页码(非受控模式时使用) */
  defaultPage?: number;
  /** 页码改变时触发 */
  onChange?: (page: number) => void;
  /** 0 | 总数 */
  total?: number;
  /** 10 | 每页条数 */
  pageSize?: number;

  /** 朴素模式 */
  plain?: boolean;
  /** 简洁模式，只保留基础的上下页和跳页功能 */
  simple?: boolean;
  /** 组件可选大小 */
  size?: 'small';
  /** 开启跳页器 */
  jumper?: boolean;
  /** 开启页码改变器 TODO: 和DropDown一起开放 */
  // sizeChanger?: boolean;
  /** 开启总条数统计 */
  count?: boolean;
  /** 禁用 */
  disabled?: boolean;

  /** 替换下一页图标或文本 */
  nextText?: React.ReactNode;
  /** 替换上一页图标或文本 */
  prevText?: React.ReactNode;
  /**
   * 生成a链接, 用于SEO优化, 只在SSR阶段生效，SSR渲染结束后后变更会变回按钮式分页
   * 如传入: '/news/{page}', 则会为每一项生成对应路径的a链接,
   * 可用变量有 {page}/{pageSize} */
  linkPattern?: string;
}

const Pagination = (props: PaginationProps) => {
  const {
    total = 0,
    pageSize = 10,
    plain,
    simple,
    disabled,
    size,
    jumper,
    count,
    prevText,
    nextText,
    linkPattern,
  } = props;

  dumpFn(props.page, props.defaultPage, props.onChange);

  /** 总页数 */
  const totalPage = Math.ceil(total / pageSize);

  const [page, setPage] = useFormState<number>(props, 1, {
    valueKey: 'page',
    defaultValueKey: 'defaultPage',
  });

  const noSSR = useNoSSR();

  /** 页码数组 */
  const pageItems = useMemo(getMainItems, [page]);

  const [jumpPage, setJumpPage] = useState('');

  /**
   * 获取当前页的前两页和后两页，如果某个方向不足，向后方补齐
   * */
  function getMainItems() {
    const [prevO, pDif] = getOverItemLength([page - 2, page - 1]);
    const [nextO, nDif] = getOverItemLength([page + 1, page + 2]);

    const prev = fillDiff(prevO, nDif, true);
    const next = fillDiff(nextO, pDif);

    return getOverItemLength([...prev, page, ...next])[0];
  }

  /** 从一个数字数组中剔除所有超出页码(闭合区间)的数字，并返回被剔除的数量 */
  function getOverItemLength(arr: number[]) {
    const res = arr.filter(p => {
      return p > 1 && p < totalPage;
    });

    return [res, arr.length - res.length] as const;
  }

  /**
   * 接收数字数组，并根据isPrev和diffNumber往他的前或后添加diffNumber数量的递增/递减数字
   * @param arr - 原数组
   * @param diffNumber - 要添加的长度
   * @param isPrev - 如果为true，则往前添加
   * @return - 处理后的新数组，经过getOverItemLength处理
   * */
  function fillDiff(arr: number[], diffNumber: number, isPrev?: boolean) {
    if (diffNumber === 0 || arr.length === 0 /* 这里需要特殊处理 */) return arr;

    const nextItem = isPrev ? arr[0] : arr[arr.length - 1];

    const fillArr = [...arr];

    Array.from({ length: diffNumber }).forEach((_, ind) => {
      if (isPrev) {
        fillArr.unshift(nextItem - (ind + 1));
      } else {
        fillArr.push(nextItem + 1 + ind);
      }
    });

    return getOverItemLength(fillArr)[0];
  }

  /** 跳转至指定页码，如果超出限定页码，会限制为最小/大值 */
  function go(p: number) {
    if (disabled) return;
    const clampPage = _clamp(p, 1, totalPage);
    setPage(clampPage);
  }

  /** 根据传入页码生成a链接, 用于linkPattern */
  function injectVar2Link(p: number) {
    if (!linkPattern) return;
    const map: any = { page: p, pageSize };

    return linkPattern.replace(/{([a-zA-Z]+)}/g, (mtc, key) => {
      return map[key] || mtc;
    });
  }

  function renderItem(item: number) {
    const isCurrent = item === page;

    return (
      <Button
        key={item}
        className={cls('m78-pagination_item', {
          __active: isCurrent,
        })}
        color={isCurrent ? 'primary' : undefined}
        text={plain}
        onClick={() => go(item)}
        disabled={disabled}
        title={`第${item}页`}
      >
        {renderLinkOrPageString(item, `第${item}页`)}
      </Button>
    );
  }

  function renderPrev() {
    return (
      <Button
        className="m78-pagination_item __prev"
        disabled={page === 1 || disabled}
        text={plain}
        title="上一页"
        onClick={() => go(page - 1)}
      >
        {prevText || <LeftOutlined />}
      </Button>
    );
  }

  function renderNext() {
    return (
      <Button
        className="m78-pagination_item __next"
        disabled={page === totalPage || disabled}
        text={plain}
        title="下一页"
        onClick={() => go(page + 1)}
      >
        {nextText || <RightOutlined />}
      </Button>
    );
  }

  function renderJumper(prefix?: string, affix?: string) {
    return (
      <div className="m78-pagination_jumper">
        {prefix}
        <Input
          size={size}
          type="integer"
          allowClear={false}
          disabled={disabled}
          value={jumpPage}
          placeholder={simple ? `${page}` : undefined}
          onChange={val => setJumpPage(val)}
          onSearch={val => {
            setJumpPage('');
            const nPage = Number(val);
            if (isNumber(nPage)) go(nPage);
          }}
        />
        {affix}
      </div>
    );
  }

  function renderLinkOrPageString(p: number, title?: string) {
    return linkPattern && !noSSR ? (
      <a className="m78-pagination_link" href={injectVar2Link(p)} title={title}>
        {p}
      </a>
    ) : (
      p
    );
  }

  if (simple) {
    return (
      <div className="m78-pagination __simple">
        {renderPrev()}
        {renderJumper()} / <span className="m78-pagination_simple-total">{totalPage}</span>
        {renderNext()}
      </div>
    );
  }

  return (
    <div
      className={cls('m78-pagination', {
        __plain: plain,
        __small: size === 'small',
      })}
    >
      <div className="m78-pagination_main">
        {renderPrev()}
        {renderItem(1)}
        <If when={page >= 5}>
          <Button
            className="m78-pagination_item __ellipsis __ellipsisPrev"
            text
            title="前翻5页"
            disabled={disabled}
            onClick={() => go(page - 5)}
          >
            <EllipsisOutlined />
            <DoubleLeftOutlined />
          </Button>
        </If>

        {pageItems.map(renderItem)}

        <If when={page <= totalPage - 4}>
          <Button
            className="m78-pagination_item __ellipsis __ellipsisNext"
            text
            title="后翻5页"
            onClick={() => go(page + 5)}
            disabled={disabled}
          >
            <EllipsisOutlined />
            <DoubleRightOutlined />
          </Button>
        </If>

        {totalPage > 0 && renderItem(totalPage)}
        {renderNext()}
      </div>

      {jumper && (
        <>
          <Divider vertical />
          {renderJumper('跳至', '页')}
        </>
      )}

      {count && (
        <>
          <Divider vertical />
          <div className="m78-pagination_count">
            共 <span className="color">{total}</span> 条数据
          </div>
        </>
      )}
    </div>
  );
};

export default Pagination;
