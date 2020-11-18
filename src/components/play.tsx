import React from 'react';
import Tree from 'm78/tree';
import { OptionsItem } from 'm78/tree/types';
import Modal from 'm78/modal';
import ErrorBoundary from 'm78/error-boundary';
import { Divider } from 'm78/layout';
import create from 'm78/auth';
import Input from './input';

function mockTreeData(length: number, z: number, label = '选项') {
  const ls: OptionsItem[] = [];

  function gn(list: OptionsItem = [], vp: string, cZInd = 0) {
    Array.from({ length }).forEach((_, index) => {
      const v = vp ? `${vp}-${index + 1}` : String(index + 1);
      const children: OptionsItem[] = [];

      const current: OptionsItem = {
        label: `${label} ${v}`,
        value: v,
        children: Math.random() > 0.5 ? [] : undefined,
      };

      list.push(current);

      if (cZInd !== z) {
        current.children = children;
        gn(children, v, cZInd + 1);
      }
    });
  }

  gn(ls, '');

  return ls;
}

const opt = mockTreeData(5, 5);

const { Auth, setDeps, useAuth, useDeps } = create({
  /* 被所有验证器依赖数据 */
  dependency: {
    name: 'q',
    admin: 2,
    usr: {
      age: 18,
      sex: 1,
    },
  },
  /* 声明验证器 */
  validators: {
    // 登录状态
    login(deps) {
      // 验证未通过时，返回提示信息，还可以同时返回对应的操作
      if (!deps.name) {
        return {
          label: '未登录',
          desc: '请登录后再进行操作',
          actions: [
            // 每一项都是一个Button props
            {
              label: '去登陆',
              color: 'red',
              onClick() {
                window.alert('去登录');
              },
            },
            {
              label: '算了',
              onClick() {
                window.alert('算了');
              },
            },
          ],
        };
      }
    },
    // 是否是管理员
    admin(deps) {
      if (deps.admin !== 1) {
        return {
          label: '管理员可用',
          desc: '请联系管理员执行此操作!',
          actions: [
            // 每一项都是一个Button props
            {
              label: '联系管理员',
              color: 'blue',
              onClick() {
                window.alert('联系管理员');
              },
            },
          ],
        };
      }
    },
    asyncValidator() {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({
            label: '这是一个异步验证器',
          });
        }, 2000);
      });
    },
  },
});

const Play = () => {
  const deps = useDeps(dp => dp.usr);

  console.log('render', deps);

  return (
    <div>
      <pre>{JSON.stringify(deps, null, 4)}</pre>

      <button onClick={() => setDeps({ name: 'lxj' })}>login</button>
      <button onClick={() => setDeps({ name: '' })}>login out</button>

      <button onClick={() => setDeps({ admin: 1 })}>set admin</button>
      <button onClick={() => setDeps({ admin: 2 })}>unset admin</button>

      <Divider />

      {/* <Tree */}
      {/*  multipleCheckable */}
      {/*  defaultValue={['1-1-1-1-1-1']} */}
      {/*  rainbowIndicatorLine */}
      {/*  onChange={(a, b) => { */}
      {/*    console.log('change', a, b); */}
      {/*  }} */}
      {/*  dataSource={opt} */}
      {/*  height={400} */}
      {/*  toolbar */}
      {/* /> */}
    </div>
  );
};

export default Play;
