import React, { useEffect, useMemo, useState } from 'react';
import { createAuthPro } from 'm78/auth';
import { createSeed } from 'm78/seed';
import { CheckBox } from 'm78/check-box';
import { Divider, Tile } from 'm78/layout';

const AuthPro = createAuthPro({
  seed: createSeed(),
  // 为权限名赋予语义化的名称
  authNameMap: {
    user: '用户',
    news: '新闻',
  },
});

const options = [
  {
    label: '创建',
    value: 'c',
  },
  {
    label: '查询',
    value: 'r',
  },
  {
    label: '更新',
    value: 'u',
  },
  {
    label: '删除',
    value: 'd',
  },
];

const Base = () => {
  const [checked, setChecked] = useState<string[]>(['c', 'u']);
  const [checked2, setChecked2] = useState<string[]>(['r']);

  const userAuth = useMemo(() => (checked.length ? `user:${checked.join('')}` : ''), [checked]);
  const newsAuth = useMemo(() => (checked2.length ? `news:${checked2.join('')}` : ''), [checked2]);

  useEffect(() => {
    // 更新当前拥有的权限
    AuthPro.setAuth([userAuth, newsAuth]);
  }, [checked, checked2]);

  return (
    <div>
      <div>
        <h3>开启权限:</h3>
        <Tile
          leading="用户: "
          title={<CheckBox options={[...options]} value={checked} onChange={setChecked} />}
          crossAlign="center"
        />
        <Tile
          leading="新闻: "
          title={<CheckBox options={[...options]} value={checked2} onChange={setChecked2} />}
          crossAlign="center"
        />

        <Divider />
        <h3>当前拥有的权限:</h3>
        <div>用户: `{userAuth || '无'}`</div>
        <div className="mt-4">新闻: `{newsAuth || '无'}`</div>

        <Divider />
        <h3>需要的权限:</h3>
        <div>用户: `user:cru`</div>
        <div className="mt-4">新闻: `news:cu`</div>
      </div>

      <Divider />

      <h3>权限验证:</h3>

      <AuthPro
        // 功能需要的权限
        keys={['user:cru', 'news:cu']}
      >
        <div className="tc ptb-32">
          <div className="fs-lg">😀</div>
          <div className="fs-md color-success bold">权限验证通过</div>
          <div className="fs color-second mt-8">这里是需要权限验证的内容</div>
        </div>
      </AuthPro>
    </div>
  );
};

export default Base;
