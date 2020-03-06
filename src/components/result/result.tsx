import React from 'react';

import { SvgIcon } from '@lxjx/flicker/lib/icon';
import Fork from '@lxjx/flicker/lib/fork';
import Portal from '@lxjx/flicker/lib/portal';
import { Transition, config } from '@lxjx/react-transition-spring';

import cls from 'classnames';

/* 用于标记哪些Icon.Svg需要添加特殊的status样式 */
const statusResultList = [
  'notFound',
  'serverError',
  'notAuth',
];

import { ResultProps } from './type';

const Result: React.FC<ResultProps> = ({
  type = 'success',
  title = '操作成功!',
  desc,
  children,
  actions,
  show = true,
  fixed = false,
}) => {
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
            <SvgIcon
              type={type}
              className={cls({
                'fr-result_status-img': statusResultList.includes(type),
              })}
            />
          </div>
          <Fork.If when={title}>
            <div className="fr-result_title">
              { title }
            </div>
          </Fork.If>
          <Fork.If when={!!desc}>
            <div className="fr-result_desc">
              { desc }
            </div>
          </Fork.If>
          <Fork.If when={!!children}>
            <div className="fr-result_extra">
              { children }
            </div>
          </Fork.If>
          <Fork.If when={!!actions}>
            <div className="fr-result_btns">
              { actions }
            </div>
          </Fork.If>

        </div>
      </Transition>
    );
  }

  return (
    fixed
      ? (
        <Portal>
          { render() }
        </Portal>
      )
      : render()
  );
};

export default Result;
