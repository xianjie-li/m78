import Button from 'm78/button';
import React from 'react';
import moment, { Moment } from 'moment';
import Time from './Time';
import { rangeDisabledBeforeTime } from './builtInHandlers';
import {
  DATE_FORMAT_DATE,
  DATE_FORMAT_DATE_TIME,
  DATE_FORMAT_MONTH,
  DATE_FORMAT_TIME,
  DATE_FORMAT_YEAR,
  disabledHandlerFormat,
  getDates,
  getMonths,
  getYears,
  placeholderMaps,
  timePreset,
} from './utils';
import { DateType, ShareMetas } from './type';
import { useDateUIController, useHandlers } from './hooks';
import DateItem from './DateItem';

/**  渲染选择结果 */
export function staticRenderCheckedValue(
  { self, hasTime, type, value, props }: ShareMetas,
  { toTime }: ReturnType<typeof useDateUIController>,
) {
  if (!value) {
    return <div>请选择{placeholderMaps[type]}</div>;
  }

  const { range } = props;

  const startLabel = range && <span className="color-second">{props.startLabel}: </span>;
  const endLabel = range && <span className="color-second">{props.endLabel}: </span>;

  const tipsNode = <span>请选择{!range && placeholderMaps[type]}</span>;

  function renderDateItem(mmt?: Moment, label?: React.ReactNode) {
    return (
      <div>
        {label}
        {mmt ? <span>{mmt.format(DATE_FORMAT_DATE)}</span> : tipsNode}
        {mmt && hasTime && (
          <span
            onClick={toTime}
            className="color-primary m78-dates_time m78-dates_effect-text"
            title="点击选择"
          >
            {mmt.format(DATE_FORMAT_TIME)}
          </span>
        )}
      </div>
    );
  }

  const renderHelper = (mmt?: Moment, label?: React.ReactNode, format?: string, unit?: string) => (
    <div>
      {label}
      {mmt ? (
        <span>
          {mmt.format(format)}
          {unit}
        </span>
      ) : (
        tipsNode
      )}
    </div>
  );

  function commonRender(format: string, unit?: string) {
    return (
      <div>
        {(range || self.cValueMoment) && renderHelper(self.cValueMoment, startLabel, format, unit)}
        {range && renderHelper(self.endValueMoment, endLabel, format, unit)}
      </div>
    );
  }

  if (type === DateType.DATE) {
    return (
      <div>
        {renderDateItem(self.cValueMoment, startLabel)}
        {range && renderDateItem(self.endValueMoment, endLabel)}
      </div>
    );
  }

  if (type === DateType.MONTH) {
    return commonRender(DATE_FORMAT_MONTH, '月');
  }

  if (type === DateType.YEAR) {
    return commonRender(DATE_FORMAT_YEAR, '年');
  }

  if (type === DateType.TIME) {
    return commonRender(DATE_FORMAT_TIME);
  }
}

/** 日期选择 */
export function staticRenderDate(
  { self, state, nowM, props }: ShareMetas,
  {
    onCurrentChange,
    prevY,
    prev,
    toYear,
    toMonth,
    nextY,
    next,
  }: ReturnType<typeof useDateUIController>,
  { onCheck, onItemActive }: ReturnType<typeof useHandlers>,
) {
  return (
    <>
      <div className="m78-dates_label">
        <span>
          <span className="m78-dates_arrow" title="上一年" onClick={prevY} />
          <span className="m78-dates_arrow __single ml-8" title="上一月" onClick={prev} />
        </span>
        <span>
          <span className="m78-dates_effect-text" onClick={toYear}>
            {state.currentM.year()}
          </span>
          年
          <span className="m78-dates_effect-text" onClick={toMonth} style={{ marginLeft: 4 }}>
            {state.currentM.month() + 1}
          </span>
          月
        </span>
        <span>
          <span className="m78-dates_arrow __reverse __single" title="下一月" onClick={next} />
          <span className="m78-dates_arrow __reverse ml-8" title="下一年" onClick={nextY} />
        </span>
      </div>
      <div>
        <div className="m78-dates_date-item __title">
          <span className="m78-dates_date-item-inner">一</span>
        </div>
        <div className="m78-dates_date-item __title">
          <span className="m78-dates_date-item-inner">二</span>
        </div>
        <div className="m78-dates_date-item __title">
          <span className="m78-dates_date-item-inner">三</span>
        </div>
        <div className="m78-dates_date-item __title">
          <span className="m78-dates_date-item-inner">四</span>
        </div>
        <div className="m78-dates_date-item __title">
          <span className="m78-dates_date-item-inner">五</span>
        </div>
        <div className="m78-dates_date-item __title">
          <span className="m78-dates_date-item-inner">六</span>
        </div>
        <div className="m78-dates_date-item __title">
          <span className="m78-dates_date-item-inner">日</span>
        </div>
      </div>
      <div className="m78-dates_list">
        {getDates(state.currentM.year(), state.currentM.month() + 1).map(mm => (
          <DateItem
            disabledDate={props.disabledDate}
            itemMoment={mm}
            currentMoment={state.currentM}
            checkedMoment={self.cValueMoment}
            checkedEndMoment={self.endValueMoment}
            nowMoment={nowM}
            onCheck={onCheck}
            onCurrentChange={onCurrentChange}
            key={mm.format()}
            type={DateType.DATE}
            range={props.range}
            onActive={onItemActive}
            tempMoment={state.tempM}
            startLabel={props.startLabel}
            endLabel={props.endLabel}
          />
        ))}
      </div>
    </>
  );
}

