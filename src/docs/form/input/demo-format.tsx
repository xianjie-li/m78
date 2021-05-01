import React, { useState } from 'react';

import { Input } from 'm78/input';

const Demo = () => {
  const [phone, setPhone] = useState('18212341234');
  const [idCard, setIdCard] = useState('522000000000000000');
  const [bankCard, setBankCard] = useState('6220000000000000000');
  const [money, setMoney] = useState('10000000000.00');
  const [customVal, setCustomVal] = useState('80');

  return (
    <div>
      <div className="mt-16">
        <h2>内置的格式化类型</h2>
        <p>
          <span role="img" aria-label="提示">
            💡
          </span>{' '}
          输出值和实际展示的值经过处理，不需要在上传时执行额外转换(只适用于受控或半受控，直接从input取值会获取到格式化后的值)
        </p>
        <Input
          prefix="手机号:"
          value={phone}
          onChange={value => setPhone(value)}
          format="phone"
          suffix={<span className="color-info">输入值：{phone}</span>}
        />
      </div>
      <div className="mt-16">
        <Input
          prefix="身份证号:"
          value={idCard}
          onChange={value => setIdCard(value)}
          format="idCard"
        />
      </div>
      <div className="mt-16">
        <Input
          prefix="银行卡号:"
          value={bankCard}
          onChange={value => setBankCard(value)}
          format="bankCard"
        />
      </div>
      <div className="mt-16">
        <Input prefix="￥" value={money} onChange={value => setMoney(value)} format="money" />
      </div>
      <div style={{ marginTop: 60 }}>
        <h2>自定义匹配模式</h2>
        <Input
          prefix="手机号:"
          value={phone}
          onChange={value => setPhone(value)}
          formatPattern="3,4"
        />
      </div>
      <div className="mt-16">
        <p>当字符长度超过模式能匹配到的长度时，可以设置</p>
        <ul>
          <li>formatLastRepeat(超出部分使用最后一位规则)</li>
          <li>formatRepeat(对超出部分重复使用每一位规则)</li>
        </ul>
        <Input
          prefix="银行卡号:"
          value={idCard}
          onChange={value => setIdCard(value)}
          formatPattern="3,4"
          formatLastRepeat
        />
      </div>
      <div className="mt-16">
        <Input
          prefix="一二三:"
          value={bankCard}
          onChange={value => setBankCard(value)}
          formatPattern="1,2,3"
          formatRepeat
        />
      </div>

      <div style={{ marginTop: 60 }}>
        <h2>使用formatter对输入进行格式化</h2>
        <Input
          value={customVal}
          onChange={value => setCustomVal(value)}
          suffix={<span className="color-info">实际输出的value不包含`✨`：{customVal}</span>}
          formatter={value => `✨${value}`}
          parser={value => value.replace('✨', '')}
        />
      </div>
    </div>
  );
};

export default Demo;
