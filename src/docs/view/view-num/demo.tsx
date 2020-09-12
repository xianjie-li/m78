import React, { useState } from 'react';
import Num from 'm78/num';

const Demo = () => {
  const [num, setNum] = useState(999999);

  return (
    <div className="fs-38">
      <div>
        <Num>1000</Num> <span className="color-second fs-16">(数字)</span>
      </div>
      <div>
        <Num pattern="3" precision={1}>
          100000000
        </Num>{' '}
        <span className="color-second fs-16">(金额)</span>
      </div>
      <div>
        <Num pattern="3" transition precision={2}>
          {num}
        </Num>{' '}
        <span className="color-second fs-16">
          (动画)
          <button
            className="ml-12"
            type="button"
            onClick={() => setNum(p => p + Math.floor(Math.random() * 100000))}
          >
            +
          </button>
        </span>
      </div>
      <div>
        <Num pattern="3" precision={2}>
          100000000.0000
        </Num>{' '}
        <span className="color-second fs-16">(小数)</span>
      </div>
      <div>
        <Num pattern="3, 4" lastRepeat delimiter=" ">
          17500000000
        </Num>
        <span className="color-second fs-16">(手机号)</span>
      </div>
      <div>
        <Num pattern="3, 4" lastRepeat delimiter=" ">
          6220224051500000000
        </Num>
        <span className="color-second fs-16">(打钱)</span>
      </div>
      <div>
        <Num padLeftZero={8}>520</Num>
        <span className="color-second fs-16">(左填充)</span>
      </div>
      <div>
        <Num
          format={str => {
            const colors = ['red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'purple'];
            return str
              .split('')
              .map((item, index) => {
                const color = colors[index % colors.length];
                return `<span style="color: ${color}">${item}</span>`;
              })
              .join('');
          }}
        >
          1000000
        </Num>
        <span className="color-second fs-16">(自定义样式)</span>
      </div>
      <div>
        <Num
          transition
          precision={2}
          format={str => {
            const colors = ['red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'purple'];
            return str
              .split('')
              .map((item, index) => {
                const color = colors[index % colors.length];
                return `<span style="color: ${color};padding: 8px;width: 50px;display:inline-block;text-align:center;border-radius: 4px;border:2px solid ${color};margin-right: 12px">${item}</span>`;
              })
              .join('');
          }}
        >
          {num}
        </Num>
        <span className="color-second fs-16">(自定义样式2)</span>
      </div>
    </div>
  );
};

export default Demo;