/** 月份选择 */
export function staticRenderMonth(
  { self, state, nowM, props }: ShareMetas,
  { prevY, toYear, nextY }: ReturnType<typeof useDateUIController>,
  { onCheckMonth, onItemActive }: ReturnType<typeof useHandlers>,
) {
  return (
    <>
      <div className="m78-dates_label">
        <span className="m78-dates_arrow" title="上一年" onClick={prevY} />
        <span>
          <span className="m78-dates_effect-text" onClick={toYear}>
            {state.currentM.year()}
          </span>
          年
        </span>
        <span className="m78-dates_arrow __reverse" title="下一年" onClick={nextY} />
      </div>
      <div className="m78-dates_list">
        {getMonths(state.currentM.year()).map(mm => (
          <DateItem
            disabledDate={props.disabledDate}
            itemMoment={mm}
            currentMoment={state.currentM}
            checkedMoment={self.cValueMoment}
            checkedEndMoment={self.endValueMoment}
            nowMoment={nowM}
            onCheck={onCheckMonth}
            key={mm.format()}
            type={DateType.MONTH}
            range={props.range}
            onActive={onItemActive}
            tempMoment={state.tempM}
            startLabel={props.startLabel}
            endLabel={props.endLabel}
          />
        ))}
      </div>
    </>
  );
}

/** 年份选择 */
export function staticRenderYear(
  { self, state, nowM, props }: ShareMetas,
  { changeDate }: ReturnType<typeof useDateUIController>,
  { onCheckYear, onItemActive }: ReturnType<typeof useHandlers>,
) {
  const [list, str] = getYears(state.currentM.year());

  return (
    <>
      <div className="m78-dates_label">
        <span
          className="m78-dates_arrow"
          title="前一组"
          onClick={() => changeDate(2, 12, 'years')}
        />
        <span>{str}</span>
        <span
          className="m78-dates_arrow __reverse"
          title="后一组"
          onClick={() => changeDate(1, 12, 'years')}
        />
      </div>
      <div className="m78-dates_list">
        {list.map(mm => (
          <DateItem
            disabledDate={props.disabledDate}
            itemMoment={mm}
            currentMoment={state.currentM}
            checkedMoment={self.cValueMoment}
            checkedEndMoment={self.endValueMoment}
            nowMoment={nowM}
            onCheck={onCheckYear}
            key={mm.format()}
            type={DateType.YEAR}
            range={props.range}
            onActive={onItemActive}
            tempMoment={state.tempM}
            startLabel={props.startLabel}
            endLabel={props.endLabel}
          />
        ))}
      </div>
    </>
  );
}

export function staticRenderTime(
  { props, self, getCurrentTime }: ShareMetas,
  { onCheckTime }: ReturnType<typeof useHandlers>,
) {
  const common = {
    disabledTime: disabledHandlerFormat(props.disabledTime),
    hideDisabled: props.hideDisabledTime,
    disabledTimeExtra: {
      checkedDate: self.cValueMoment,
      checkedEndDate: self.endValueMoment,
      isRange: props.range,
    },
  };

  return (
    <>
      <Time {...common} value={getCurrentTime()} onChange={onCheckTime} />
      {props.range && (
        <Time
          {...common}
          disabledTime={disabledHandlerFormat(props.disabledTime, [rangeDisabledBeforeTime])}
          value={getCurrentTime(true)}
          onChange={times => onCheckTime(times, true)}
          label={<span>~ 选择时间范围 ~</span>}
        />
      )}
    </>
  );
}

