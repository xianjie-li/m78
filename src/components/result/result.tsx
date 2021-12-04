import React from 'react';

import { statusIcons } from 'm78/icon';
import { Fork } from 'm78/fork';
import { Portal } from 'm78/portal';
import { Transition, config } from 'm78/transition';

import cls from 'clsx';

import { ResultProps } from './type';

/* 用于标记哪些Icon.Svg需要添加特殊的status样式 */
const statusResultList = ['notFound', 'serverError', 'notAuth'];

const Result: React.FC<ResultProps> = ({
  type = 'success',
  title = '操作成功!',
  desc,
  children,
  actions,
  show = true,
  fixed = false,
  icon,
  className,
  style,
}) => {
  const StatusIcon = statusIcons[type];

  function render() {
    return (
      <Transition
        type={fixed ? 'zoom' : 'fade'}
        show={show}
        springProps={{
          config: config.stiff,
        }}
        mountOnEnter
        unmountOnExit
        className={cls('m78 m78-result', className, { __fixed: fixed })}
        style={style}
      >
        <div className="m78-result_cont">
          <div className={cls('m78-result_icon', { __waiting: type === 'waiting' })}>
            {icon || (
              <StatusIcon
                type={type}
                className={cls({
                  'm78-result_status-img': statusResultList.includes(type),
                })}
              />
            )}
          </div>
          <Fork.If when={title}>
            <div className="m78-result_title">{title}</div>
          </Fork.If>
          <Fork.If when={!!desc}>
            <div className="m78-result_desc">{desc}</div>
          </Fork.If>
          <Fork.If when={!!children}>
            <div className="m78-result_extra">{children}</div>
          </Fork.If>
          <Fork.If when={!!actions}>
            <div className="m78-result_btns">{actions}</div>
          </Fork.If>
        </div>
      </Transition>
    );
  }

  return fixed ? <Portal>{render()}</Portal> : render();
};

export default Result;
