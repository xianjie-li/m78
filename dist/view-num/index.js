import 'm78/view-num/style';
import { useRef, useMemo, createElement } from 'react';
import { formatString } from '@lxjx/utils';
import { formatMoney } from 'm78/input';
import { TransitionBase } from '@lxjx/react-transition-spring';

function parseN(num) {
  var res = Number(num);
  return isNaN(res) ? null : res;
}

function ViewNum(props) {
  var _props$children = props.children,
      children = _props$children === void 0 ? '' : _props$children,
      className = props.className,
      style = props.style,
      pattern = props.pattern,
      _props$repeat = props.repeat,
      repeat = _props$repeat === void 0 ? true : _props$repeat,
      lastRepeat = props.lastRepeat,
      _props$delimiter = props.delimiter,
      delimiter = _props$delimiter === void 0 ? "'" : _props$delimiter,
      precision = props.precision,
      transition = props.transition,
      padLeftZero = props.padLeftZero,
      propsFormat = props.format;
  var spanEl = useRef(null);

  function format(num) {
    var numParse = parseN(num);
    if (!numParse) return '';
    var showNum = String(numParse);

    if (typeof precision === 'number') {
      showNum = numParse === null || numParse === void 0 ? void 0 : numParse.toFixed(precision);
    }

    if (padLeftZero && showNum.length < padLeftZero) {
      showNum = showNum.padStart(padLeftZero, '0');
    }

    if (pattern) {
      showNum = formatString(showNum, pattern, {
        repeat: repeat,
        lastRepeat: lastRepeat,
        delimiter: delimiter
      });
      showNum = formatMoney(showNum, delimiter);
    }

    if (propsFormat) {
      showNum = propsFormat(showNum);
    }

    return showNum;
  }

  var target = useMemo(function () {
    if (transition) return '';
    return format(children);
  }, [children]);

  if (transition) {
    var number = parseN(children);
    return /*#__PURE__*/createElement("span", null, /*#__PURE__*/createElement(TransitionBase, {
      className: className,
      style: style,
      tag: "span",
      toggle: true,
      to: {
        number: number
      },
      from: {
        number: 0
      }
    }, function (_ref) {
      var num = _ref.number;
      return num.to(function (n) {
        if (spanEl.current) {
          spanEl.current.innerHTML = format(n);
        }
      });
    }), /*#__PURE__*/createElement("span", {
      ref: spanEl
    }));
  }

  return /*#__PURE__*/createElement("span", {
    className: className,
    style: style,
    dangerouslySetInnerHTML: {
      __html: target
    }
  });
}

export { ViewNum };
