import React, { useEffect, useMemo, useState } from 'react';
import Button from '@lxjx/fr/lib/button';
import Input from '@lxjx/fr/lib/input';
import ShowFromMouse from '@lxjx/fr/lib/show-from-mouse';
import Popper from '@lxjx/fr/lib/popper';
import { Z_INDEX_MESSAGE } from '@lxjx/fr/lib/util';
import { useFormState, useSelf, useSetState } from '@lxjx/hooks';
import moment, { Moment } from 'moment';
import cls from 'classnames';

import { defaultFormat, parseValue, placeholderMaps, pickerTypeWrap } from './utils';
import {
  renderPresetDates,
  staticRenderCheckedValue,
  staticRenderDate,
  staticRenderMonth,
  staticRenderTabs,
  staticRenderTime,
  staticRenderYear,
} from './renders';
import { DatesProps, DatesRangeProps, DateType, ShareMetas } from './type';
import { useDateUIController, useHandlers } from './hooks';

function Dates(props: DatesProps): JSX.Element;
function Dates(props: DatesRangeProps): JSX.Element;
function Dates(props: DatesProps | DatesRangeProps) {
  const tProps = props as DatesProps & DatesRangeProps;
  const {
    type = DateType.DATE,
    hasTime = false,
    range,
    className,
    style,
    disabledPreset,
    format = defaultFormat,
    size,
    disabled,
  } = tProps;

  /**  当前时间 */
  const [nowM] = useState(() => moment());

  const [value, setValue] = useFormState<string[] | string, Moment>(props, range ? [] : '');

  const [state, setState] = useSetState<ShareMetas['state']>({
    /** 实际存储的时间, 控制当前日期显示的位置 */
    currentM: nowM,
    /** 当前参与交互的临时时间，实现预览功能 */
    tempM: undefined,
    /** 控制当前展示的选择器类型 */
    type,
    /** 是否显示 */
    show: false,
    /** 是否为移动设备（不严格匹配, 屏幕小于指定物理像素即视为移动设备） */
    mobile: false,
  });

  const self = useSelf<ShareMetas['self']>({
    /** 指向当前value的moment, 这里才是实际存储value的地方, value相当于此值的时间字符映射 */
    cValueMoment: undefined,
    /** 当是范围选择时，存储结束时间 */
    endValueMoment: undefined,
  });

  const share: ShareMetas = {
    nowM,
    state,
    setState,
    value,
    setValue,
    self,
    hasTime,
    getCurrentTime,
    type,
    props: props as DatesProps & DatesRangeProps,
  };

  /** 将value解析到cValueMoment/endValueMoment(useMemo执行时机比effect更快) */
  useMemo(() => parseValue(share), [value]);

  /** 控制picker的显示类型, 并在窗口大小变更时更新 */
  useEffect(pickerTypeWrap(state, setState), []);

  /** 外部化一些控制函数 */
  const controllers = useDateUIController(share);

  /** 外部化一处理函数 */
  const handlers = useHandlers(share, controllers);

  /** 根据当前选中事件获取时分秒，未选中时间则取当前时间, 传入getEndTime时获取结束时间 */
  function getCurrentTime(isEnd?: boolean) {
    const cM = isEnd ? self.endValueMoment : self.cValueMoment;

    if (!cM) return undefined;

    return {
      h: cM.hour(),
      m: cM.minute(),
      s: cM.second(),
    };
  }

  const renderCheckedValue = () => staticRenderCheckedValue(share, controllers);

  const renderDate = () => staticRenderDate(share, controllers, handlers);

  const renderMonth = () => staticRenderMonth(share, controllers, handlers);

  const renderYear = () => staticRenderYear(share, controllers, handlers);

  const renderTime = () => staticRenderTime(share, handlers);

  const renderTabs = () => staticRenderTabs(share, controllers);

  function render() {
    if (state.type === DateType.DATE && type === DateType.DATE) return renderDate();

    if (state.type === DateType.MONTH) return renderMonth();

    if (state.type === DateType.YEAR) return renderYear();

    if (state.type === DateType.TIME) return renderTime();

    return null;
  }

  function renderMain(fullWidth = false) {
    return (
      <div
        className={cls('fr-dates', className, {
          __time: type === DateType.TIME || state.type === DateType.TIME,
        })}
        style={{ width: fullWidth ? '100%' : undefined, ...style }}
      >
        <div className="fr-dates_head">
          <span className="bold">{renderCheckedValue()}</span>
          {renderTabs()}
        </div>
        <div className="fr-dates_body">{render()}</div>
        <div className="fr-dates_foot">
          <span className="fr-dates_btns">{!disabledPreset && renderPresetDates(share)}</span>
          <span>
            <Button size="small" link onClick={handlers.reset}>
              清空
            </Button>
            <Button size="small" color="primary" onClick={() => setState({ show: false })}>
              完成
            </Button>
          </span>
        </div>
      </div>
    );
  }

  function renderInput() {
    return (
      <Input
        className="fr-dates_inp"
        value={format({
          current: self.cValueMoment,
          end: self.endValueMoment,
          isRange: !!range,
          type,
          hasTime,
        })}
        allowClear={false}
        placeholder={tProps.placeholder || `请选择${placeholderMaps[type]}${range ? '范围' : ''}`}
        onFocus={state.mobile ? undefined : handlers.onShow}
        onClick={handlers.onShow}
        onKeyDown={handlers.onKeyDown}
        readOnly={state.mobile}
        size={size}
        disabled={disabled}
      />
    );
  }

  function renderTooltip() {
    return (
      <Popper
        className="fr-dates_popper"
        offset={4}
        content={renderMain()}
        direction="bottomStart"
        trigger="click"
        show={state.show}
        type="popper"
        disabled={disabled}
        onChange={_show => {
          setState({
            show: _show,
          });
        }}
      >
        {renderInput()}
      </Popper>
    );
  }

  /** 在小屏设备上使用model开启 */
  function renderModel() {
    return (
      <>
        {renderInput()}
        <ShowFromMouse
          style={{ zIndex: Z_INDEX_MESSAGE }}
          show={state.show}
          contStyle={{ width: '94%', padding: 12 }}
          onClose={handlers.onHide}
        >
          {renderMain(true)}
        </ShowFromMouse>
      </>
    );
  }

  return state.mobile ? renderModel() : renderTooltip();
}

Dates.defaultProps = {
  startLabel: '开始',
  endLabel: '结束',
};

export default Dates;
