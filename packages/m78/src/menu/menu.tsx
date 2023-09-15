import React, { useEffect, useImperativeHandle, useRef } from "react";
import {
  DEFAULT_CHILDREN_KEY,
  DEFAULT_LABEL_KEY,
  DEFAULT_VALUE_KEY,
  getChildrenByDataSource,
  getLabelByDataSource,
  getValueByDataSource,
  Size,
  ValueType,
  Z_INDEX_MESSAGE,
} from "../common/index.js";
import {
  Overlay,
  OverlayDirection,
  OverlayInstance,
} from "../overlay/index.js";
import {
  DomTarget,
  useClickAway,
  useFn,
  useFormState,
  useSelect,
  useSelf,
  useSetState,
} from "@m78/hooks";
import { _MenuContext, MenuOption, MenuProps } from "./types.js";
import { Lay } from "../lay/index.js";
import {
  isArray,
  isFunction,
  isMobileDevice,
  isTruthyOrZero,
  omit,
} from "@m78/utils";
import { _getOptionAllValues } from "./common.js";
import { useKeyboardHandle } from "./use-keyboard-handle.js";
import clsx from "clsx";
import { Trigger, TriggerEvent, TriggerType } from "../trigger/index.js";
import { TransitionType } from "../transition/index.js";

const defaultProps: Partial<MenuProps> = {
  direction: OverlayDirection.bottomStart,
};

/** 共有props */
const commonProps = {
  autoFocus: false,
  lockScroll: false,
  zIndex: Z_INDEX_MESSAGE, // 保证能在modal等较高的层级中使用
  namespace: "MENU",
  childrenAsTarget: true,
  clickAwayClosable: false,
};

const MAIN_MENU = "__MAIN_MENU__";
const MAIN_TRIGGER = "__MAIN_TRIGGER__";

