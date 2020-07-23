import React, { useMemo, useState } from 'react';
import Button from '@lxjx/fr/lib/button';
import { useFormState, useSelf, useSetState } from '@lxjx/hooks';
import moment, { Moment } from 'moment';
import cls from 'classnames';

import { concatTimeToMoment, DATE_DEFAULT_PARSE } from './utils';
import {
  staticRenderCheckedValue,
  staticRenderDate,
  staticRenderMonth,
  staticRenderTabBtns,
  staticRenderYear,
} from './renders';
import { DatesProps, DatesRangeProps, DateType, ShareMetas } from './type';
import Time from './Time';
import { useDateUIController, useHandlers } from './hooks';

function Dates(props: DatesProps): JSX.Element;
function Dates(props: DatesRangeProps): JSX.Element;
function Dates(props: DatesProps | DatesRangeProps) {
  const tProps = props as DatesProps & DatesRangeProps;
  const { type = DateType.DATE, hasTime = false, range } = tProps;

  /**  当前时间 */
  const [nowM] = useState(() => moment());

  const [value, setValue] = useFormState<string[] | string, Moment>(props, range ? [] : '');

  const [state, setState] = useSetState<ShareMetas['state']>({
    /** 实际存储的时间, 控制当前日期显示的位置, 根据选择的日期类型来决定设置年/月/日中的某一项 */
    currentM: nowM,
    /** 当前参与交互的临时时间，用于预览最终状态等 */
    tempM: undefined,
    /** 控制当前展示的选择器类型 */
    type,
  });

  const self = useSelf<ShareMetas['self']>({
    /** 指向当前value的moment, 这里才是实际存储value的地方, value相当于此值的format */
    cValueMoment: undefined,
    /** 当是范围选择时，存储结束时间 */
    endValueMoment: undefined,
  });

  /** 解析value到cValueMoment/endValueMoment(useMemo执行时机比effect更快) */
  useMemo(() => {
    if (value) {
      if (type === DateType.TIME) {
        if (range) {
          if (!value.length) return;
          self.cValueMoment = concatTimeToMoment(value[0]);

          if (value[1]) {
            self.endValueMoment = concatTimeToMoment(value[1]);
          }
          return;
        }

        // 作为纯时间组件使用
        self.cValueMoment = concatTimeToMoment(value as string);
      } else {
        if (range) {
          if (!value.length) return;
          self.cValueMoment = moment(value[0], DATE_DEFAULT_PARSE);

          if (value[1]) {
            self.endValueMoment = moment(value[1], DATE_DEFAULT_PARSE);
          }
          return;
        }
        self.cValueMoment = moment(value, DATE_DEFAULT_PARSE);
      }
    }
  }, [value]);

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

  /** 外部化一控制函数 */
  const controllers = useDateUIController(share);

  /** 外部化一处理函数 */
  const handlers = useHandlers(share, controllers);

  const { onCheckTime } = handlers;

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

  const renderTabBtns = () => staticRenderTabBtns(share, controllers);

  /** 时间选择 */
  function renderTime() {
    const common = {
      disabledTime: props.disabledTime,
      hideDisabled: props.hideDisabledTime,
      disabledTimeExtra: {
        checkedDate: self.cValueMoment,
        checkedEndDate: self.endValueMoment,
        isRange: range,
      },
    };

    return (
      <>
        <Time {...common} value={getCurrentTime()} onChange={onCheckTime} />
        {range && (
          <Time
            {...common}
            value={getCurrentTime(true)}
            onChange={times => onCheckTime(times, true)}
            label={<span>~ 选择时间范围 ~</span>}
          />
        )}
      </>
    );
  }

  function render() {
    if (state.type === DateType.DATE && type === DateType.DATE) return renderDate();

    if (state.type === DateType.MONTH) return renderMonth();

    if (state.type === DateType.YEAR) return renderYear();

    if (state.type === DateType.TIME) return renderTime();

    return null;
  }

  return (
    <div
      className={cls('fr-dates', {
        __time: type === DateType.TIME || state.type === DateType.TIME,
      })}
    >
      <div className="fr-dates_head">
        <span className="bold">{renderCheckedValue()}</span>
        {renderTabBtns()}
      </div>
      <div className="fr-dates_body">{render()}</div>
      <div className="fr-dates_foot">
        <span className="fr-dates_btns">
          <Button size="small" link color="primary">
            今天
          </Button>
          <Button size="small" link color="primary">
            现在
          </Button>
        </span>
        <Button size="small" color="primary">
          完成
        </Button>
      </div>
    </div>
  );
}

Dates.defaultProps = {
  startDateLabel: '开始',
  endDateLabel: '结束',
};

export default Dates;
