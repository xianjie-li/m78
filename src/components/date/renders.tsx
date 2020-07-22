import Button from '@lxjx/fr/lib/button';
import React from 'react';
import { Moment } from 'moment';
import {
  DATE_FORMAT_DATE,
  DATE_FORMAT_MONTH,
  DATE_FORMAT_TIME,
  DATE_FORMAT_YEAR,
  getDates,
  getMonths,
  getYears,
} from './utils';
import { DateType, ShareMetas } from './type';
import { useDateUIController, useHandlers } from './hooks';
import DateItem from './DateItem';

const placeholderMaps = {
  [DateType.YEAR]: '年份',
  [DateType.MONTH]: '月份',
  [DateType.DATE]: '日期',
  [DateType.TIME]: '时间 ',
};

/**  渲染选择结果 */
export function staticRenderCheckedValue(
  { self, hasTime, type, value, props }: ShareMetas,
  { toTime }: ReturnType<typeof useDateUIController>,
) {
  if (!value) {
    return <div>请选择{placeholderMaps[type]}</div>;
  }

  const { range } = props;

  const startLabel = range && <span className="color-second">{props.startDateLabel}: </span>;
  const endLabel = range && <span className="color-second">{props.endDateLabel}: </span>;

  const tipsNode = <span>请选择{!range && placeholderMaps[type]}</span>;

  function renderDateItem(mmt?: Moment, label?: React.ReactNode) {
    return (
      <div>
        {label}
        {mmt ? <span>{mmt.format(DATE_FORMAT_DATE)}</span> : tipsNode}
        {mmt && hasTime && (
          <span
            onClick={toTime}
            className="color-primary fr-dates_time fr-dates_effect-text"
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
      <div className="fr-dates_label">
        <span>
          <span className="fr-dates_arrow" title="上一年" onClick={prevY} />
          <span className="fr-dates_arrow __single ml-8" title="上一月" onClick={prev} />
        </span>
        <span>
          <span className="fr-dates_effect-text" onClick={toYear}>
            {state.currentM.year()}
          </span>
          年
          <span className="fr-dates_effect-text" onClick={toMonth} style={{ marginLeft: 4 }}>
            {state.currentM.month() + 1}
          </span>
          月
        </span>
        <span>
          <span className="fr-dates_arrow __reverse __single" title="下一月" onClick={next} />
          <span className="fr-dates_arrow __reverse ml-8" title="下一年" onClick={nextY} />
        </span>
      </div>
      <div>
        <div className="fr-dates_date-item __title">
          <span className="fr-dates_date-item-inner">一</span>
        </div>
        <div className="fr-dates_date-item __title">
          <span className="fr-dates_date-item-inner">二</span>
        </div>
        <div className="fr-dates_date-item __title">
          <span className="fr-dates_date-item-inner">三</span>
        </div>
        <div className="fr-dates_date-item __title">
          <span className="fr-dates_date-item-inner">四</span>
        </div>
        <div className="fr-dates_date-item __title">
          <span className="fr-dates_date-item-inner">五</span>
        </div>
        <div className="fr-dates_date-item __title">
          <span className="fr-dates_date-item-inner">六</span>
        </div>
        <div className="fr-dates_date-item __title">
          <span className="fr-dates_date-item-inner">日</span>
        </div>
      </div>
      <div className="fr-dates_list">
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
            startDateLabel={props.startDateLabel}
            endDateLabel={props.endDateLabel}
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
      <div className="fr-dates_label">
        <span className="fr-dates_arrow" title="上一年" onClick={prevY} />
        <span>
          <span className="fr-dates_effect-text" onClick={toYear}>
            {state.currentM.year()}
          </span>
          年
        </span>
        <span className="fr-dates_arrow __reverse" title="下一年" onClick={nextY} />
      </div>
      <div className="fr-dates_list">
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
            startDateLabel={props.startDateLabel}
            endDateLabel={props.endDateLabel}
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
      <div className="fr-dates_label">
        <span
          className="fr-dates_arrow"
          title="前一组"
          onClick={() => changeDate(2, 12, 'years')}
        />
        <span>{str}</span>
        <span
          className="fr-dates_arrow __reverse"
          title="后一组"
          onClick={() => changeDate(1, 12, 'years')}
        />
      </div>
      <div className="fr-dates_list">
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
            startDateLabel={props.startDateLabel}
            endDateLabel={props.endDateLabel}
          />
        ))}
      </div>
    </>
  );
}

export function staticRenderTabBtns(
  { self, state, type, hasTime, props }: ShareMetas,
  { toYear, toMonth, toDate, toTime }: ReturnType<typeof useDateUIController>,
) {
  let year: React.ReactElement | null = null;

  let month: React.ReactElement | null = null;

  let date: React.ReactElement | null = null;

  let time: React.ReactElement | null = null;

  if (type === DateType.MONTH || type === DateType.DATE) {
    year = (
      <Button
        size="small"
        link
        title="选择年份"
        color={state.type === DateType.YEAR ? 'primary' : undefined}
        onClick={toYear}
      >
        年
      </Button>
    );
  }

  if (type === DateType.MONTH || type === DateType.DATE) {
    month = (
      <Button
        size="small"
        link
        title="选择月份"
        color={state.type === DateType.MONTH ? 'primary' : undefined}
        onClick={toMonth}
      >
        月
      </Button>
    );
  }

  if (type === DateType.DATE) {
    date = (
      <Button
        size="small"
        link
        title="选择日期"
        color={state.type === DateType.DATE ? 'primary' : undefined}
        onClick={toDate}
      >
        日
      </Button>
    );
  }

  /* 选择了时间 且 类型为日期选择器 并且启用了 时间选择 或 类型为时间选择器 */
  if (self.cValueMoment && type === DateType.DATE && hasTime) {
    time = (
      <Button
        size="small"
        link
        title="选择时间"
        color={state.type === DateType.TIME ? 'primary' : undefined}
        onClick={toTime}
      >
        时
      </Button>
    );

    if (props.range && !self.endValueMoment) time = null;
  }

  return (
    <span className="fr-dates_btns">
      {year}
      {month}
      {date}
      {time}
    </span>
  );
}
