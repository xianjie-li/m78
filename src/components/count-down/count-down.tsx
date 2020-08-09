import React, { useEffect, useRef } from 'react';
import { getDateCountDown } from '@lxjx/utils';
import { useSelf } from '@lxjx/hooks';
import { dumpFn } from 'm78/util';
import cls from 'classnames';
import { ComponentBaseProps } from '../types/types';

interface ExtCls {
  /** 字符"xx天xx时xx分"中的xx所在包裹元素的额外类名 */
  textClassName?: string;
  /** 字符"xx天xx时xx分"中的天、时、分等描述文字的额外类名 */
  timeClassName?: string;
}

type TimeMeta = ReturnType<typeof getDateCountDown> & ExtCls;

export interface CountDownProps extends ExtCls, ComponentBaseProps {
  /** 目标时间 */
  date?: string | Date;
  /** 替换默认的序列化方法，返回字符串会替换默认的时间字符，调用triggerFinish()可以清除倒计时计时器 */
  format?(meta: TimeMeta, triggerFinish: () => void): string;
  /** 每次时间字符改变时触发 */
  onChange?(meta: TimeMeta): void;
  /** 更新频率，默认1000ms */
  frequency?: number;
}

/**
 * 将getDateCountDown返回的时间转换为可读的倒计时字符串
 * @param meta - 与getDateCountDown()返回类型相同
 * @param triggerFinish - 用于帮助调用者停止计时器
 * @return string
 * */
const _format: CountDownProps['format'] = (meta, triggerFinish) => {
  const s1 = meta.textClassName;
  const s2 = meta.timeClassName;

  if (+meta.d > 30) {
    triggerFinish && triggerFinish();
    return `${wTime(meta.d, s2)}${wTxt('天后', s1)}`;
  }

  if (meta.timeOut) {
    triggerFinish && triggerFinish();
  }

  return (
    (+meta.d ? wTime(meta.d, s2) + wTxt('天', s1) : '') +
    wTime(meta.h, s2) +
    wTxt('时', s1) +
    wTime(meta.m, s2) +
    wTxt('分', s1) +
    wTime(meta.s, s2) +
    wTxt('秒', s1)
  );
};

/* 快捷设置包装类名 */
function wTime(s: string, extra?: string) {
  return `<span class="${cls('m78-count-down_time', extra)}">${s}</span>`;
}

function wTxt(s: string, extra?: string) {
  return `<span class="${cls('m78-count-down_text', extra)}">${s}</span>`;
}

const CountDown: React.FC<CountDownProps> = ({
  date,
  textClassName,
  timeClassName,
  format = _format,
  onChange = dumpFn,
  frequency = 1000,
  className,
  style,
}) => {
  const ref = useRef<HTMLSpanElement>(null!);
  const self = useSelf({
    timer: 0,
  });

  useEffect(() => {
    if (date) {
      timeOutput();
      self.timer = window.setInterval(() => {
        timeOutput();
      }, frequency);
    }
    return () => {
      self.timer && window.clearInterval(self.timer);
    };
    // eslint-disable-next-line
  }, [date]);

  function timeOutput() {
    const meta = {
      ...getDateCountDown(date!)!,
      textClassName,
      timeClassName,
    };

    onChange(meta);

    ref.current.innerHTML = `${format(meta, () => {
      self.timer && window.clearInterval(self.timer);
    })}`;
  }

  return <span className={cls('m78-count-down', className)} style={style} ref={ref} />;
};

export default CountDown;
