import React, { useMemo } from 'react';
import { useCheck, UseCheckConf } from '@lxjx/hooks';
import classNames from 'clsx';
import { ExpansionProps } from './types';
import { Provider } from './ctx';

/* 嵌套时，将控制交给最外层 */
const Expansion = (props: ExpansionProps) => {
  /* baseProps是共享给子级ExpansionPane的ExpansionBase，其他的是Expansion自有的prop */
  const {
    opens,
    defaultOpens,
    onChange,
    accordion = false,
    children,
    className,
    style,
    ...baseProps
  } = props;

  /** 处理useCheck配置， */
  const checkConf = useMemo<UseCheckConf<string, string>>(() => {
    const conf: UseCheckConf<string, string> = {
      onChange(ck: string[]) {
        onChange?.(ck); // 过滤参数2
      },
    };

    if ('opens' in props) {
      conf.value = opens;
    }

    if ('defaultOpens' in props) {
      conf.defaultValue = defaultOpens;
    }
    return conf;
  }, [props]);

  const checker = useCheck<string>(checkConf);

  const ctxProps = {
    // 默认配置
    transition: true,
    accordion,
    // 用户传入配置
    ...baseProps,
    // 展开状态控制
    checker,
  };

  return (
    <Provider value={ctxProps}>
      <div
        className={classNames('m78 m78-expansion', !props.noStyle && '__style', className)}
        style={style}
      >
        {children}
      </div>
    </Provider>
  );
};

export default Expansion;