export const _Menu = (props: MenuProps) => {
  const self = useSelf<_MenuContext["self"]>({
    menuTargets: {},
    targets: [],
    lastActive: null as null,
    flatMap: {},
  });

  // 使用useSetState确保能实时获取到最新的type
  const [state, setState] = useSetState<_MenuContext["state"]>({
    xy: undefined,
    current: null,
    subMenuTriggerType: TriggerType.active,
  });

  /** 代理defaultOpen/open/onChange, 实现对应接口 */
  const [open, setOpen] = useFormState<boolean>(props, false, {
    defaultValueKey: "defaultOpen",
    triggerKey: "onChange",
    valueKey: "open",
  });

  const overlayRef = useRef<OverlayInstance | null>(null);

  useImperativeHandle<OverlayInstance | undefined, any>(
    props.instanceRef,
    () => overlayRef.current,
    [overlayRef.current]
  );

  /** 管理所有展开的项, 值为项的value */
  const openSelect = useSelect<ValueType>({
    autoUpdate: false,
    onChange: (select) => {
      const next = select.isSelected(MAIN_MENU);

      if (next !== open) {
        setOpen(next);
      }
    },
  });

  const hasSelected = openSelect.state.selected.length > 0;

  /** 关闭所有 */
  const close = useFn(() => {
    if (openSelect.state.selected.length === 0) return;
    self.lastActive = null;
    setState({
      current: null,
    });
    openSelect.unSelectAll();
  });

  // props.open主动传入true时, 对其同步
  useEffect(() => {
    if (props.open) {
      openSelect.select(MAIN_MENU);
    }
  }, [props.open]);

  /** 点击区域外关闭 */
  useClickAway({
    target: self.targets, // 这里需要保持targets引用不变, 因为targets变更频率会很高
    onTrigger: close,
  });

  /** 处理overlay open, sibling用于处理所有兄弟节点的关闭 */
  const openChangeHandle = useFn(
    (
      open: boolean,
      val: ValueType,
      sibling?: MenuOption[],
      skipSetActive = false
    ) => {
      const isMain = val === MAIN_MENU;

      if (open) {
        if (isArray(sibling)) {
          const values = _getOptionAllValues(sibling, props);
          openSelect.unSelectList(values);
        }

        if (!isMain && !skipSetActive) {
          self.lastActive = val;
        }

        openSelect.select(val);
      } else if (isMain) {
        // 主窗口关闭时关闭全部
        close();
      }
    }
  );

  /** 选中 */
  const onConfirm: NonNullable<MenuProps["onConfirm"]> = useFn(
    (val, option) => {
      props.onConfirm?.(val, option);
      close();
    }
  );

  /** 触发menuTargets变更, 并同步到targets */
  const targetsChange = useFn((key: string, target: DomTarget | null) => {
    self.menuTargets[key] = target;

    const next = Object.entries(self.menuTargets)
      .map(([_, target]) => target)
      .filter((i) => !!i) as DomTarget[];

    self.targets.splice(0, self.targets.length, ...next);
  });

  const onContextTrigger = useFn((e: TriggerEvent) => {
    props.onTrigger?.(e);
    if (e.type === TriggerType.contextMenu) {
      overlayRef.current?.updateXY([e.x, e.y], true);
    }
  });

  const ctx: _MenuContext = {
    openChangeHandle,
    props,
    hasSelected,
    openSelect,
    self,
    state,
    setState,
    close,
  };

  useKeyboardHandle(ctx);

  /** 如果是移动设备(不精确检测), 子菜单触发方式改为click */
  useEffect(() => {
    if (isMobileDevice()) {
      setState({
        subMenuTriggerType: TriggerType.click,
      });
    }
  }, []);

  /** 递归渲染选项列表 */
  function renderMenuList(list: MenuOption[]) {
    return list.map((item) => {
      if (isTruthyOrZero(item.customer)) {
        if (isFunction(item.customer)) {
          return item.customer(close);
        }

        return item.customer;
      }

      const other = omit(item, [
        props.labelKey || DEFAULT_LABEL_KEY,
        props.valueKey || DEFAULT_VALUE_KEY,
        props.childrenKey || DEFAULT_CHILDREN_KEY,
        "context",
      ]);

      const value = getValueByDataSource(item, props);
      const label = getLabelByDataSource(item, props);
      const children = getChildrenByDataSource(item, props);

      if (value === null) return null;

      const open = openSelect.isSelected(value);

      const currentValue = state.current
        ? getValueByDataSource(state.current, props)
        : null;
      const isCurrent = currentValue === value;

      if (children.length) {
        return (
          <Overlay
            key={value}
            {...commonProps}
            className="m78-menu_wrap"
            open={open}
            content={
              <div
                className="m78-menu"
                role="menu"
                ref={(dom) => targetsChange(String(value), dom)}
              >
                {renderMenuList(children)}
              </div>
            }
            direction={OverlayDirection.rightStart}
            triggerType={state.subMenuTriggerType}
            transitionType={TransitionType.none}
            offset={8}
            onChange={(open) => openChangeHandle(open, value, list)}
          >
            <Lay
              {...other}
              role="menuitem"
              title={label}
              arrow
              highlight={open || other.highlight}
              active={isCurrent}
              size={Size.small}
            />
          </Overlay>
        );
      }

      return (
        <Trigger
          key={value}
          type={TriggerType.active}
          onTrigger={(e) => openChangeHandle(e.active, value, list)}
        >
          <Lay
            {...other}
            role="menuitem"
            title={label}
            size={Size.small}
            active={isCurrent}
            onClick={() => onConfirm(value, item)}
          />
        </Trigger>
      );
    });
  }

  return (
    <Overlay
      {...props}
      {...commonProps}
      className={clsx("m78-menu_wrap", props.className)}
      autoFocus
      instanceRef={overlayRef}
      open={open}
      content={
        <div
          role="menu"
          className="m78-menu"
          ref={(dom) => targetsChange(MAIN_MENU, dom)}
        >
          {renderMenuList(props.options)}
        </div>
      }
      onChange={(open) => openChangeHandle(open, MAIN_MENU)}
      onTrigger={onContextTrigger}
      triggerNodeRef={(dom) => targetsChange(MAIN_TRIGGER, dom)}
    >
      {props.children}
    </Overlay>
  );
};

_Menu.displayName = "Menu";
_Menu.defaultProps = defaultProps;
