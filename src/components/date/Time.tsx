import React, { useMemo, useEffect } from 'react';
import { useEffectEqual, useFormState, useScroll } from '@lxjx/hooks';
import cls from 'classnames';
import { createRandString } from '@lxjx/utils';
import { getTimes } from './utils';
import { TimeProps, TimeValue } from './type';

function getSelector(id: string, key: string, val: number) {
  return `${key}-${val}-${id}`;
}

const Time: React.FC<TimeProps> = props => {
  const { hideDisabled = true, disabledTimeExtra, disabledTime } = props;

  const id = useMemo(() => createRandString(), []);

  const times = useMemo(() => getTimes(), []);

  const [value, setValue] = useFormState(props, { h: 0, m: 0, s: 0 });

  const sc1 = useScroll<HTMLDivElement>();
  const sc2 = useScroll<HTMLDivElement>();
  const sc3 = useScroll<HTMLDivElement>();

  const map = {
    h: { sc: sc1, unit: '点' },
    m: { sc: sc2, unit: '分' },
    s: { sc: sc3, unit: '秒' },
  };

  /** 默认选中项 */
  useEffect(() => {
    patchPosition(true);
  }, []);

  // 存在已选中的禁用时间时，将其更新为该列第一个可用值
  useEffectEqual(() => {
    if (!disabledTime) return;

    const newTime = { ...value };
    let hasDisabled = false;

    Object.entries(value).forEach(([key, t]) => {
      const k = key as keyof TimeValue;

      const isDisabled = disabledTime(
        {
          ...value,
          key: k,
          val: t,
        },
        disabledTimeExtra,
      );

      if (isDisabled) {
        const currentColumn = times[k];

        // 查找该列第一个可用
        const enableVal = currentColumn.find(
          cItem => !disabledTime({ ...value, key: k, val: cItem }, disabledTimeExtra),
        );

        if (enableVal) {
          hasDisabled = true; // 有可替换值才视为禁用
          newTime[k] = enableVal;
        }
      }
    });

    if (hasDisabled) {
      setValue(newTime);
    }

    patchPosition();
  }, [value]);

  /** 设置指定key的值到value并滚动到其所在位置 */
  function patchValue(key: keyof typeof map, val: number, immediate?: boolean) {
    setValue(prev => ({
      ...prev,
      [key]: val,
    }));

    const cM = map[key];

    setTimeout(() => {
      cM.sc.scrollToElement(`.${getSelector(id, key, val)}`, immediate);
    });
  }

  /** 同步滚动到当前选中位置 */
  function patchPosition(immediate = false) {
    setTimeout(() => {
      sc1.scrollToElement(`.${getSelector(id, 'h', value.h)}`, immediate);
      sc2.scrollToElement(`.${getSelector(id, 'm', value.m)}`, immediate);
      sc3.scrollToElement(`.${getSelector(id, 's', value.s)}`, immediate);
    });
  }

  function renderColumn([key, { sc, unit }]: [keyof TimeValue, typeof map[keyof typeof map]]) {
    return (
      <div className="fr-dates_picker-column" ref={sc.ref} key={key}>
        {times[key].map(item => {
          const selector = getSelector(id, key, item);

          const disabled = disabledTime
            ? disabledTime(
                {
                  ...value,
                  key,
                  val: item,
                },
                disabledTimeExtra,
              )
            : false;

          /** 禁用并隐藏 */
          if (disabled && hideDisabled) return null;

          return (
            <div
              key={item}
              className={cls('fr-dates_picker-time', selector, {
                __active: value[key as keyof TimeValue] === item,
                __disabled: disabled,
              })}
              onClick={() => {
                if (disabled) return;
                patchValue(key, item);
              }}
            >
              {item} <span className="color-second fs-12">{unit}</span>
            </div>
          );
        })}
        <div className="fr-dates_picker-time __plain" />
        <div className="fr-dates_picker-time __plain" />
        <div className="fr-dates_picker-time __plain" />
        <div className="fr-dates_picker-time __plain" />
      </div>
    );
  }

  function renderTimes() {
    return (
      <div className="fr-dates_picker-item fr-scroll-bar">
        {Object.entries(map).map((item: any) => renderColumn(item))}
      </div>
    );
  }

  return (
    <div className="fr-dates_picker">
      {props.label && <div className="fr-dates_picker-item-diver">{props.label}</div>}

      {renderTimes()}
    </div>
  );
};

export default Time;
