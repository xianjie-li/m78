import React from 'react';
import { Spin } from 'm78/spin';
import { isArray, isFunction } from '@lxjx/utils';
import { Button } from 'm78/button';

import { NoticeBar } from 'm78/notice-bar';
import { Empty } from 'm78/empty';
import classNames from 'clsx';
import { IfProps, ToggleProps, SwitchProps, ForkProps } from './type';

const ForkImpl: React.FC<ForkProps> = ({
  children,
  send,
  loading,
  error,
  timeout,
  hasData,
  forceRender,
  loadingFull,
  className,
  style,
  loadingText,
  emptyText = '暂无数据',
  errorText = '请求异常',
  timeoutText = '请求超时',
  customLoading,
  customNotice,
  customEmpty,
}) => {
  const renderChild = () => (isFunction(children) ? children() : children);

  // 重试按钮
  const reloadBtn = send ? (
    <Button onClick={send} color="primary" text size="small" style={{ top: -1 /* 视觉居中 */ }}>
      重新加载
    </Button>
  ) : null;

  const feedbackNode = renderForks();

  function renderForks() {
    if (loading) {
      return customLoading || <Spin text={loadingText} className="ptb-12" full={loadingFull} />;
    }

    if (error || timeout) {
      const title = timeout ? timeoutText : errorText;
      const msg = error?.message || (typeof error === 'string' ? error : '');

      return customNotice ? (
        customNotice(title, msg)
      ) : (
        <NoticeBar
          className="m78-fork_notice"
          status="error"
          message={title}
          desc={
            <div>
              {msg && <div className="color-error mb-8">{msg}</div>}
              <span>请稍后重试{send ? '或' : null} </span>
              {reloadBtn}
            </div>
          }
        />
      );
    }

    if (!hasData && !loading) {
      return (
        customEmpty || (
          <Empty desc={emptyText} style={{ padding: 0 }}>
            {reloadBtn}
          </Empty>
        )
      );
    }
  }

  function renderFeedback() {
    return (
      <div className={classNames('m78-fork', className)} style={style}>
        {feedbackNode}
      </div>
    );
  }

  return (
    <>
      {(!feedbackNode || forceRender) && renderChild()}
      {feedbackNode && renderFeedback()}
    </>
  );
};

/* 根据条件渲染或卸载内部的组件 */
const If: React.FC<IfProps> = ({ when, children }) => {
  when = !!when;
  const isFuncChild = isFunction(children);
  return when && (isFuncChild ? (children as any)() : children);
};

/**
 * 显示或隐藏内容
 *
 * 组件内部通过display: 'none'隐藏元素，其支持以下类型的子元素:
 * - 单个ReactElement，并且props支持接收style控制样式，这是最佳的使用方式，不会改变dom树
 * - 字符串，会生成一个div包裹在其外层来控制显示隐藏
 * - 一组元素, 遍历为所有的ReactElement添加隐藏的style，非ReactElement节点会原样返回
 *  */
const Toggle = ({ when, children }: ToggleProps): React.ReactElement => {
  function hideChild() {
    const hideProps = { display: 'none' };

    // 克隆并返回一个reactElement的隐藏版本(需要其支持style参数)
    const hideReactElement = (rEl: React.ReactElement, key?: any) =>
      React.cloneElement(rEl, {
        key,
        style: { ...rEl.props.style, ...hideProps },
      });

    if (typeof children === 'string') {
      return <div style={hideProps}>{children}</div>;
    }

    if (isArray(children)) {
      return children.map((item, ind) => {
        // 正常的reactElement
        if (React.isValidElement(item)) return hideReactElement(item, ind);
        // 其他的原样返回
        return item;
      });
    }

    if (React.isValidElement(children)) {
      return hideReactElement(children);
    }

    // 不满足条件时通过阻止渲染作为回退
    return null;
  }

  return when ? children : (hideChild() as any);
};

type Filter = {
  showEl: React.ReactElement | null;
  notWhen: React.ReactElement | null;
};

/* 搭配If或Toggle使用，类似react-router的Switch，只渲染内部的第一个prop.when为true的If，当没有任何一个If的when为true时，匹配第一个不包含when的If */
const Switch: React.FC<SwitchProps> = ({ children }) => {
  const arrChild: React.ReactElement[] = React.Children.toArray(children) as React.ReactElement[];
  /* 过滤出第一个when匹配的If和没有prop.when的If */
  const filter: Filter = arrChild.reduce(
    (prev: any, child: React.ReactElement) => {
      if (!(child.type === If || child.type === Toggle)) {
        return prev;
      }

      const hasWhen = 'when' in child.props;
      const show = !!child.props.when;

      if (!hasWhen && !prev.notWhen) {
        prev.notWhen = React.cloneElement(child, { when: true });
      }

      if (show && !prev.showEl) {
        prev.showEl = child;
      }

      return prev;
    },
    { showEl: null, notWhen: null },
  );

  /* 筛选规则: 第一个匹配到when的子If，没有任何when匹配取第一个notWhen, 都没有则返回null */
  return filter.showEl || filter.notWhen || null;
};

export { If, Switch, Toggle };
export default ForkImpl;
