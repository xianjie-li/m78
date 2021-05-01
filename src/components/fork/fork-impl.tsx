import React from 'react';
import { Spin } from 'm78/spin';
import { isFunction } from '@lxjx/utils';
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
 * 显示或隐藏内容(!必须确保子只有一个子元素并且包含包裹元素（即不能为纯文本），用于挂载display: 'none')
 *  */
const Toggle: React.FC<ToggleProps> = ({ when, children }) => {
  function hideChild() {
    return React.cloneElement(children, { style: { display: 'none' } });
  }
  return when ? children : hideChild();
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
