import * as React from 'react';
import { formatString } from '@lxjx/utils';
import { formatMoney } from 'm78/input';
import { TransitionBase } from 'm78/transition';
import { useMemo, useRef } from 'react';
import clsx from 'clsx';
import { NumProps } from './type';

function parseN(num: string | number) {
  const res = Number(num);
  return isNaN(res) ? null : res;
}

function ViewNum(props: NumProps) {
  const {
    children = '',
    className,
    style,
    pattern,
    repeat = true,
    lastRepeat,
    delimiter = "'",
    precision,
    transition,
    padLeftZero,
    format: propsFormat,
  } = props;

  const spanEl = useRef<HTMLSpanElement>(null!);

  function format(num: string | number) {
    const numParse = parseN(num);

    if (!numParse) return '';

    let showNum = String(numParse);

    if (typeof precision === 'number') {
      showNum = numParse?.toFixed(precision);
    }

    if (padLeftZero && showNum.length < padLeftZero) {
      showNum = showNum.padStart(padLeftZero, '0');
    }

    if (pattern) {
      showNum = formatString(showNum, pattern, {
        repeat,
        lastRepeat,
        delimiter,
      });

      showNum = formatMoney(showNum, delimiter);
    }

    if (propsFormat) {
      showNum = propsFormat(showNum);
    }

    return showNum;
  }

  const target = useMemo(() => {
    if (transition) return '';
    return format(children);
  }, [children]);

  if (transition) {
    const number = parseN(children);

    return (
      <span>
        <TransitionBase
          className={className}
          style={style}
          tag="span"
          show
          to={{ number }}
          from={{ number: 0 }}
        >
          {({ number: num }: any) =>
            num.to((n: any) => {
              if (spanEl.current) {
                spanEl.current.innerHTML = format(n);
              }
            })
          }
        </TransitionBase>
        <span ref={spanEl} />
      </span>
    );
  }

  return (
    <span
      className={clsx('m78 m78-view-num', className)}
      style={style}
      dangerouslySetInnerHTML={{ __html: target }}
    />
  );
}

export default ViewNum;
