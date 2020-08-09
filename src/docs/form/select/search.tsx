import Select, { mergeOptions } from 'm78/select';
import React, { useState } from 'react';

import { options } from './utils';

function getFakeOption(label: string) {
  return new Promise(res => {
    setTimeout(
      () =>
        res({
          label,
          value: label,
        }),
      1000,
    );
  });
}

const Demo3 = () => {
  const [opt, setOpt] = useState(options);
  const [loading, setLoading] = useState(false);

  return (
    <div style={{ maxWidth: 360 }}>
      <h3>从本地选项中搜索</h3>
      <Select search multiple defaultValue={[1, 2]} options={opt} placeholder="请选择" />

      <h3 className="mt-24">本地搜索 + 服务端搜索</h3>
      <Select
        listLoading={loading}
        search
        onSearch={key => {
          setLoading(true);
          // 模拟服务端请求，并将返回数据通过工具方法mergeOptions合并到选项中
          getFakeOption(key)
            .then((fetchOpts: any) => {
              setOpt(prev => mergeOptions(prev, [fetchOpts]));
            })
            .finally(() => {
              setLoading(false);
            });
        }}
        multiple
        options={opt}
        placeholder="请选择"
      />

      <h3 className="mt-24">新增tag到服务器并同步选项</h3>
      <Select
        listLoading={loading}
        search
        onAddTag={(key, check) => {
          setLoading(true);
          // 模拟服务端请求，新增tag成功后将其合并到选择中
          getFakeOption(key)
            .then((fetchOpts: any) => {
              setOpt(prev => mergeOptions(prev, [fetchOpts]));
              // 合并选项后将其设置为选中状态，如果作为受控组件使用，直接更改value指向的值
              check(key);
            })
            .finally(() => {
              setLoading(false);
            });
        }}
        multiple
        options={opt}
        placeholder="请选择"
      />
    </div>
  );
};

export default Demo3;
