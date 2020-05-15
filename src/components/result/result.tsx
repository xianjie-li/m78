import React from 'react';

import { statusIcons } from '@lxjx/fr/lib/icon';
import Fork from '@lxjx/fr/lib/fork';
import Portal from '@lxjx/fr/lib/portal';
import { Transition, config } from '@lxjx/react-transition-spring';

import cls from 'classnames';

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
}) => {
  const StatusIcon = statusIcons[type];

  function render() {
    return (
      <Transition
        type={fixed ? 'zoom' : 'fade'}
        toggle={show}
        config={config.stiff}
        mountOnEnter
        unmountOnExit
        className={cls('fr-result', { __fixed: fixed })}
      >
        <div className="fr-result_cont">
          <div className={cls('fr-result_icon', { __waiting: type === 'waiting' })}>
            <StatusIcon
              type={type}
              className={cls({
                'fr-result_status-img': statusResultList.includes(type),
              })}
            />
          </div>
          <Fork.If when={title}>
            <div className="fr-result_title">{title}</div>
          </Fork.If>
          <Fork.If when={!!desc}>
            <div className="fr-result_desc">{desc}</div>
          </Fork.If>
          <Fork.If when={!!children}>
            <div className="fr-result_extra">{children}</div>
          </Fork.If>
          <Fork.If when={!!actions}>
            <div className="fr-result_btns">{actions}</div>
          </Fork.If>
        </div>
      </Transition>
    );
  }

  return fixed ? <Portal>{render()}</Portal> : render();
};

export default Result;