export function staticRenderTabs(
  { self, state, type, hasTime, props }: ShareMetas,
  { toYear, toMonth, toDate, toTime }: ReturnType<typeof useDateUIController>,
) {
  let year: React.ReactElement | null = null;

  let month: React.ReactElement | null = null;

  let date: React.ReactElement | null = null;

  let time: React.ReactElement | null = null;

  const renderButton = (dType: DateType, title: string, unit: string, handler: any) => (
    <Button
      size="small"
      link
      title={title}
      color={state.type === dType ? 'primary' : undefined}
      onClick={handler}
    >
      {unit}
    </Button>
  );

  if (type === DateType.MONTH || type === DateType.DATE) {
    year = renderButton(DateType.YEAR, '选择年份', '年', toYear);
  }

  if (type === DateType.MONTH || type === DateType.DATE) {
    month = renderButton(DateType.MONTH, '选择月份', '月', toMonth);
  }

  if (type === DateType.DATE) {
    date = renderButton(DateType.DATE, '选择日期', '日', toDate);
  }

  /* 选择了时间 且 类型为日期选择器 并且启用了 时间选择 或 类型为时间选择器 */
  if (self.cValueMoment && type === DateType.DATE && hasTime) {
    time = renderButton(DateType.TIME, '选择时间', '时', toTime);

    if (props.range && !self.endValueMoment) time = null;
  }

  return (
    <span className="m78-dates_btns">
      {year}
      {month}
      {date}
      {time}
    </span>
  );
}

/** 为一个包含 hour minute second 的对象设置空值的默认值 */
const timePresetHelper = (t?: any) => {
  const defaultTime = {
    hour: 0,
    minute: 0,
    second: 0,
  };
  return {
    ...defaultTime,
    ...t,
  };
};

export const renderPresetDates = ({ type, hasTime, setValue, props }: ShareMetas) => {
  const baseProps = { size: 'small', link: true, color: 'primary' } as const;

  // 设为当前
  const setCurrent = (format: string) => {
    const now = moment();
    setValue(now.format(format), now);
  };

  // 设置年月日时的范围
  const setCurrentRange = (format: string, setType?: 'week' | 'month') => {
    const now = moment();
    const end = moment();

    now.set(timePresetHelper());

    end.set(timePreset.day[1]);

    if (setType) {
      now.startOf(setType);
      end.endOf(setType);
    }

    setValue([now.format(format), end.format(format)], [now, end]);
  };

  // 设置时间范围
  const setCurrentTimeRange = (setType: keyof typeof timePreset) => {
    const now = moment();
    const end = moment();

    const p = timePreset[setType] || timePreset.day;

    now.set(timePresetHelper(p[0]));

    end.set(timePresetHelper(p[1]));

    setValue([now.format(DATE_FORMAT_TIME), end.format(DATE_FORMAT_TIME)], [now, end]);
  };

  const simpleHelper = (label: string, handler: any) => {
    return React.createElement(Button, { ...baseProps, onClick: handler }, label);
  };

  if (props.range) {
    if (type === DateType.TIME) {
      return (
        <>
          {simpleHelper('全天', () => setCurrentTimeRange('day'))}
          {simpleHelper('早', () => setCurrentTimeRange('morning'))}
          {simpleHelper('中', () => setCurrentTimeRange('midday'))}
          {simpleHelper('午', () => setCurrentTimeRange('afternoon'))}
          {simpleHelper('晚', () => setCurrentTimeRange('evening'))}
        </>
      );
    }

    if (type === DateType.DATE) {
      return (
        <>
          {simpleHelper(hasTime ? '全天' : '今天', () =>
            setCurrentRange(hasTime ? DATE_FORMAT_DATE_TIME : DATE_FORMAT_DATE),
          )}
          {simpleHelper('本周', () =>
            setCurrentRange(hasTime ? DATE_FORMAT_DATE_TIME : DATE_FORMAT_DATE, 'week'),
          )}
          {simpleHelper('本月', () =>
            setCurrentRange(hasTime ? DATE_FORMAT_DATE_TIME : DATE_FORMAT_DATE, 'month'),
          )}
        </>
      );
    }

    return;
  }

  if (type === DateType.TIME) {
    return simpleHelper('现在', () => setCurrent(DATE_FORMAT_TIME));
  }

  if (type === DateType.DATE) {
    return simpleHelper('今天', () =>
      setCurrent(hasTime ? DATE_FORMAT_DATE_TIME : DATE_FORMAT_DATE),
    );
  }

  if (type === DateType.MONTH) {
    return simpleHelper('本月', () => setCurrent(DATE_FORMAT_MONTH));
  }

  if (type === DateType.YEAR) {
    return simpleHelper('今年', () => setCurrent(DATE_FORMAT_YEAR));
  }
};
