import React, { useMemo, useState } from 'react';
import Button from '@lxjx/fr/lib/button';
import { useFn, useFormState, useSelf, useSetState } from '@lxjx/hooks';
import moment, { Moment, unitOfTime } from 'moment';
import cls from 'classnames';

import { DateItemProps, DatesProps, DateType, TimeProps } from './type';
import DateItem from './DateItem';
import Time from './Time';
import {
  DATE_FORMAT_DATE,
  DATE_FORMAT_DATE_TIME,
  DATE_FORMAT_MONTH,
  DATE_FORMAT_TIME,
  DATE_FORMAT_YEAR,
  getDates,
  getMonths,
  getYears,
} from './utils';

function disabledDate(mmt: Moment, type: any) {
  if (mmt.isBefore('2020-07-16', type)) {
    return true;
  }
}

const Dates: React.FC<DatesProps> = props => {
  const { type = DateType.DATE, hasTime = true } = props;

  /**  当前时间 */
  const [nowM] = useState(() => moment());

  const [state, setState] = useSetState({
    /** 实际存储的时间, 控制当前日期显示的位置, 根据选择的日期类型来决定设置年/月/日中的某一项 */
    currentM: nowM,
    /** 当前日期类型 */
    type,
  });

  const [value, setValue] = useFormState(props, '');

  const self = useSelf({
    page: 1,
    /** 指向当前value的moment */
    cValueMoment: (null as unknown) as Moment,
  });

  /** 同步value到cValueMoment，useMemo执行时机比effect更快 */
  useMemo(() => {
    if (value) {
      self.cValueMoment = moment(value); // 使用宽容模式来兼容 更多初始化格式
    }
  }, [value]);

  /** 在当前月份上增加或减少指定天数并更新currentM */
  function changeDate(cType: 1 | 2, number = 1, dateType = 'months' as unitOfTime.Base) {
    const map = { 1: 'add', 2: 'subtract' } as const;

    const nMm = state.currentM.clone();
    nMm[map[cType]](number, dateType);

    setState({
      currentM: nMm,
    });
  }

  /** 切换 到上一月 */
  const prev = useFn(() => {
    changeDate(2);
  });

  /** 切换 到下一月 */
  const next = useFn(() => {
    changeDate(1);
  });

  /** 切换 到上一年 */
  const prevY = useFn(() => {
    changeDate(2, 1, 'years');
  });

  /** 切换 到下一年 */
  const nextY = useFn(() => {
    changeDate(1, 1, 'years');
  });

  /** 接收来自DateItem的通知并更新currentM */
  const onCurrentChange: DateItemProps['onCurrentChange'] = useFn(mmt => {
    setState({
      currentM: mmt,
    });
  });

  const toYear = useFn(() => {
    setState({
      type: DateType.YEAR,
    });
  });

  const toMonth = useFn(() => {
    setState({
      type: DateType.MONTH,
    });
  });

  const toDate = useFn(() => {
    setState({
      type: DateType.DATE,
    });
  });

  const toTime = useFn(() => {
    setState({
      type: DateType.TIME,
    });
  });

  /** 选中日期项 */
  const onCheck: DateItemProps['onCheck'] = useFn((dString, mmt) => {
    console.log(dString);

    if (hasTime) {
      mmt.set(getCurrentTime());

      setValue(mmt.format(DATE_FORMAT_DATE_TIME), mmt);

      toTime();
      return;
    }

    setValue(dString, mmt);
  });

  /** 选中时间 */
  const onCheckTime: TimeProps['onChange'] = useFn(({ h, m, s }) => {
    const cM = self.cValueMoment.clone();

    cM.set({
      hour: h,
      minute: m,
      second: s,
    });

    setValue(cM.format(DATE_FORMAT_DATE_TIME), cM);
  });

  /** 选中月 */
  const onCheckMonth: DateItemProps['onCheck'] = useFn((dString, mmt) => {
    console.log(dString);
    // 选择器类型为月时直接选中，不是则将UI更新到对应的月

    if (type === DateType.MONTH) {
      setValue(dString, mmt);
      return;
    }

    const cm = state.currentM.clone();

    cm.year(mmt.year()).month(mmt.month());

    setState({
      currentM: cm,
      type: DateType.DATE,
    });
  });

  /** 选中年 */
  const onCheckYear: DateItemProps['onCheck'] = useFn((dString, mmt) => {
    console.log(dString);
    // 选择器类型为年时直接选中，不是则将UI更新到对应的月

    if (type === DateType.YEAR) {
      setValue(dString, mmt);
      return;
    }

    const cm = state.currentM.clone();
    cm.year(mmt.year());

    setState({
      currentM: cm,
      type: DateType.MONTH,
    });
  });

  function getCurrentTime() {
    const cM = self.cValueMoment;
    return {
      h: cM ? cM.hour() : nowM.hour(),
      m: cM ? cM.minute() : nowM.minute(),
      s: cM ? cM.second() : 0,
    };
  }

  /** 渲染选择结果 */
  function renderDateValue() {
    if (!value) {
      const maps = {
        [DateType.YEAR]: '请选择年份',
        [DateType.MONTH]: '请选择月份',
        [DateType.DATE]: '请选择日期',
        [DateType.TIME]: '请选择时间 ',
      };

      return <div>{maps[type]}</div>;
    }

    if (type === DateType.DATE) {
      return (
        <div>
          {self.cValueMoment.format(DATE_FORMAT_DATE)}
          {hasTime && (
            <span className="color-primary fr-dates_time fr-dates_effect-text" title="点击选择">
              {self.cValueMoment.format(DATE_FORMAT_TIME)}
            </span>
          )}
        </div>
      );
    }

    if (type === DateType.MONTH) {
      return <div>{self.cValueMoment.format(DATE_FORMAT_MONTH)}月</div>;
    }

    if (type === DateType.YEAR) {
      return <div>{self.cValueMoment.format(DATE_FORMAT_YEAR)}年</div>;
    }
  }

  /** 日期选择 */
  function renderDate() {
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
              disabledDate={disabledDate}
              itemMoment={mm}
              currentMoment={state.currentM}
              checkedMoment={self.cValueMoment}
              nowMoment={nowM}
              onCheck={onCheck}
              onCurrentChange={onCurrentChange}
              key={mm.format()}
              type={DateType.DATE}
            />
          ))}
        </div>
      </>
    );
  }

  /** 月份选择 */
  function renderMonth() {
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
              disabledDate={disabledDate}
              itemMoment={mm}
              currentMoment={state.currentM}
              checkedMoment={self.cValueMoment}
              nowMoment={nowM}
              onCheck={onCheckMonth}
              key={mm.format()}
              type={DateType.MONTH}
            />
          ))}
        </div>
      </>
    );
  }

  /** 年份选择 */
  function renderYear() {
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
              disabledDate={disabledDate}
              itemMoment={mm}
              currentMoment={state.currentM}
              checkedMoment={self.cValueMoment}
              nowMoment={nowM}
              onCheck={onCheckYear}
              key={mm.format()}
              type={DateType.YEAR}
            />
          ))}
        </div>
      </>
    );
  }

  /** 时间选择 */
  function renderTime() {
    return (
      <Time
        value={getCurrentTime()}
        onChange={onCheckTime}
        // label={
        //   <span>
        //     <span>开始:</span> 2020-07-24
        //   </span>
        // }
      />
    );
  }

  function render() {
    if (state.type === DateType.DATE && type === DateType.DATE) return renderDate();

    if (state.type === DateType.MONTH) return renderMonth();

    if (state.type === DateType.YEAR) return renderYear();

    if (state.type === DateType.TIME) return renderTime();

    return '';
  }

  return (
    <div
      className={cls('fr-dates', {
        __time: type === DateType.TIME || state.type === DateType.TIME,
      })}
    >
      <div className="fr-dates_head">
        <span className="bold">{renderDateValue()}</span>
        <span className="fr-dates_btns">
          {(type === DateType.MONTH || type === DateType.DATE) && (
            <>
              <Button
                size="small"
                link
                title="选择年份"
                color={state.type === DateType.YEAR ? 'primary' : undefined}
                onClick={toYear}
              >
                年
              </Button>
              <Button
                size="small"
                link
                title="选择月份"
                color={state.type === DateType.MONTH ? 'primary' : undefined}
                onClick={toMonth}
              >
                月
              </Button>
            </>
          )}
          {type === DateType.DATE && (
            <Button
              size="small"
              link
              title="选择日期"
              color={state.type === DateType.DATE ? 'primary' : undefined}
              onClick={toDate}
            >
              日
            </Button>
          )}
          {hasTime && self.cValueMoment && (
            <Button
              size="small"
              link
              title="选择时间"
              color={state.type === DateType.TIME ? 'primary' : undefined}
              onClick={toTime}
            >
              时
            </Button>
          )}
        </span>
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
};

export default Dates;
