import React, { useMemo } from 'react';
import { useFormState, useMountExist, useMeasure, useSelf } from '@lxjx/hooks';
import { isFunction } from '@lxjx/utils';
import cls from 'clsx';
import { Button } from 'm78/button';
import { CaretRightOutlined, CaretUpOutlined, CaretDownOutlined } from 'm78/icon';
import { If } from 'm78/fork';
import { stopPropagation } from 'm78/util';
import { useSpring, animated, config } from 'react-spring';
import { ExpansionPaneProps, ExpandIconPosition } from './types';
import { useCtx } from './ctx';

const ExpansionPane = (props: ExpansionPaneProps) => {
  const { checker, accordion, ...ctxBaseProps } = useCtx();

  /** 如果包含Expansion父级，则转交控制权 */
  const mixProps = useMemo(() => {
    const name = props.name;

    // 包含checker且组件传入了name，交由父级Expansion控制
    if (checker && name) {
      return {
        ...ctxBaseProps,
        ...props,
        open: checker.isChecked(name),
        onChange(open: boolean) {
          props.onChange?.(open);
          if (accordion) {
            checker.setChecked(open ? [name] : []);
          } else {
            checker.setCheckBy(name, open);
          }
        },
      };
    }

    return props;
  }, [ctxBaseProps, props]);

  const {
    expandIconPosition: iconPos = ExpandIconPosition.left,
    headerNode,
    disabled,
    expandIcon,
    noStyle,
    transition = true,
    mountOnEnter,
    unmountOnExit,
    className,
    style,
  } = mixProps;

  const [open, set] = useFormState(mixProps, false, {
    valueKey: 'open',
    defaultValueKey: 'defaultOpen',
  });

  const self = useSelf({
    firstOpen: open,
  });

  // 测量高度
  const [contRef, { height }] = useMeasure<HTMLDivElement>();

  // 实现mountOnEnter/unmountOnExit
  const [mound] = useMountExist({
    toggle: open,
    mountOnEnter,
    unmountOnExit,
    exitDelay: 800,
  });

  const spProps = useSpring({
    height: open ? height : 0,
    config: { ...config.stiff, clamp: true },
    immediate: !transition || self.firstOpen,
    onRest() {
      self.firstOpen = false;
    },
  });

  /** 切换开关状态 */
  function toggle() {
    if (disabled) return;
    set(prev => !prev);
  }

  /** 渲染展开标识图标 */
  function renderPropsIcon(clsName: string) {
    if (isFunction(expandIcon)) {
      return expandIcon(open, clsName);
    }
    return expandIcon;
  }

  function renderHeader() {
    if (headerNode === null) return null;

    if (React.isValidElement(headerNode)) {
      // 挂载事件
      return React.cloneElement(headerNode, { onClick: toggle });
    }

    const iconClassName = cls('m78-expansion_header-leading', {
      __right: iconPos === ExpandIconPosition.right,
      __open: open,
    });

    return (
      <div className="m78-expansion_header" onClick={toggle}>
        <If when={iconPos === ExpandIconPosition.left || iconPos === ExpandIconPosition.right}>
          {renderPropsIcon(iconClassName) || (
            <div className={iconClassName}>
              <CaretRightOutlined />
            </div>
          )}
        </If>
        <div className="m78-expansion_header-body">{props.header}</div>
        {props.actions && (
          <div className="m78-expansion_header-action" {...stopPropagation}>
            {props.actions}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={cls('m78-expansion_item', className, {
        __active: open,
        __disabled: disabled,
        __style: !noStyle,
      })}
      style={style}
    >
      {iconPos === ExpandIconPosition.bottom &&
        (renderPropsIcon('m78-expansion_bottom-flag') || (
          <div
            title={open ? '收起' : '展开'}
            className="m78-expansion_bottom-flag"
            onClick={toggle}
          >
            <Button text>{open ? <CaretUpOutlined /> : <CaretDownOutlined />}</Button>
          </div>
        ))}

      {renderHeader()}

      <animated.div className="m78-expansion_content-wrap" style={spProps}>
        <div className="m78-expansion_content">
          <div className="m78-expansion_calc-node" ref={contRef} />
          {mound && props.children}
        </div>
      </animated.div>
    </div>
  );
};

export default ExpansionPane;
